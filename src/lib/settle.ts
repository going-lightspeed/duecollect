import { promises as fs } from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { addPayment, readStore, updatePayment, upsertInvoice } from "./db";
import {
  assessEvidence,
  extractPaymentEvidence,
  type PaymentEvidence,
} from "./ai-verify";
import type { AiImage } from "./local-ai";
import { getAdminQr } from "./qr-store";
import type { Invoice, Payment, SettlementMethod } from "./types";

export async function markInvoicePaid(
  invoice: Invoice,
  opts: {
    paymentId: string;
    method: SettlementMethod;
    note?: string;
    rawMessage?: string;
    verifiedByAi?: boolean;
    confirmedBy?: string;
  },
): Promise<{ invoice: Invoice; payment: Payment }> {
  const now = new Date().toISOString();

  // If this customer already has a pending report with the same transaction id
  // on this invoice (e.g. an earlier blurry attempt), upgrade it instead of
  // leaving a stale duplicate for the admin.
  const store = await readStore();
  const pending = store.payments.find(
    (p) =>
      p.invoiceId === invoice.id &&
      p.status === "reported" &&
      p.paymentId.toLowerCase() === opts.paymentId.toLowerCase(),
  );

  const payment: Payment = pending
    ? (await updatePayment(pending.id, {
        status: "confirmed",
        confirmedAt: now,
        confirmedBy: opts.confirmedBy || opts.method,
        note: opts.note || pending.note,
        verifiedByAi: opts.verifiedByAi,
      }))!
    : await addPayment({
        id: uuid(),
        invoiceId: invoice.id,
        paymentId: opts.paymentId,
        amount: invoice.amount,
        currency: invoice.currency,
        partyName: invoice.partyName,
        note: opts.note || "",
        status: "confirmed",
        reportedAt: now,
        confirmedAt: now,
        confirmedBy: opts.confirmedBy || opts.method,
        rawMessage: opts.rawMessage,
        verifiedByAi: opts.verifiedByAi,
      });

  const updated = await upsertInvoice({
    ...invoice,
    status: "paid",
    paidAt: now,
    paymentId: opts.paymentId,
    settlementMethod: opts.method,
  });

  return { invoice: updated, payment };
}

const EVIDENCE_DIR = path.join(process.cwd(), "data", "evidence");

export function evidencePath(name: string) {
  // basename only — never trust a path from the URL
  return path.join(EVIDENCE_DIR, path.basename(name));
}

async function saveEvidence(
  buf: Buffer,
  ext: string,
): Promise<string> {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  const name = `${Date.now()}-${uuid().slice(0, 8)}.${ext}`;
  await fs.writeFile(evidencePath(name), buf);
  return name;
}

export type InboundOutcome = {
  outcome: "settled" | "needs_review" | "no_proof";
  settled: Invoice[];
  failures: string[];
  warnings: string[];
  paymentId: string | null;
  evidence: PaymentEvidence | null;
};

/**
 * A customer replied with a bill. The local AI reads it, then code checks it
 * (amount, receiving account, unused txn id, no tampering, sender). Only if
 * every check passes is the invoice marked paid; otherwise the payment is
 * stored as "reported" with the reasons so the admin can decide.
 */
export async function processInboundPayment(opts: {
  openInvoices: Invoice[];
  message: string;
  images: AiImage[];
  files: { buffer: Buffer; ext: string }[];
  senderMatchesCustomer: boolean;
}): Promise<InboundOutcome> {
  const { openInvoices, message, images, files } = opts;

  const noText = message.trim().length < 12;
  if (images.length === 0 && files.length === 0 && noText) {
    return {
      outcome: "no_proof",
      settled: [],
      failures: ["Reply contained no payment proof"],
      warnings: [],
      paymentId: null,
      evidence: null,
    };
  }

  const evidence = await extractPaymentEvidence(message, images);
  const store = await readStore();
  const verdict = assessEvidence({
    evidence,
    openInvoices,
    qr: await getAdminQr(),
    existingPayments: store.payments,
    senderMatchesCustomer: opts.senderMatchesCustomer,
    hasImage: images.length > 0,
  });

  const evidenceFile = files[0]
    ? await saveEvidence(files[0].buffer, files[0].ext)
    : undefined;

  if (verdict.verified) {
    const paymentId = verdict.paymentId!;
    const settled: Invoice[] = [];
    for (const id of verdict.settleInvoiceIds) {
      const inv = openInvoices.find((i) => i.id === id);
      if (!inv) continue;
      const { invoice, payment } = await markInvoicePaid(inv, {
        paymentId,
        method: "ai_email_reply",
        note: evidence?.reason || "Verified from emailed bill",
        rawMessage: message.slice(0, 2000),
        verifiedByAi: true,
        confirmedBy: "ai",
      });
      if (evidenceFile) await updatePayment(payment.id, { evidenceFile });
      settled.push(invoice);
    }
    return {
      outcome: "settled",
      settled,
      failures: [],
      warnings: verdict.warnings,
      paymentId,
      evidence,
    };
  }

  // Not provable → park for the admin on the most plausible invoice.
  const target =
    (evidence?.amount != null
      ? openInvoices.find((i) => Math.round(i.amount * 100) === Math.round(evidence.amount! * 100))
      : undefined) ?? openInvoices[0];
  if (target) {
    const now = new Date().toISOString();
    await addPayment({
      id: uuid(),
      invoiceId: target.id,
      paymentId: evidence?.txnId || `UNVERIFIED-${Date.now().toString(36).toUpperCase()}`,
      amount: evidence?.amount ?? target.amount,
      currency: evidence?.currency || target.currency,
      partyName: target.partyName,
      note: `Needs review: ${verdict.failures.join(" | ")}`,
      status: "reported",
      reportedAt: now,
      rawMessage: message.slice(0, 2000),
      verifiedByAi: false,
      evidenceFile,
    });
  }
  return {
    outcome: "needs_review",
    settled: [],
    failures: verdict.failures,
    warnings: verdict.warnings,
    paymentId: evidence?.txnId ?? null,
    evidence,
  };
}

/** Extract invoice id from email subject/body like [Remitra INV:uuid] */
export function extractInvoiceIdFromText(...parts: string[]): string | null {
  const blob = parts.join("\n");
  const m =
    blob.match(/\[Remitra\s+INV:([0-9a-f-]{36})\]/i) ||
    blob.match(/INV:([0-9a-f-]{36})/i) ||
    blob.match(
      /\/pay\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
    );
  return m?.[1] ?? null;
}
