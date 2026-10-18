import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import { v4 as uuid } from "uuid";
import { craftReminder } from "./ai";
import {
  addReminder,
  hasRecentReminder,
  listInvoices,
  updateReminder,
  upsertInvoice,
} from "./db";
import { sendDuesEmail } from "./collections";
import { sendPaymentReminderEmail } from "./email";
import { refreshInvoiceStatus } from "./status";
import type { Invoice, Reminder, ReminderKind } from "./types";

function today() {
  return startOfDay(new Date());
}

function pickKind(
  invoice: Invoice,
): { kind: ReminderKind; daysRelative: number } | null {
  const daysUntilDue = differenceInCalendarDays(
    startOfDay(parseISO(invoice.dueDate)),
    today(),
  );

  if (daysUntilDue > 0) {
    const windows = invoice.reminderDaysBefore ?? [7, 3, 1];
    if (windows.includes(daysUntilDue)) {
      return { kind: "upcoming", daysRelative: daysUntilDue };
    }
    return null;
  }

  if (daysUntilDue === 0) {
    return { kind: "due_today", daysRelative: 0 };
  }

  const daysOverdue = Math.abs(daysUntilDue);
  if (daysOverdue > invoice.graceDays) {
    return { kind: "overdue", daysRelative: daysOverdue };
  }

  return null;
}

export async function runReminderScan(): Promise<{
  created: Reminder[];
  checked: number;
  updatedStatuses: number;
  emailsSent: number;
  emailErrors: string[];
}> {
  const invoices = await listInvoices();
  const created: Reminder[] = [];
  let updatedStatuses = 0;
  let emailsSent = 0;
  const emailErrors: string[] = [];

  for (const raw of invoices) {
    if (raw.status === "paid") continue;

    const invoice = refreshInvoiceStatus(raw);
    if (invoice.status !== raw.status) {
      await upsertInvoice(invoice);
      updatedStatuses += 1;
    }

    const pick = pickKind(invoice);
    if (!pick) continue;

    const already = await hasRecentReminder(invoice.id, pick.kind, 20);
    if (already) continue;

    const { message, aiGenerated } = await craftReminder(
      invoice,
      pick.kind,
      pick.daysRelative,
    );

    let reminder: Reminder = {
      id: uuid(),
      invoiceId: invoice.id,
      partyName: invoice.partyName,
      direction: invoice.direction,
      kind: pick.kind,
      message,
      amount: invoice.amount,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      createdAt: new Date().toISOString(),
      aiGenerated,
      daysRelative: pick.daysRelative,
      emailed: false,
    };

    await addReminder(reminder);

    // Receivables: ONE AI-written email per customer covering all their dues,
    // with the admin QR attached. Payables: plain reminder to the address on file.
    if (invoice.partyEmail?.trim()) {
      if (invoice.direction === "receivable") {
        const r = await sendDuesEmail(invoice.partyEmail.trim());
        if (r.sent) {
          emailsSent += 1;
          reminder = (await updateReminder(reminder.id, {
            emailed: true,
            emailTo: invoice.partyEmail.trim(),
          }))!;
        } else if (r.error) {
          emailErrors.push(`${invoice.partyName}: ${r.error}`);
        }
      } else {
        const result = await sendPaymentReminderEmail(invoice, reminder);
        if (result.sent) {
          emailsSent += 1;
          reminder = (await updateReminder(reminder.id, {
            emailed: true,
            emailTo: invoice.partyEmail.trim(),
          }))!;
        } else if (result.error && result.error !== "SMTP not configured") {
          emailErrors.push(`${invoice.partyName}: ${result.error}`);
        }
      }
    }

    created.push(reminder);
  }

  return {
    created,
    checked: invoices.length,
    updatedStatuses,
    emailsSent,
    emailErrors,
  };
}

export { refreshInvoiceStatus };

export function computeStats(invoices: Invoice[]) {
  const open = invoices.filter((i) => i.status !== "paid");
  const payable = open.filter((i) => i.direction === "payable");
  const receivable = open.filter((i) => i.direction === "receivable");
  const overdue = open.filter((i) => i.status === "overdue");

  const sum = (list: Invoice[]) =>
    list.reduce((acc, i) => acc + i.amount, 0);

  return {
    openCount: open.length,
    payableTotal: sum(payable),
    receivableTotal: sum(receivable),
    overdueCount: overdue.length,
    overdueParties: overdue
      .filter((i) => i.direction === "receivable")
      .map((i) => ({
        id: i.id,
        partyName: i.partyName,
        amount: i.amount,
        currency: i.currency,
        dueDate: i.dueDate,
        daysOverdue: differenceInCalendarDays(
          today(),
          startOfDay(parseISO(i.dueDate)),
        ),
      })),
  };
}
