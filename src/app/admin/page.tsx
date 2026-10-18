"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatMoney } from "@/lib/format";
import type { EmailLogEntry, Invoice, Payment } from "@/lib/types";

type AdminStatus = {
  ai: { model: string; baseUrl: string; reachable: boolean; error?: string };
  mail: {
    configured: boolean;
    inboxConfigured: boolean;
    from: string | null;
  };
  qr: {
    uploadedAt: string;
    upiId: string | null;
    payeeName: string | null;
    readBy: string;
    aiSummary: string | null;
  } | null;
  emails: EmailLogEntry[];
};

export default function AdminPage() {
  const [auth, setAuth] = useState<"loading" | "guest" | "admin">("loading");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [qrCache, setQrCache] = useState<
    Record<string, { dataUrl: string; payUrl: string; note: string }>
  >({});
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [emailCustomers, setEmailCustomers] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    if (!me.authenticated) {
      setAuth("guest");
      return;
    }
    setAuth("admin");
    const [inv, pay] = await Promise.all([
      fetch("/api/invoices").then((r) => r.json()),
      fetch("/api/payments").then((r) => r.json()),
    ]);
    setInvoices(inv.invoices);
    setPayments(pay.payments);
    // AI health check can take a few seconds — don't block the page on it.
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d) => !d.error && setStatus(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load().catch(() => setAuth("guest"));
  }, [load]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setLoginError("Invalid username or password");
      return;
    }
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuth("guest");
    setPayments([]);
  }

  async function showQr(invoiceId: string) {
    setSelected(invoiceId);
    if (qrCache[invoiceId]) return;
    const res = await fetch(`/api/pay/${invoiceId}`);
    const data = await res.json();
    if (!res.ok) return;
    setQrCache((c) => ({
      ...c,
      [invoiceId]: {
        dataUrl: data.qr.dataUrl,
        payUrl: data.qr.payUrl,
        note: data.qr.note,
      },
    }));
  }

  async function uploadQr(e: FormEvent) {
    e.preventDefault();
    if (!qrFile) return;
    setBusy("upload");
    const fd = new FormData();
    fd.append("qr", qrFile);
    fd.append("emailCustomers", String(emailCustomers));
    const res = await fetch("/api/admin/qr", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      flash(data.error || "Upload failed");
      return;
    }
    setQrFile(null);
    setQrCache({});
    flash(
      data.emailing
        ? "QR saved — AI is writing emails to customers with dues"
        : "QR saved",
    );
    await load();
  }

  async function sendDuesNow() {
    setBusy("dues");
    const res = await fetch("/api/admin/send-dues", { method: "POST" });
    const data = await res.json();
    setBusy(null);
    flash(
      res.ok
        ? `Emails sent: ${data.sent}, failed: ${data.failed}`
        : data.error || "Could not send",
    );
    await load();
  }

  async function checkInbox() {
    setBusy("inbox");
    const res = await fetch("/api/inbox/poll", { method: "POST" });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) flash(data.error || "Could not check inbox");
    else if (data.errors?.length) flash(data.errors[0]);
    else
      flash(
        `Checked ${data.checked}: ${data.settled} paid, ${data.needsReview} need review`,
      );
    await load();
  }

  async function setPaymentStatus(
    id: string,
    status: "confirmed" | "rejected",
  ) {
    const res = await fetch("/api/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      flash("Could not update payment");
      return;
    }
    flash(status === "confirmed" ? "Payment confirmed" : "Payment rejected");
    await load();
  }

  if (auth === "loading") {
    return (
      <main className="app-shell mx-auto max-w-md px-4 py-20 text-center text-[var(--ink-soft)]">
        Checking admin session…
      </main>
    );
  }

  if (auth === "guest") {
    return (
      <main className="app-shell mx-auto max-w-md px-4 py-16">
        <div className="animate-fade-up panel rounded-2xl p-6">
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--sage-deep)] uppercase">
            Remitra
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold">
            Admin login
          </h1>
          <p className="mt-2 mb-5 text-sm text-[var(--ink-soft)]">
            Default account is <strong>admin</strong>. Change password via{" "}
            <code>ADMIN_PASSWORD</code> in env.
          </p>
          <form onSubmit={onLogin} className="space-y-3">
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
            />
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
            {loginError && (
              <p className="text-sm text-[var(--coral)]">{loginError}</p>
            )}
            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link href="/" className="text-[var(--teal)]">
              ← Back to dashboard
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const receivables = invoices.filter((i) => i.direction === "receivable");

  return (
    <main className="app-shell mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white">
          {toast}
        </div>
      )}

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--sage-deep)] uppercase">
            Admin
          </p>
          <h1 className="font-display text-3xl font-semibold">
            Payments & QR codes
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            View payable QR links, confirm payment IDs stored in the database.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="btn btn-ghost">
            Dashboard
          </Link>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <section className="panel mb-8 rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold">
          Payment QR & customer emails
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Upload the QR your payments are received on. The local AI reads it,
          writes one email per customer covering all their dues, and attaches
          the QR. When a customer replies with their bill, the AI checks it and
          updates the ledger.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-3 py-1 ${status?.ai.reachable ? "bg-[var(--sage)]/20 text-[var(--sage-deep)]" : "bg-[var(--coral)]/15 text-[var(--coral)]"}`}>
            Local AI: {status ? (status.ai.reachable ? `online · ${status.ai.model}` : "offline — start the Cosmos server") : "checking…"}
          </span>
          <span className={`rounded-full px-3 py-1 ${status?.mail.configured ? "bg-[var(--sage)]/20 text-[var(--sage-deep)]" : "bg-[var(--coral)]/15 text-[var(--coral)]"}`}>
            Email: {status ? (status.mail.configured ? status.mail.from : "set MAIL_EMAIL / MAIL_PASSWORD") : "checking…"}
          </span>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
          <div>
            {status?.qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/qr-image?v=${encodeURIComponent(status.qr.uploadedAt)}`}
                alt="Uploaded payment QR"
                className="w-[180px] rounded-xl border border-[var(--line)]"
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-center text-xs text-[var(--ink-soft)]">
                No QR uploaded yet
              </div>
            )}
          </div>
          <div className="space-y-3">
            {status?.qr && (
              <p className="text-sm text-[var(--ink-soft)]">
                Receiving account:{" "}
                <strong>{status.qr.upiId || "not detected"}</strong>
                {status.qr.payeeName ? ` · ${status.qr.payeeName}` : ""}
                {status.qr.readBy === "none" && (
                  <span className="text-[var(--coral)]">
                    {" "}
                    — couldn&apos;t read this QR, so bills can&apos;t be checked
                    against your account. Try a sharper image.
                  </span>
                )}
              </p>
            )}
            <form onSubmit={uploadQr} className="space-y-3">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setQrFile(e.target.files?.[0] ?? null)}
                className="input"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={emailCustomers}
                  onChange={(e) => setEmailCustomers(e.target.checked)}
                />
                Email every customer with dues after uploading
              </label>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!qrFile || busy === "upload"}
              >
                {busy === "upload" ? "Reading QR…" : "Upload QR"}
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy === "dues"}
                onClick={sendDuesNow}
              >
                {busy === "dues" ? "Writing emails…" : "Email customers now"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy === "inbox" || !status?.mail.inboxConfigured}
                onClick={checkInbox}
              >
                {busy === "inbox" ? "Checking…" : "Check inbox for replies"}
              </button>
            </div>
          </div>
        </div>

        {status && status.emails.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Recent emails (from emails.csv)</h3>
            <ul className="mt-2 divide-y divide-[var(--line)] text-sm">
              {status.emails.slice(0, 8).map((m) => (
                <li key={m.id} className="py-2">
                  <span className="text-xs uppercase text-[var(--ink-soft)]">
                    {m.direction === "outbound" ? "→ sent" : "← received"} ·{" "}
                    {m.outcome}
                  </span>{" "}
                  <strong>{m.partyName || m.email}</strong> · {m.subject}
                  <p className="text-xs text-[var(--ink-soft)]">
                    {formatDate(m.at)} · {m.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="panel mb-8 rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold">
          Reported payment IDs
        </h2>
        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            No payment IDs yet. Payers submit them from the QR pay page.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-semibold">{p.partyName}</p>
                  <p className="text-sm text-[var(--ink-soft)]">
                    ID: <code>{p.paymentId}</code> ·{" "}
                    {formatMoney(p.amount, p.currency)} · {p.status} ·{" "}
                    {formatDate(p.reportedAt)}
                  </p>
                  {p.note && p.status === "reported" && (
                    <p className="mt-1 text-xs text-[var(--coral)]">{p.note}</p>
                  )}
                  {p.evidenceFile && (
                    <a
                      href={`/api/evidence/${p.evidenceFile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-[var(--teal)]"
                    >
                      View customer&apos;s bill
                    </a>
                  )}
                </div>
                {p.status === "reported" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary !px-3 !py-1.5 text-xs"
                      onClick={() => setPaymentStatus(p.id, "confirmed")}
                    >
                      Confirm & mark paid
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger !px-3 !py-1.5 text-xs"
                      onClick={() => setPaymentStatus(p.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold">
          Receivable invoices — payable QR
        </h2>
        <ul className="mt-4 divide-y divide-[var(--line)]">
          {receivables.map((inv) => (
            <li key={inv.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{inv.partyName}</p>
                  <p className="text-sm text-[var(--ink-soft)]">
                    {formatMoney(inv.amount, inv.currency)} · due{" "}
                    {formatDate(inv.dueDate)} · {inv.status}
                    {inv.paymentId ? (
                      <>
                        {" "}
                        · payment <code>{inv.paymentId}</code>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-[var(--teal)]">
                    <Link href={`/pay/${inv.id}`}>/pay/{inv.id}</Link>
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost !px-3 !py-1.5 text-xs"
                  onClick={() => showQr(inv.id)}
                >
                  {selected === inv.id ? "Hide QR" : "Show QR"}
                </button>
              </div>
              {selected === inv.id && qrCache[inv.id] && (
                <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCache[inv.id].dataUrl}
                    alt="QR"
                    width={160}
                    height={160}
                    className="rounded-lg border border-[var(--line)]"
                  />
                  <div className="text-sm text-[var(--ink-soft)]">
                    <p>Note / ref: {qrCache[inv.id].note}</p>
                    <p className="break-all">{qrCache[inv.id].payUrl}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
          {receivables.length === 0 && (
            <li className="py-3 text-sm text-[var(--ink-soft)]">
              No receivable invoices yet.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
