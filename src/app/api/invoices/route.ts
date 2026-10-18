import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { isAdminLoggedIn } from "@/lib/auth";
import { listInvoices, upsertInvoice } from "@/lib/db";
import { refreshInvoiceStatus } from "@/lib/reminders";
import type { CreateInvoiceInput, Invoice } from "@/lib/types";

export async function GET() {
  const invoices = await listInvoices();
  const refreshed = await Promise.all(
    invoices.map(async (inv) => {
      const next = refreshInvoiceStatus(inv);
      if (next.status !== inv.status) await upsertInvoice(next);
      return next;
    }),
  );
  return NextResponse.json({ invoices: refreshed });
}

export async function POST(request: Request) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }

  const body = (await request.json()) as CreateInvoiceInput;

  if (!body.partyName?.trim() || !body.dueDate || !body.amount) {
    return NextResponse.json(
      { error: "partyName, amount, and dueDate are required" },
      { status: 400 },
    );
  }

  if (!["payable", "receivable"].includes(body.direction)) {
    return NextResponse.json(
      { error: "direction must be payable or receivable" },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const invoice: Invoice = {
    id: uuid(),
    direction: body.direction,
    partyName: body.partyName.trim(),
    partyEmail: (body.partyEmail ?? "").trim(),
    amount: Number(body.amount),
    currency: body.currency?.trim() || "USD",
    description: (body.description ?? "").trim(),
    issueDate: body.issueDate || now.slice(0, 10),
    dueDate: body.dueDate,
    graceDays: body.graceDays ?? 7,
    status: "pending",
    reminderDaysBefore: body.reminderDaysBefore ?? [7, 3, 1],
    createdAt: now,
  };

  const saved = await upsertInvoice(refreshInvoiceStatus(invoice));
  return NextResponse.json({ invoice: saved }, { status: 201 });
}
