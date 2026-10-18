import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";
import type { Invoice } from "./types";

function today() {
  return startOfDay(new Date());
}

export function refreshInvoiceStatus(invoice: Invoice): Invoice {
  if (invoice.status === "paid") return invoice;

  const daysPastDue = differenceInCalendarDays(
    today(),
    startOfDay(parseISO(invoice.dueDate)),
  );

  if (daysPastDue > invoice.graceDays) {
    return { ...invoice, status: "overdue" };
  }
  return { ...invoice, status: "pending" };
}
