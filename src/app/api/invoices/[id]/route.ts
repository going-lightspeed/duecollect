import { NextResponse } from "next/server";
import { deleteInvoice, getInvoice, upsertInvoice } from "@/lib/db";
import { refreshInvoiceStatus } from "@/lib/reminders";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await getInvoice(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  let next = { ...existing, ...body, id: existing.id };

  if (body.status === "paid" && !existing.paidAt) {
    next.paidAt = new Date().toISOString();
    next.status = "paid";
  } else if (body.status === "pending") {
    next.paidAt = undefined;
    next = refreshInvoiceStatus({ ...next, status: "pending" });
  }

  const saved = await upsertInvoice(next);
  return NextResponse.json({ invoice: saved });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ok = await deleteInvoice(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
