import { v4 as uuid } from "uuid";
import { composeDuesEmail, toDueLines } from "./ai";
import { appendEmailLog, readEmailLog } from "./csv-ledger";
import { listInvoices } from "./db";
import { sendDuesMail } from "./email";
import { paymentConfig } from "./config";
import { readAdminQrFile } from "./qr-store";
import { refreshInvoiceStatus } from "./status";
import type { Invoice } from "./types";

export const sameEmail = (a?: string, b?: string) =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

/** Every unpaid receivable owed by this email address (past dues included). */
export async function openDuesFor(email: string): Promise<Invoice[]> {
  const all = await listInvoices();
  return all
    .filter(
      (i) =>
        i.direction === "receivable" &&
        i.status !== "paid" &&
        sameEmail(i.partyEmail, email),
    )
    .map(refreshInvoiceStatus);
}

export type DuesResult = {
  email: string;
  partyName: string;
  invoiceIds: string[];
  sent: boolean;
  skipped?: string;
  error?: string;
  aiGenerated?: boolean;
};

/**
 * Compose (local AI) and send ONE email to a customer covering all their dues,
 * with the admin's QR attached. Logged to data/emails.csv.
 * Unless `force`, skips customers already emailed in the last 20 hours.
 */
export async function sendDuesEmail(
  email: string,
  opts: { force?: boolean } = {},
): Promise<DuesResult> {
  const dues = await openDuesFor(email);
  const partyName = dues[0]?.partyName || email;
  const base = { email, partyName, invoiceIds: dues.map((d) => d.id) };
  if (dues.length === 0) return { ...base, sent: false, skipped: "No open dues" };

  if (!opts.force) {
    const cutoff = Date.now() - 20 * 60 * 60 * 1000;
    const recent = (await readEmailLog(200)).some(
      (e) =>
        e.direction === "outbound" &&
        e.outcome === "sent" &&
        sameEmail(e.email, email) &&
        new Date(e.at).getTime() >= cutoff,
    );
    if (recent) return { ...base, sent: false, skipped: "Emailed within the last 20h" };
  }

  const qr = await readAdminQrFile();
  const lines = toDueLines(dues);
  const mail = await composeDuesEmail({
    customerName: partyName,
    lines,
    businessName: paymentConfig().payeeName,
    hasQr: Boolean(qr),
    qrPayee: qr?.info.upiId,
  });

  const result = await sendDuesMail({
    to: email,
    customerName: partyName,
    subject: mail.subject,
    body: mail.body,
    lines,
    qr: qr ? { buffer: qr.buffer, mimeType: qr.info.mimeType } : null,
  });

  await appendEmailLog({
    id: uuid(),
    at: new Date().toISOString(),
    direction: "outbound",
    email,
    partyName,
    invoiceIds: base.invoiceIds,
    subject: result.subject,
    outcome: result.sent ? "sent" : "failed",
    detail: result.sent
      ? `${mail.aiGenerated ? "AI-written" : "template"} · ${dues.length} due(s)${qr ? " · QR attached" : " · no QR uploaded"}`
      : result.error || "failed",
  });

  return {
    ...base,
    sent: result.sent,
    error: result.error,
    aiGenerated: mail.aiGenerated,
  };
}

/** One email per customer who owes us anything. */
export async function sendDuesToAll(
  opts: { force?: boolean } = {},
): Promise<DuesResult[]> {
  const all = await listInvoices();
  const emails = new Map<string, string>();
  for (const i of all) {
    if (i.direction === "receivable" && i.status !== "paid" && i.partyEmail?.trim()) {
      emails.set(i.partyEmail.trim().toLowerCase(), i.partyEmail.trim());
    }
  }
  const results: DuesResult[] = [];
  for (const email of emails.values()) {
    results.push(await sendDuesEmail(email, opts));
  }
  return results;
}
