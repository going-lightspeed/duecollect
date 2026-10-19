import { sendingConfigured } from "./mail-credentials";

export function appBaseUrl() {
  return (
    process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function paymentConfig() {
  return {
    upiId: process.env.PAYMENT_UPI_ID?.trim() || "",
    payeeName: process.env.PAYMENT_PAYEE_NAME?.trim() || "DueCollect",
    notePrefix: process.env.PAYMENT_NOTE_PREFIX?.trim() || "INV",
  };
}

export function adminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME?.trim() || "admin",
    password: process.env.ADMIN_PASSWORD?.trim() || "admin",
  };
}

export function emailConfigured() {
  return sendingConfigured();
}

/** Minimum AI confidence (0-1) to auto-mark an invoice paid from a customer's bill. */
export function autoSettleMinConfidence() {
  const n = Number(process.env.AUTO_SETTLE_MIN_CONFIDENCE);
  return Number.isFinite(n) && n > 0 && n <= 1 ? n : 0.75;
}
