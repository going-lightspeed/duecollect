import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { isAdminLoggedIn } from "@/lib/auth";
import {
  addPayment,
  getInvoice,
  listPayments,
  updatePayment,
  upsertInvoice,
} from "@/lib/db";
import type { Payment } from "@/lib/types";

export async function GET() {
  const admin = await isAdminLoggedIn();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payments = await listPayments();
  return NextResponse.json({ payments });
}

/** Payer submits payment ID after scanning/paying */
export async function POST(request: Request) {
  const body = await request.json();
  const invoiceId = String(body.invoiceId || "");
  const paymentId = String(body.paymentId || "").trim();
  const note = String(body.note || "").trim();

  if (!invoiceId || !paymentId) {
    return NextResponse.json(
      { error: "invoiceId and paymentId are required" },
      { status: 400 },
    );
  }

  const invoice = await getInvoice(invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  if (invoice.status === "paid") {
    return NextResponse.json(
      { error: "Invoice already paid" },
      { status: 400 },
    );
  }

  const payment: Payment = {
    id: uuid(),
    invoiceId,
    paymentId,
    amount: invoice.amount,
    currency: invoice.currency,
    partyName: invoice.partyName,
    note,
    status: "reported",
    reportedAt: new Date().toISOString(),
  };

  await addPayment(payment);

  // Store payment id on invoice immediately as pending confirmation trail
  await upsertInvoice({
    ...invoice,
    paymentId,
  });

  return NextResponse.json({ payment }, { status: 201 });
}

/** Admin confirms or rejects a reported payment */
export async function PATCH(request: Request) {
  const admin = await isAdminLoggedIn();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "");
  const status = body.status as "confirmed" | "rejected";

  if (!id || !["confirmed", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "id and status (confirmed|rejected) required" },
      { status: 400 },
    );
  }

  const updated = await updatePayment(id, {
    status,
    confirmedAt: new Date().toISOString(),
    confirmedBy: "admin",
  });

  if (!updated) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (status === "confirmed") {
    const invoice = await getInvoice(updated.invoiceId);
    if (invoice) {
      await upsertInvoice({
        ...invoice,
        status: "paid",
        paidAt: new Date().toISOString(),
        paymentId: updated.paymentId,
      });
    }
  }

  return NextResponse.json({ payment: updated });
}
