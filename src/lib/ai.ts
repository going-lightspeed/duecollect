import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { localAiSettings, localChat } from "./local-ai";
import type { Invoice, ReminderKind } from "./types";

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function templateMessage(
  invoice: Invoice,
  kind: ReminderKind,
  daysRelative: number,
): string {
  const amt = money(invoice.amount, invoice.currency);
  const party = invoice.partyName;

  if (invoice.direction === "payable") {
    if (kind === "upcoming") {
      return `Heads up — ${amt} is due to ${party} in ${daysRelative} day${daysRelative === 1 ? "" : "s"} (${invoice.dueDate}). Set funds aside so payment stays on time.`;
    }
    if (kind === "due_today") {
      return `Payment due today: ${amt} owed to ${party}. Settle invoice “${invoice.description || "bill"}” to avoid late fees.`;
    }
    return `Overdue by ${daysRelative} day${daysRelative === 1 ? "" : "s"}: you still owe ${party} ${amt}. Pay as soon as you can to clear this balance.`;
  }

  if (kind === "upcoming") {
    return `${party} should pay ${amt} in ${daysRelative} day${daysRelative === 1 ? "" : "s"} (${invoice.dueDate}). A gentle nudge now keeps cash flow predictable.`;
  }
  if (kind === "due_today") {
    return `${party}'s invoice for ${amt} is due today. Confirm receipt or send a same-day reminder.`;
  }
  return `${party} has not paid ${amt} — ${daysRelative} day${daysRelative === 1 ? "" : "s"} past due (grace applied). Follow up now and escalate if needed.`;
}

export async function craftReminder(
  invoice: Invoice,
  kind: ReminderKind,
  daysRelative: number,
): Promise<{ message: string; aiGenerated: boolean }> {
  const fallback = templateMessage(invoice, kind, daysRelative);

  const role =
    invoice.direction === "payable"
      ? "user owes a vendor"
      : "client owes the user";

  try {
    const text = await localChat({
      system:
        "Write one short invoice reminder (max 2 sentences). Professional, warm, actionable. No subject line. No markdown.",
      user: [
        `kind=${kind}`,
        `role=${role}`,
        `party=${invoice.partyName}`,
        `amount=${money(invoice.amount, invoice.currency)}`,
        `due=${invoice.dueDate}`,
        `days=${daysRelative}`,
        `note=${invoice.description || "n/a"}`,
      ].join(" | "),
      maxTokens: 90,
      temperature: 0.4,
    });
    if (!text) return { message: fallback, aiGenerated: false };
    return { message: text, aiGenerated: true };
  } catch (err) {
    console.error("Local AI reminder failed, using template:", err);
    return { message: fallback, aiGenerated: false };
  }
}

/* ------------------------------------------------------------------ */
/* Customer email that takes ALL of a customer's dues into account     */
/* ------------------------------------------------------------------ */

export type DueLine = {
  invoice: Invoice;
  daysOverdue: number; // <= 0 means not yet due
};

export function toDueLines(invoices: Invoice[]): DueLine[] {
  const today = startOfDay(new Date());
  return invoices
    .map((invoice) => ({
      invoice,
      daysOverdue: differenceInCalendarDays(
        today,
        startOfDay(parseISO(invoice.dueDate)),
      ),
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

function sumByCurrency(lines: DueLine[]) {
  const totals = new Map<string, number>();
  for (const { invoice } of lines) {
    totals.set(
      invoice.currency,
      (totals.get(invoice.currency) ?? 0) + invoice.amount,
    );
  }
  return [...totals.entries()]
    .map(([cur, amt]) => money(amt, cur))
    .join(" + ");
}

function templateEmailBody(
  name: string,
  lines: DueLine[],
  hasQr: boolean,
): string {
  const overdue = lines.filter((l) => l.daysOverdue > 0);
  const total = sumByCurrency(lines);
  const pay = hasQr
    ? "You can pay by scanning the QR code attached to this email."
    : "Please use the payment details we have shared with you.";
  if (overdue.length === 0) {
    return `Hi ${name},\n\nA quick reminder that ${total} is coming up for payment, as itemised below. ${pay}\n\nOnce you have paid, just reply to this email with a screenshot of the payment and we will update our records.\n\nThank you!`;
  }
  const oldest = overdue[0].daysOverdue;
  return `Hi ${name},\n\nOur records show ${overdue.length} overdue payment${overdue.length === 1 ? "" : "s"}, the oldest by ${oldest} day${oldest === 1 ? "" : "s"}, bringing your total outstanding to ${total} (itemised below). ${pay}\n\nOnce you have paid, please reply to this email with a screenshot of the payment so we can update our records. If you have already paid, send us the receipt and we will sort it out straight away.\n\nThank you.`;
}

/**
 * Local AI writes the covering note for a customer. The itemised table,
 * QR and reference tags are added by code so figures are never invented.
 */
export async function composeDuesEmail(opts: {
  customerName: string;
  lines: DueLine[];
  businessName: string;
  hasQr: boolean;
  qrPayee?: string | null;
}): Promise<{ subject: string; body: string; aiGenerated: boolean }> {
  const { customerName, lines, businessName, hasQr } = opts;
  const overdue = lines.filter((l) => l.daysOverdue > 0);
  const total = sumByCurrency(lines);
  const subject =
    overdue.length > 0
      ? `Overdue payment${overdue.length === 1 ? "" : "s"} — ${total} outstanding`
      : `Payment reminder — ${total} due`;
  const fallback = templateEmailBody(customerName, lines, hasQr);

  const facts = lines
    .map(
      ({ invoice, daysOverdue }) =>
        `- ${money(invoice.amount, invoice.currency)} for "${invoice.description || "invoice"}", due ${invoice.dueDate} (${
          daysOverdue > 0
            ? `${daysOverdue} days overdue`
            : daysOverdue === 0
              ? "due today"
              : `due in ${-daysOverdue} days`
        })`,
    )
    .join("\n");

  try {
    const text = await localChat({
      system: [
        `You write payment-collection emails on behalf of ${businessName}.`,
        "Write ONLY the email body: a greeting, 2-3 short paragraphs, and a sign-off. No subject line, no markdown, no tables.",
        "Take ALL the dues into account: mention how many are outstanding, the total, and acknowledge the oldest overdue one.",
        "Tone: warm and professional if nothing is overdue; politely firm if something is overdue for more than 14 days. Never threaten.",
        "Say the payment QR code is attached (if hasQr=yes) and that after paying they should REPLY to this email with a screenshot or receipt of the payment.",
        "Do not invent amounts, dates, links, or bank details. An itemised list is added below your text automatically.",
      ].join(" "),
      user: [
        `customer=${customerName}`,
        `hasQr=${hasQr ? "yes" : "no"}`,
        `total=${total}`,
        `dues:`,
        facts,
      ].join("\n"),
      maxTokens: 300,
      temperature: 0.4,
    });
    if (text.length < 40) return { subject, body: fallback, aiGenerated: false };
    return { subject, body: text, aiGenerated: true };
  } catch (err) {
    console.error("Local AI email compose failed, using template:", err);
    return { subject, body: fallback, aiGenerated: false };
  }
}

export function aiConfigStatus() {
  const cfg = localAiSettings();
  return {
    configured: process.env.LOCAL_AI_DISABLED !== "true",
    model: cfg.model,
    baseUrl: cfg.baseUrl,
  };
}
