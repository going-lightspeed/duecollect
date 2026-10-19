import { adminGuard } from "@/lib/auth";
import { NextResponse } from "next/server";
import { aiConfigStatus } from "@/lib/ai";
import { listInvoices, listPayments, listReminders, upsertInvoice } from "@/lib/db";
import { mailStatus } from "@/lib/email";
import { computeStats, refreshInvoiceStatus } from "@/lib/reminders";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const invoices = await listInvoices();
  const refreshed = await Promise.all(
    invoices.map(async (inv) => {
      const next = refreshInvoiceStatus(inv);
      if (next.status !== inv.status) await upsertInvoice(next);
      return next;
    }),
  );
  const reminders = await listReminders();
  const payments = await listPayments();
  return NextResponse.json({
    stats: computeStats(refreshed),
    reminderCount: reminders.length,
    paymentCount: payments.length,
    ai: aiConfigStatus(),
    email: mailStatus(),
  });
}
