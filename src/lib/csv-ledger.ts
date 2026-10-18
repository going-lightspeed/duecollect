import { promises as fs } from "fs";
import path from "path";
import type { EmailLogEntry, Invoice, Payment, SettlementMethod } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CSV_FILE = path.join(DATA_DIR, "debts.csv");

const HEADER = [
  "id",
  "party_name",
  "party_email",
  "direction",
  "amount",
  "currency",
  "description",
  "due_date",
  "status",
  "added_at",
  "settled_at",
  "amount_settled",
  "payment_id",
  "settlement_method",
].join(",");

function esc(value: string | number | undefined | null): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowFromInvoice(inv: Invoice): string {
  const settled = inv.status === "paid";
  return [
    esc(inv.id),
    esc(inv.partyName),
    esc(inv.partyEmail),
    esc(inv.direction),
    esc(inv.amount),
    esc(inv.currency),
    esc(inv.description),
    esc(inv.dueDate),
    esc(inv.status),
    esc(inv.createdAt),
    esc(inv.paidAt || ""),
    esc(settled ? inv.amount : ""),
    esc(inv.paymentId || ""),
    esc(inv.settlementMethod || ""),
  ].join(",");
}

async function ensureCsv() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CSV_FILE);
  } catch {
    await fs.writeFile(CSV_FILE, HEADER + "\n", "utf8");
  }
}

/** Rewrite the full CSV from current invoices (source of truth for ledger export). */
export async function syncDebtsCsv(invoices: Invoice[]): Promise<void> {
  await ensureCsv();
  const lines = [HEADER, ...invoices.map(rowFromInvoice)];
  await fs.writeFile(CSV_FILE, lines.join("\n") + "\n", "utf8");
}

export async function readDebtsCsv(): Promise<string> {
  await ensureCsv();
  return fs.readFile(CSV_FILE, "utf8");
}

export function csvPath() {
  return CSV_FILE;
}

export type LedgerPatch = {
  status?: Invoice["status"];
  paidAt?: string;
  paymentId?: string;
  settlementMethod?: SettlementMethod;
};

/* ------------------------------------------------------------------ */
/* payments.csv — every payment reported / verified / confirmed        */
/* ------------------------------------------------------------------ */

const PAYMENTS_FILE = path.join(DATA_DIR, "payments.csv");
const PAYMENTS_HEADER = [
  "id",
  "invoice_id",
  "party_name",
  "payment_id",
  "amount",
  "currency",
  "status",
  "reported_at",
  "confirmed_at",
  "confirmed_by",
  "verified_by_ai",
  "note",
].join(",");

export async function syncPaymentsCsv(payments: Payment[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const rows = payments.map((p) =>
    [
      esc(p.id),
      esc(p.invoiceId),
      esc(p.partyName),
      esc(p.paymentId),
      esc(p.amount),
      esc(p.currency),
      esc(p.status),
      esc(p.reportedAt),
      esc(p.confirmedAt || ""),
      esc(p.confirmedBy || ""),
      esc(p.verifiedByAi ? "yes" : ""),
      esc(p.note),
    ].join(","),
  );
  await fs.writeFile(
    PAYMENTS_FILE,
    [PAYMENTS_HEADER, ...rows].join("\n") + "\n",
    "utf8",
  );
}

/* ------------------------------------------------------------------ */
/* emails.csv — every email Remitra sent or received (append-only)     */
/* ------------------------------------------------------------------ */

const EMAILS_FILE = path.join(DATA_DIR, "emails.csv");
const EMAILS_HEADER = [
  "id",
  "at",
  "direction",
  "email",
  "party_name",
  "invoice_ids",
  "subject",
  "outcome",
  "detail",
].join(",");

export async function appendEmailLog(entry: EmailLogEntry): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(EMAILS_FILE);
  } catch {
    await fs.writeFile(EMAILS_FILE, EMAILS_HEADER + "\n", "utf8");
  }
  const row = [
    esc(entry.id),
    esc(entry.at),
    esc(entry.direction),
    esc(entry.email),
    esc(entry.partyName),
    esc(entry.invoiceIds.join(" ")),
    esc(entry.subject),
    esc(entry.outcome),
    esc(entry.detail.slice(0, 500)),
  ].join(",");
  await fs.appendFile(EMAILS_FILE, row + "\n", "utf8");
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export async function readEmailLog(limit = 50): Promise<EmailLogEntry[]> {
  let text: string;
  try {
    text = await fs.readFile(EMAILS_FILE, "utf8");
  } catch {
    return [];
  }
  const [, ...rows] = parseCsv(text).filter((r) => r.length > 1);
  return rows
    .map((r) => ({
      id: r[0],
      at: r[1],
      direction: r[2] as EmailLogEntry["direction"],
      email: r[3],
      partyName: r[4],
      invoiceIds: r[5] ? r[5].split(" ") : [],
      subject: r[6],
      outcome: r[7],
      detail: r[8] ?? "",
    }))
    .reverse()
    .slice(0, limit);
}

/** Message-ids already processed by the inbox poller (survives restarts). */
const SEEN_FILE = path.join(DATA_DIR, "inbox-seen.json");

export async function readSeenMessages(): Promise<Set<string>> {
  try {
    return new Set(JSON.parse(await fs.readFile(SEEN_FILE, "utf8")) as string[]);
  } catch {
    return new Set();
  }
}

export async function writeSeenMessages(ids: Set<string>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SEEN_FILE, JSON.stringify([...ids].slice(-2000)), "utf8");
}
