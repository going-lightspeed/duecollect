import { promises as fs } from "fs";
import path from "path";
import { syncDebtsCsv, syncPaymentsCsv } from "./csv-ledger";
import type { AppData, Invoice, Payment, Reminder } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readStore(): Promise<AppData> {
  try {
    await ensureDir();
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as AppData;
    return {
      invoices: parsed.invoices ?? [],
      reminders: parsed.reminders ?? [],
      payments: parsed.payments ?? [],
    };
  } catch {
    return { invoices: [], reminders: [], payments: [] };
  }
}

export async function writeStore(data: AppData): Promise<void> {
  await ensureDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  await syncDebtsCsv(data.invoices);
  await syncPaymentsCsv(data.payments);
}

export async function listInvoices(): Promise<Invoice[]> {
  const store = await readStore();
  return store.invoices.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  const store = await readStore();
  return store.invoices.find((i) => i.id === id);
}

export async function upsertInvoice(invoice: Invoice): Promise<Invoice> {
  const store = await readStore();
  const idx = store.invoices.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) store.invoices[idx] = invoice;
  else store.invoices.push(invoice);
  await writeStore(store);
  return invoice;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const store = await readStore();
  const before = store.invoices.length;
  store.invoices = store.invoices.filter((i) => i.id !== id);
  store.reminders = store.reminders.filter((r) => r.invoiceId !== id);
  store.payments = store.payments.filter((p) => p.invoiceId !== id);
  await writeStore(store);
  return store.invoices.length < before;
}

export async function listReminders(): Promise<Reminder[]> {
  const store = await readStore();
  return store.reminders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addReminder(reminder: Reminder): Promise<Reminder> {
  const store = await readStore();
  store.reminders.unshift(reminder);
  store.reminders = store.reminders.slice(0, 200);
  await writeStore(store);
  return reminder;
}

export async function updateReminder(
  id: string,
  patch: Partial<Reminder>,
): Promise<Reminder | undefined> {
  const store = await readStore();
  const idx = store.reminders.findIndex((r) => r.id === id);
  if (idx < 0) return undefined;
  store.reminders[idx] = { ...store.reminders[idx], ...patch };
  await writeStore(store);
  return store.reminders[idx];
}

export async function hasRecentReminder(
  invoiceId: string,
  kind: Reminder["kind"],
  withinHours = 20,
): Promise<boolean> {
  const store = await readStore();
  const cutoff = Date.now() - withinHours * 60 * 60 * 1000;
  return store.reminders.some(
    (r) =>
      r.invoiceId === invoiceId &&
      r.kind === kind &&
      new Date(r.createdAt).getTime() >= cutoff,
  );
}

export async function listPayments(): Promise<Payment[]> {
  const store = await readStore();
  return store.payments.sort(
    (a, b) =>
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
  );
}

export async function addPayment(payment: Payment): Promise<Payment> {
  const store = await readStore();
  store.payments.unshift(payment);
  await writeStore(store);
  return payment;
}

export async function updatePayment(
  id: string,
  patch: Partial<Payment>,
): Promise<Payment | undefined> {
  const store = await readStore();
  const idx = store.payments.findIndex((p) => p.id === id);
  if (idx < 0) return undefined;
  store.payments[idx] = { ...store.payments[idx], ...patch };
  await writeStore(store);
  return store.payments[idx];
}

export async function getPaymentsForInvoice(
  invoiceId: string,
): Promise<Payment[]> {
  const store = await readStore();
  return store.payments.filter((p) => p.invoiceId === invoiceId);
}
