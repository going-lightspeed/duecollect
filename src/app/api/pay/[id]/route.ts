import { NextResponse } from "next/server";
import { getInvoice, getPaymentsForInvoice } from "@/lib/db";
import { buildPaymentQrDataUrl } from "@/lib/payment";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const invoice = await getInvoice(id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const qr = await buildPaymentQrDataUrl(invoice);
  const payments = await getPaymentsForInvoice(id);

  return NextResponse.json({
    invoice: {
      id: invoice.id,
      partyName: invoice.partyName,
      amount: invoice.amount,
      currency: invoice.currency,
      description: invoice.description,
      dueDate: invoice.dueDate,
      status: invoice.status,
      direction: invoice.direction,
      paymentId: invoice.paymentId,
    },
    qr,
    payments: payments.map((p) => ({
      paymentId: p.paymentId,
      status: p.status,
      reportedAt: p.reportedAt,
    })),
  });
}
