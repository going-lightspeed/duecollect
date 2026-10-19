import nodemailer from "nodemailer";
import { appBaseUrl, emailConfigured } from "./config";
import { mailCredentials } from "./mail-credentials";
import type { DueLine } from "./ai";
import type { Invoice, Reminder } from "./types";
import { formatMoney } from "./format";

export function mailStatus() {
  const c = mailCredentials();
  return {
    configured: emailConfigured(),
    from: c.from || null,
    replyTo: process.env.SMTP_REPLY_TO || c.from || null,
    inboxHost: c.imap.host || null,
  };
}

function transporter() {
  if (!emailConfigured()) return null;
  const c = mailCredentials();
  return nodemailer.createTransport({
    host: c.smtp.host,
    port: c.smtp.port,
    secure: c.smtp.secure,
    auth: { user: c.email, pass: c.password },
  });
}

export function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function invoiceEmailTag(invoiceId: string) {
  return `[DueCollect INV:${invoiceId}]`;
}

/** Public pay-page links are only useful when the app isn't on localhost. */
function publicPayUrl(invoiceId: string): string | null {
  const base = appBaseUrl();
  if (/localhost|127\.0\.0\.1/.test(base)) return null;
  return `${base}/pay/${invoiceId}`;
}

/* ------------------------------------------------------------------ */
/* Customer dues email: AI covering note + itemised dues + QR attached */
/* ------------------------------------------------------------------ */
export async function sendDuesMail(opts: {
  to: string;
  customerName: string;
  subject: string;
  body: string;
  lines: DueLine[];
  qr?: { buffer: Buffer; mimeType: string } | null;
}): Promise<{ sent: boolean; error?: string; subject: string }> {
  const transport = transporter();
  const c = mailCredentials();
  // First line carries the tag so replies are matched even if the subject is edited.
  const primary = opts.lines[0]?.invoice;
  const subject = primary
    ? `${invoiceEmailTag(primary.id)} ${opts.subject}`
    : opts.subject;
  if (!transport) return { sent: false, error: "Email not configured", subject };

  const rows = opts.lines
    .map(({ invoice, daysOverdue }) => {
      const status =
        daysOverdue > 0
          ? `<span style="color:#b3402a">${daysOverdue}d overdue</span>`
          : daysOverdue === 0
            ? "Due today"
            : `Due in ${-daysOverdue}d`;
      const link = publicPayUrl(invoice.id);
      return `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #dde7df">${esc(invoice.description || "Invoice")}<br/><span style="font-size:11px;color:#6b7f74">${invoiceEmailTag(invoice.id)}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #dde7df;white-space:nowrap">${esc(invoice.dueDate)}<br/>${status}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #dde7df;text-align:right;white-space:nowrap"><strong>${esc(formatMoney(invoice.amount, invoice.currency))}</strong>${link ? `<br/><a href="${link}" style="font-size:11px">pay page</a>` : ""}</td>
      </tr>`;
    })
    .join("");

  const html = `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#14221c;line-height:1.55">
    ${opts.body
      .split(/\n{2,}/)
      .map((p) => `<p>${esc(p).replace(/\n/g, "<br/>")}</p>`)
      .join("")}
    <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px;background:#f4f8f5;border-radius:10px">
      <thead><tr style="text-align:left;font-size:12px;color:#3d5248">
        <th style="padding:8px 10px">Invoice</th><th style="padding:8px 10px">Due</th><th style="padding:8px 10px;text-align:right">Amount</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${
      opts.qr
        ? `<p style="text-align:center;margin:22px 0 6px"><img src="cid:payment-qr" alt="Payment QR" width="240" style="border:1px solid #dde7df;border-radius:12px"/></p>
           <p style="text-align:center;font-size:12px;color:#3d5248;margin:0 0 18px">Scan to pay</p>`
        : ""
    }
    <p style="font-size:13px;color:#3d5248"><strong>After paying:</strong> reply to this email and attach a screenshot of the payment. We'll verify it and update your account.</p>
  </div>`;

  const text = [
    opts.body,
    "",
    ...opts.lines.map(
      ({ invoice }) =>
        `- ${invoice.description || "Invoice"} | due ${invoice.dueDate} | ${formatMoney(invoice.amount, invoice.currency)} | ${invoiceEmailTag(invoice.id)}`,
    ),
    "",
    opts.qr ? "The payment QR code is attached." : "",
    "After paying, reply to this email with a screenshot of the payment.",
  ].join("\n");

  try {
    await transport.sendMail({
      from: c.from,
      to: opts.to,
      replyTo: process.env.SMTP_REPLY_TO?.trim() || c.from,
      subject,
      text,
      html,
      attachments: opts.qr
        ? [
            {
              filename: `payment-qr.${opts.qr.mimeType.includes("png") ? "png" : opts.qr.mimeType.includes("webp") ? "webp" : "jpg"}`,
              content: opts.qr.buffer,
              contentType: opts.qr.mimeType,
              cid: "payment-qr",
            },
          ]
        : [],
    });
    return { sent: true, subject };
  } catch (err) {
    console.error("Dues email failed:", err);
    return {
      sent: false,
      subject,
      error: err instanceof Error ? err.message : "Email failed",
    };
  }
}

/** Short automatic reply (receipt / "we're checking" / "please send proof"). */
export async function sendAutoReply(opts: {
  to: string;
  subject: string;
  text: string;
  inReplyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const transport = transporter();
  if (!transport) return { sent: false, error: "Email not configured" };
  const c = mailCredentials();
  try {
    await transport.sendMail({
      from: c.from,
      to: opts.to,
      subject: opts.subject.startsWith("Re:") ? opts.subject : `Re: ${opts.subject}`,
      text: opts.text,
      inReplyTo: opts.inReplyTo,
      references: opts.inReplyTo,
      headers: { "Auto-Submitted": "auto-replied", Precedence: "bulk" },
    });
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Email failed",
    };
  }
}

/** Payable-side reminder (you owe a vendor) — plain reminder to the address on file. */
export async function sendPaymentReminderEmail(
  invoice: Invoice,
  reminder: Reminder,
): Promise<{ sent: boolean; error?: string }> {
  const to = invoice.partyEmail?.trim();
  if (!to) return { sent: false, error: "No party email on invoice" };

  const transport = transporter();
  if (!transport) return { sent: false, error: "SMTP not configured" };

  const amount = formatMoney(invoice.amount, invoice.currency);
  const tag = invoiceEmailTag(invoice.id);
  const c = mailCredentials();
  const subject =
    reminder.kind === "overdue"
      ? `${tag} Overdue — ${amount} still unpaid`
      : reminder.kind === "due_today"
        ? `${tag} Payment due today — ${amount}`
        : `${tag} Payment reminder — ${amount} due ${invoice.dueDate}`;

  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#14221c;line-height:1.5">
    <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#3f6b55">DueCollect</p>
    <h1 style="font-size:22px;margin:8px 0 16px">Payment reminder</h1>
    <p>${esc(reminder.message)}</p>
    <p style="margin:20px 0;padding:16px;background:#eef4ef;border-radius:12px">
      <strong>${esc(invoice.partyName)}</strong><br/>
      Amount: <strong>${esc(amount)}</strong><br/>
      Due: ${esc(invoice.dueDate)}<br/>
      ${invoice.description ? `Note: ${esc(invoice.description)}<br/>` : ""}
      Ref: ${tag}
    </p>
    <p style="font-size:13px;color:#3d5248">Payable reminder for your records.</p>
  </div>`;

  try {
    await transport.sendMail({
      from: c.from,
      to,
      subject,
      text: `${reminder.message}\n\nAmount: ${amount}\nDue: ${invoice.dueDate}\nRef: ${tag}`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Email failed",
    };
  }
}
