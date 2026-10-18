import { ImapFlow } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import {
  appendEmailLog,
  readSeenMessages,
  writeSeenMessages,
} from "./csv-ledger";
import { openDuesFor, sameEmail } from "./collections";
import { sendAutoReply, invoiceEmailTag } from "./email";
import { getInvoice } from "./db";
import type { AiImage } from "./local-ai";
import { mailCredentials, receivingConfigured } from "./mail-credentials";
import { extractInvoiceIdFromText, processInboundPayment } from "./settle";
import { formatMoney } from "./format";
import type { Invoice } from "./types";

export type InboxResult = {
  checked: number;
  settled: number;
  needsReview: number;
  ignored: number;
  errors: string[];
};

/** Drop quoted history ("> ..." and "On ... wrote:") so only the customer's own words are analysed. */
function ownWords(text: string) {
  const cut = text.search(/\n\s*(On .{5,120} wrote:|-{2,}\s*Original Message|From:\s.+\nSent:)/i);
  const body = cut > 0 ? text.slice(0, cut) : text;
  return body
    .split("\n")
    .filter((l) => !l.trim().startsWith(">"))
    .join("\n")
    .trim()
    .slice(0, 3000);
}

function isAutomated(mail: ParsedMail, ownAddress: string) {
  const from = mail.from?.value[0]?.address?.toLowerCase() || "";
  if (!from || from === ownAddress) return true;
  if (/(mailer-daemon|postmaster|no-?reply|donotreply)/i.test(from)) return true;
  const auto = String(mail.headers.get("auto-submitted") || "").toLowerCase();
  if (auto && auto !== "no") return true;
  const prec = String(mail.headers.get("precedence") || "").toLowerCase();
  return /bulk|junk|list/.test(prec);
}

async function prepareImages(mail: ParsedMail) {
  const images: AiImage[] = [];
  const files: { buffer: Buffer; ext: string }[] = [];
  for (const att of mail.attachments ?? []) {
    const type = (att.contentType || "").toLowerCase();
    if (att.size > 12 * 1024 * 1024) continue;
    if (/^image\/(png|jpe?g|webp)$/.test(type)) {
      try {
        // Shrink to keep the vision model fast, keep readable text.
        const jpeg = await sharp(att.content)
          .rotate()
          .resize({ width: 1600, height: 2200, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 88 })
          .toBuffer();
        if (images.length < 3) {
          images.push({ mimeType: "image/jpeg", base64: jpeg.toString("base64") });
        }
        files.push({ buffer: att.content, ext: type.includes("png") ? "png" : "jpg" });
      } catch {
        /* unreadable image — ignore */
      }
    } else if (type === "application/pdf" && files.length < 3) {
      // PDFs are kept for the admin to look at, but the vision model reads images only.
      files.push({ buffer: att.content, ext: "pdf" });
    }
  }
  return { images, files };
}

async function handleMessage(mail: ParsedMail, ownAddress: string) {
  const from = mail.from?.value[0]?.address?.toLowerCase() || "";
  const subject = mail.subject || "(no subject)";
  const text = ownWords(mail.text || "");
  const quotedAll = `${mail.subject || ""}\n${mail.text || ""}`;

  // Which invoices is this about? Tags in the subject/quoted mail + anything this sender owes.
  const tagged = new Set<string>();
  for (const m of quotedAll.matchAll(/INV:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi)) {
    tagged.add(m[1].toLowerCase());
  }
  const single = extractInvoiceIdFromText(quotedAll);
  if (single) tagged.add(single.toLowerCase());

  const bySender = await openDuesFor(from);
  const candidates = new Map<string, Invoice>(bySender.map((i) => [i.id, i]));
  let senderMatchesCustomer = bySender.length > 0;

  for (const id of tagged) {
    if (candidates.has(id)) continue;
    const inv = await getInvoice(id);
    if (inv && inv.status !== "paid" && inv.direction === "receivable") {
      candidates.set(inv.id, inv);
      // tagged invoice belongs to someone else's email → never auto-settle
      if (!sameEmail(inv.partyEmail, from)) senderMatchesCustomer = false;
    }
  }

  const open = [...candidates.values()];
  if (open.length === 0) {
    await appendEmailLog({
      id: uuid(),
      at: new Date().toISOString(),
      direction: "inbound",
      email: from,
      partyName: "",
      invoiceIds: [],
      subject,
      outcome: "ignored",
      detail: "No open invoice matches this sender or tag",
    });
    return "ignored" as const;
  }

  const { images, files } = await prepareImages(mail);
  const result = await processInboundPayment({
    openInvoices: open,
    message: text,
    images,
    files,
    senderMatchesCustomer,
  });

  const partyName = open[0].partyName;
  await appendEmailLog({
    id: uuid(),
    at: new Date().toISOString(),
    direction: "inbound",
    email: from,
    partyName,
    invoiceIds: open.map((i) => i.id),
    subject,
    outcome: result.outcome === "settled" ? "settled" : result.outcome === "no_proof" ? "ignored" : "needs_review",
    detail:
      result.outcome === "settled"
        ? `Verified ${result.paymentId}; settled ${result.settled.length} invoice(s)`
        : result.failures.join(" | "),
  });

  // Reply to the customer (never to automated senders — filtered above).
  let reply: string;
  if (result.outcome === "settled") {
    const total = result.settled.reduce((n, i) => n + i.amount, 0);
    reply = `Hi ${partyName},\n\nThank you — we have verified your payment${result.paymentId ? ` (ref ${result.paymentId})` : ""} and marked ${result.settled.length} invoice${result.settled.length === 1 ? "" : "s"} as paid (${formatMoney(total, result.settled[0].currency)}).\n\nNo further action is needed.`;
  } else if (result.outcome === "no_proof") {
    reply = `Hi ${partyName},\n\nWe received your reply but could not find any payment proof in it. Please reply again and attach a screenshot of the payment showing the amount, the transaction ID, and who you paid.\n\nKeep ${invoiceEmailTag(open[0].id)} in the subject.`;
  } else {
    reply = `Hi ${partyName},\n\nThank you — we received your payment proof. We could not confirm it automatically, so it has been passed to our team to check. You will hear from us once it is confirmed.`;
  }
  const sent = await sendAutoReply({
    to: from,
    subject,
    text: reply,
    inReplyTo: mail.messageId,
  });
  await appendEmailLog({
    id: uuid(),
    at: new Date().toISOString(),
    direction: "outbound",
    email: from,
    partyName,
    invoiceIds: open.map((i) => i.id),
    subject: `Re: ${subject}`,
    outcome: sent.sent ? "sent" : "failed",
    detail: sent.sent ? `Auto-reply (${result.outcome})` : sent.error || "failed",
  });

  void ownAddress;
  return result.outcome === "settled" ? ("settled" as const) : result.outcome === "no_proof" ? ("ignored" as const) : ("needs_review" as const);
}

let running = false;

/** Read new mail from the Remitra mailbox and process customer payment replies. */
export async function pollInbox(): Promise<InboxResult> {
  const result: InboxResult = { checked: 0, settled: 0, needsReview: 0, ignored: 0, errors: [] };
  if (!receivingConfigured()) {
    result.errors.push("Mailbox not configured (set MAIL_EMAIL and MAIL_PASSWORD)");
    return result;
  }
  if (running) {
    result.errors.push("A check is already running");
    return result;
  }
  running = true;

  const c = mailCredentials();
  const client = new ImapFlow({
    host: c.imap.host,
    port: c.imap.port,
    secure: c.imap.secure,
    auth: { user: c.email, pass: c.password },
    logger: false,
  });
  client.on("error", () => {});

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      const seen = await readSeenMessages();
      const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const uids = (await client.search({ seen: false, since })) || [];
      for (const uid of uids) {
        try {
          const msg = await client.fetchOne(String(uid), { source: true }, { uid: true });
          if (!msg || !msg.source) continue;
          const mail = await simpleParser(msg.source);
          const key = mail.messageId || `uid-${uid}`;
          if (seen.has(key)) continue;
          result.checked += 1;

          if (isAutomated(mail, c.fromAddress)) {
            result.ignored += 1;
          } else {
            const outcome = await handleMessage(mail, c.fromAddress);
            if (outcome === "settled") result.settled += 1;
            else if (outcome === "needs_review") result.needsReview += 1;
            else result.ignored += 1;
          }
          seen.add(key);
          await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
        } catch (err) {
          result.errors.push(err instanceof Error ? err.message : String(err));
        }
      }
      await writeSeenMessages(seen);
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (err) {
    result.errors.push(
      `Could not read mailbox: ${err instanceof Error ? err.message : String(err)}`,
    );
    try {
      client.close();
    } catch {
      /* ignore */
    }
  } finally {
    running = false;
  }
  return result;
}
