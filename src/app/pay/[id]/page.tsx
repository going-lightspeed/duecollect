"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatDate, formatMoney } from "@/lib/format";

type PayData = {
  invoice: {
    id: string;
    partyName: string;
    amount: number;
    currency: string;
    description: string;
    dueDate: string;
    status: string;
    direction: string;
    paymentId?: string;
  };
  qr: {
    kind: string;
    payload: string;
    note: string;
    upiId: string;
    payeeName: string;
    dataUrl: string;
    payUrl: string;
  };
  payments: { paymentId: string; status: string; reportedAt: string }[];
};

export default function PayPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<PayData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/pay/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Invoice not found");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [params.id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: params.id,
          paymentId,
          note,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save payment");
      setDone(true);
      const refreshed = await fetch(`/api/pay/${params.id}`).then((r) =>
        r.json(),
      );
      setData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (error && !data) {
    return (
      <main className="app-shell mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[var(--coral)]">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="app-shell mx-auto max-w-lg px-4 py-16 text-center text-[var(--ink-soft)]">
        Loading payment page…
      </main>
    );
  }

  const { invoice, qr } = data;
  const paid = invoice.status === "paid";

  return (
    <main className="app-shell mx-auto max-w-lg px-4 py-10 sm:py-14">
      <div className="animate-fade-up mb-8 text-center">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--sage-deep)] uppercase">
          Remitra Pay
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          {paid ? "Invoice paid" : "Scan to pay"}
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          {invoice.partyName} · due {formatDate(invoice.dueDate)}
        </p>
      </div>

      <section className="animate-fade-up-delay-1 panel rounded-2xl p-6 text-center">
        <p className="font-display text-3xl font-semibold">
          {formatMoney(invoice.amount, invoice.currency)}
        </p>
        {invoice.description && (
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {invoice.description}
          </p>
        )}

        {!paid && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.dataUrl}
              alt="Payment QR code"
              className="mx-auto mt-6 rounded-xl border border-[var(--line)]"
              width={280}
              height={280}
            />
            <p className="mt-3 text-xs text-[var(--ink-soft)]">
              {qr.kind === "upi"
                ? `UPI · ${qr.upiId} · note ${qr.note}`
                : qr.kind === "image"
                  ? "Scan with any UPI / banking app to pay"
                  : "Scan to open this payment page on your phone"}
            </p>
            {qr.kind === "upi" && (
              <a
                href={qr.payload}
                className="btn btn-primary mt-4 inline-flex"
              >
                Open UPI app
              </a>
            )}
          </>
        )}
      </section>

      {!paid && (
        <section className="animate-fade-up-delay-2 panel mt-6 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold">
            After you pay, enter payment ID
          </h2>
          <p className="mt-1 mb-4 text-sm text-[var(--ink-soft)]">
            Paste your UPI / bank / gateway transaction ID so admin can confirm
            it in the database.
          </p>

          {done ? (
            <p className="rounded-xl bg-[var(--sage)]/15 px-4 py-3 text-sm text-[var(--sage-deep)]">
              Payment ID submitted. Admin will confirm and mark the invoice
              paid.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                className="input"
                required
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                placeholder="e.g. UPI-20261017-ABCDEF"
              />
              <input
                className="input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note"
              />
              {error && (
                <p className="text-sm text-[var(--coral)]">{error}</p>
              )}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={saving}
              >
                {saving ? "Saving…" : "Submit payment ID"}
              </button>
            </form>
          )}
        </section>
      )}

      {data.payments.length > 0 && (
        <section className="mt-6 text-sm text-[var(--ink-soft)]">
          <p className="font-semibold text-[var(--ink)]">Payment history</p>
          <ul className="mt-2 space-y-1">
            {data.payments.map((p) => (
              <li key={p.paymentId + p.reportedAt}>
                {p.paymentId} · {p.status} · {formatDate(p.reportedAt)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
