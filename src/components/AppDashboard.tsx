"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import type { Invoice, InvoiceDirection, Reminder } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";

type Stats = {
  openCount: number;
  payableTotal: number;
  receivableTotal: number;
  overdueCount: number;
  overdueParties: {
    id: string;
    partyName: string;
    amount: number;
    currency: string;
    dueDate: string;
    daysOverdue: number;
  }[];
};

type AiStatus = {
  configured: boolean;
  model: string;
  baseUrl: string;
};

type EmailStatus = {
  configured: boolean;
  from: string | null;
};

const emptyForm = {
  direction: "payable" as InvoiceDirection,
  partyName: "",
  partyEmail: "",
  amount: "",
  currency: "USD",
  description: "",
  dueDate: "",
  graceDays: "7",
  reminderDaysBefore: "7,3,1",
};

export default function AppDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [ai, setAi] = useState<AiStatus | null>(null);
  const [email, setEmail] = useState<EmailStatus | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState<"all" | "payable" | "receivable" | "overdue">(
    "all",
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const refresh = useCallback(async () => {
    setError(null);
    const [invRes, remRes, statsRes] = await Promise.all([
      fetch("/api/invoices"),
      fetch("/api/reminders"),
      fetch("/api/stats"),
    ]);
    if (!invRes.ok || !remRes.ok || !statsRes.ok) {
      throw new Error("Failed to load data");
    }
    const invJson = await invRes.json();
    const remJson = await remRes.json();
    const statsJson = await statsRes.json();
    setInvoices(invJson.invoices);
    setReminders(remJson.reminders);
    setStats(statsJson.stats);
    setAi(statsJson.ai);
    setEmail(statsJson.email);
  }, []);

  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (filter === "all") return true;
      if (filter === "overdue") return inv.status === "overdue";
      return inv.direction === filter;
    });
  }, [invoices, filter]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const reminderDaysBefore = form.reminderDaysBefore
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction: form.direction,
          partyName: form.partyName,
          partyEmail: form.partyEmail,
          amount: Number(form.amount),
          currency: form.currency,
          description: form.description,
          dueDate: form.dueDate,
          graceDays: Number(form.graceDays) || 7,
          reminderDaysBefore:
            reminderDaysBefore.length > 0 ? reminderDaysBefore : [7, 3, 1],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not save invoice");
      }
      setForm(emptyForm);
      await refresh();
      flash("Invoice saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function markPaid(id: string) {
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    await refresh();
    flash("Marked as paid");
  }

  async function removeInvoice(id: string) {
    if (!confirm("Delete this invoice?")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    await refresh();
    flash("Invoice removed");
  }

  async function runScan() {
    setScanning(true);
    setError(null);
    try {
      const res = await fetch("/api/reminders/run", { method: "POST" });
      const data = await res.json();
      await refresh();
      const n = data.created?.length ?? 0;
      const mailed = data.emailsSent ?? 0;
      flash(
        n
          ? `${n} reminder${n === 1 ? "" : "s"} · ${mailed} email${mailed === 1 ? "" : "s"} sent`
          : "No new reminders right now",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="app-shell mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="animate-fade-up mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mark-drift mb-3 inline-flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--teal)] text-sm font-bold text-[#f4fbf8]"
            >
              R
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--sage-deep)] uppercase">
              Remitra
            </span>
          </div>
          <h1 className="font-display max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
            Bills remembered.
            <span className="block text-[var(--teal)]">Cash flow calmed.</span>
          </h1>
          <p className="mt-3 max-w-lg text-[var(--ink-soft)]">
            Log payables and receivables. A local NVIDIA Cosmos model writes
            the payment emails and checks the bills customers send back.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/admin" className="btn btn-ghost">
              Admin
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={runScan}
              disabled={scanning}
            >
              {scanning ? "Scanning…" : "Run AI reminder scan"}
            </button>
          </div>
          <p className="max-w-xs text-right text-xs text-[var(--ink-soft)]">
            {ai?.configured ? (
              <>
                Local AI ·{" "}
                <span className="font-medium text-[var(--teal)]">{ai.model}</span>
              </>
            ) : (
              <>
                Template mode — AI disabled via{" "}
                <code className="text-[var(--ink)]">LOCAL_AI_DISABLED</code>
              </>
            )}
            {" · "}
            {email?.configured ? (
              <span className="text-[var(--teal)]">email on</span>
            ) : (
              <span>email needs MAIL_EMAIL / MAIL_PASSWORD</span>
            )}
          </p>
        </div>
      </header>

      {toast && (
        <div className="animate-fade-up fixed top-5 right-5 z-50 rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[#f4fbf8] shadow-lg">
          {toast}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-[var(--coral)]/30 bg-[var(--coral)]/10 px-4 py-3 text-sm text-[var(--coral)]">
          {error}
        </div>
      )}

      <section className="animate-fade-up-delay-1 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Open invoices"
          value={loading ? "—" : String(stats?.openCount ?? 0)}
        />
        <Stat
          label="You owe"
          value={loading ? "—" : formatMoney(stats?.payableTotal ?? 0)}
          hint="Payables"
        />
        <Stat
          label="Owed to you"
          value={loading ? "—" : formatMoney(stats?.receivableTotal ?? 0)}
          hint="Receivables"
        />
        <Stat
          label="Overdue"
          value={loading ? "—" : String(stats?.overdueCount ?? 0)}
          hint="Past grace"
          alert={(stats?.overdueCount ?? 0) > 0}
        />
      </section>

      {(stats?.overdueParties?.length ?? 0) > 0 && (
        <section className="animate-fade-up-delay-1 panel overdue-pulse mb-8 rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold text-[var(--coral)]">
            Parties who have not paid
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Past due date plus grace window — time to follow up.
          </p>
          <ul className="mt-4 space-y-3">
            {stats!.overdueParties.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3 first:border-0 first:pt-0"
              >
                <div>
                  <p className="font-semibold">{p.partyName}</p>
                  <p className="text-sm text-[var(--ink-soft)]">
                    Due {formatDate(p.dueDate)} · {p.daysOverdue} days late
                  </p>
                </div>
                <p className="font-display text-lg font-semibold">
                  {formatMoney(p.amount, p.currency)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section className="animate-fade-up-delay-2 panel rounded-2xl p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Add invoice</h2>
          <p className="mt-1 mb-5 text-sm text-[var(--ink-soft)]">
            Track what you must pay and what others owe you.
          </p>

          <form onSubmit={onSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--mist)]/70 p-1">
              {(["payable", "receivable"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
                    form.direction === dir
                      ? "bg-white text-[var(--teal)] shadow-sm"
                      : "text-[var(--ink-soft)]"
                  }`}
                  onClick={() => setForm((f) => ({ ...f, direction: dir }))}
                >
                  {dir === "payable" ? "I need to pay" : "They owe me"}
                </button>
              ))}
            </div>

            <Field label="Party name">
              <input
                className="input"
                required
                value={form.partyName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, partyName: e.target.value }))
                }
                placeholder="Acme Studio"
              />
            </Field>

            <Field label="Email (required for auto reminders)">
              <input
                className="input"
                type="email"
                value={form.partyEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, partyEmail: e.target.value }))
                }
                placeholder="billing@acme.com"
              />
            </Field>

            <div className="grid grid-cols-[1.4fr_0.8fr] gap-3">
              <Field label="Amount">
                <input
                  className="input"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  placeholder="1250.00"
                />
              </Field>
              <Field label="Currency">
                <input
                  className="input"
                  value={form.currency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, currency: e.target.value }))
                  }
                />
              </Field>
            </div>

            <Field label="Description">
              <input
                className="input"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="March retainer"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Due date">
                <input
                  className="input"
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                />
              </Field>
              <Field label="Grace days">
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={form.graceDays}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, graceDays: e.target.value }))
                  }
                />
              </Field>
            </div>

            <Field label="Remind before due (days, comma-separated)">
              <input
                className="input"
                value={form.reminderDaysBefore}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    reminderDaysBefore: e.target.value,
                  }))
                }
                placeholder="7,3,1"
              />
            </Field>

            <button type="submit" className="btn btn-primary w-full" disabled={saving}>
              {saving ? "Saving…" : "Save invoice"}
            </button>
          </form>
        </section>

        <div className="animate-fade-up-delay-3 space-y-8">
          <section className="panel rounded-2xl p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">Invoices</h2>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["all", "All"],
                    ["payable", "Pay"],
                    ["receivable", "Collect"],
                    ["overdue", "Late"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      filter === key
                        ? "bg-[var(--teal)] text-white"
                        : "bg-[var(--mist)] text-[var(--ink-soft)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-[var(--ink-soft)]">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-[var(--ink-soft)]">
                No invoices yet — add one on the left.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {filtered.map((inv) => (
                  <li key={inv.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <DirectionBadge direction={inv.direction} />
                          <StatusBadge status={inv.status} />
                        </div>
                        <p className="font-semibold">{inv.partyName}</p>
                        <p className="text-sm text-[var(--ink-soft)]">
                          Due {formatDate(inv.dueDate)}
                          {inv.description ? ` · ${inv.description}` : ""}
                          {inv.partyEmail ? ` · ${inv.partyEmail}` : ""}
                          {inv.paymentId ? (
                            <>
                              {" "}
                              · pay ID <code>{inv.paymentId}</code>
                            </>
                          ) : null}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-semibold">
                          {formatMoney(inv.amount, inv.currency)}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-end gap-2">
                          {inv.direction === "receivable" && (
                            <Link
                              href={`/pay/${inv.id}`}
                              className="btn btn-ghost !px-3 !py-1.5 text-xs"
                            >
                              Pay QR
                            </Link>
                          )}
                          {inv.status !== "paid" && (
                            <button
                              type="button"
                              className="btn btn-ghost !px-3 !py-1.5 text-xs"
                              onClick={() => markPaid(inv.id)}
                            >
                              Mark paid
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-danger !px-3 !py-1.5 text-xs"
                            onClick={() => removeInvoice(inv.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">AI reminders</h2>
            <p className="mt-1 mb-4 text-sm text-[var(--ink-soft)]">
              Upcoming, due-today, and overdue notices — written by the
              local AI model.
            </p>
            {reminders.length === 0 ? (
              <p className="text-sm text-[var(--ink-soft)]">
                Run a reminder scan to generate your first messages.
              </p>
            ) : (
              <ul className="space-y-3">
                {reminders.slice(0, 12).map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-[var(--line)] bg-white/50 px-4 py-3"
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <KindBadge kind={r.kind} />
                      <DirectionBadge direction={r.direction} />
                      {r.aiGenerated ? (
                        <span className="badge bg-[var(--mist)] text-[var(--teal)]">
                          NVIDIA
                        </span>
                      ) : (
                        <span className="badge bg-[var(--mist)] text-[var(--ink-soft)]">
                          Template
                        </span>
                      )}
                      {r.emailed ? (
                        <span className="badge bg-[var(--sage)]/20 text-[var(--sage-deep)]">
                          Emailed
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm leading-relaxed">{r.message}</p>
                    <p className="mt-2 text-xs text-[var(--ink-soft)]">
                      {r.partyName} · {formatMoney(r.amount, r.currency)} ·{" "}
                      {formatDate(r.createdAt)}
                      {r.emailTo ? ` · to ${r.emailTo}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <footer className="mt-12 border-t border-[var(--line)] pt-6 text-center text-xs text-[var(--ink-soft)]">
        Remitra · local inference ({ai?.model ?? "nvidia/Cosmos3-Nano"})
      </footer>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--ink-soft)] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({
  label,
  value,
  hint,
  alert,
}: {
  label: string;
  value: string;
  hint?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`panel rounded-2xl px-4 py-4 ${alert ? "overdue-pulse border-[var(--coral)]/25" : ""}`}
    >
      <p className="text-xs font-semibold tracking-wide text-[var(--ink-soft)] uppercase">
        {label}
      </p>
      <p
        className={`font-display mt-1 text-2xl font-semibold ${alert ? "text-[var(--coral)]" : ""}`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{hint}</p>}
    </div>
  );
}

function DirectionBadge({ direction }: { direction: InvoiceDirection }) {
  const payable = direction === "payable";
  return (
    <span
      className={`badge ${payable ? "bg-[var(--amber)]/15 text-[var(--amber)]" : "bg-[var(--teal-bright)]/15 text-[var(--teal)]"}`}
    >
      {payable ? "Payable" : "Receivable"}
    </span>
  );
}

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const styles =
    status === "paid"
      ? "bg-[var(--sage)]/20 text-[var(--sage-deep)]"
      : status === "overdue"
        ? "bg-[var(--coral)]/15 text-[var(--coral)]"
        : "bg-[var(--mist)] text-[var(--ink-soft)]";
  return <span className={`badge ${styles}`}>{status}</span>;
}

function KindBadge({ kind }: { kind: Reminder["kind"] }) {
  const label =
    kind === "upcoming"
      ? "Upcoming"
      : kind === "due_today"
        ? "Due today"
        : "Overdue";
  const styles =
    kind === "overdue"
      ? "bg-[var(--coral)]/15 text-[var(--coral)]"
      : kind === "due_today"
        ? "bg-[var(--amber)]/15 text-[var(--amber)]"
        : "bg-[var(--teal-bright)]/15 text-[var(--teal)]";
  return <span className={`badge ${styles}`}>{label}</span>;
}
