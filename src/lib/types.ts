export type InvoiceDirection = "payable" | "receivable";
export type InvoiceStatus = "pending" | "paid" | "overdue";
export type ReminderKind = "upcoming" | "due_today" | "overdue";
export type PaymentStatus = "reported" | "confirmed" | "rejected";
export type SettlementMethod =
  | "admin_confirm"
  | "ai_email_reply"
  | "ai_pay_page"
  | "manual"
  | "";

export interface Invoice {
  id: string;
  direction: InvoiceDirection;
  partyName: string;
  partyEmail: string;
  amount: number;
  currency: string;
  description: string;
  issueDate: string;
  dueDate: string;
  graceDays: number;
  status: InvoiceStatus;
  reminderDaysBefore: number[];
  createdAt: string;
  paidAt?: string;
  paymentId?: string;
  /** Relative path under /uploads or public URL path for admin-uploaded QR */
  qrImageUrl?: string;
  settlementMethod?: SettlementMethod;
}

export interface Reminder {
  id: string;
  invoiceId: string;
  partyName: string;
  direction: InvoiceDirection;
  kind: ReminderKind;
  message: string;
  amount: number;
  currency: string;
  dueDate: string;
  createdAt: string;
  aiGenerated: boolean;
  daysRelative: number;
  emailed?: boolean;
  emailTo?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  paymentId: string;
  amount: number;
  currency: string;
  partyName: string;
  note: string;
  status: PaymentStatus;
  reportedAt: string;
  confirmedAt?: string;
  confirmedBy?: string;
  rawMessage?: string;
  verifiedByAi?: boolean;
  /** filename of the customer's bill image saved under data/evidence */
  evidenceFile?: string;
}

export interface AppData {
  invoices: Invoice[];
  reminders: Reminder[];
  payments: Payment[];
}

export interface CreateInvoiceInput {
  direction: InvoiceDirection;
  partyName: string;
  partyEmail?: string;
  amount: number;
  currency?: string;
  description?: string;
  issueDate?: string;
  dueDate: string;
  graceDays?: number;
  reminderDaysBefore?: number[];
}

export interface AiPaymentVerdict {
  verified: boolean;
  paymentId: string | null;
  amountMatched: boolean;
  confidence: number;
  reason: string;
}

export type EmailDirection = "outbound" | "inbound";

export interface EmailLogEntry {
  id: string;
  at: string;
  direction: EmailDirection;
  /** customer's address */
  email: string;
  partyName: string;
  invoiceIds: string[];
  subject: string;
  /** sent | failed | received | settled | needs_review | ignored */
  outcome: string;
  detail: string;
}
