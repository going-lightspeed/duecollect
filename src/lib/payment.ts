import QRCode from "qrcode";
import { appBaseUrl, paymentConfig } from "./config";
import { getAdminQr } from "./qr-store";
import type { Invoice } from "./types";

export function invoicePayUrl(invoiceId: string) {
  return `${appBaseUrl()}/pay/${invoiceId}`;
}

export function publicQrUrl(invoice: Invoice): string | null {
  if (!invoice.qrImageUrl) return null;
  if (invoice.qrImageUrl.startsWith("http")) return invoice.qrImageUrl;
  return `${appBaseUrl()}${invoice.qrImageUrl.startsWith("/") ? "" : "/"}${invoice.qrImageUrl}`;
}

export type PaymentQr = {
  kind: "upi" | "page" | "image";
  payload: string;
  note: string;
  upiId: string;
  payeeName: string;
  dataUrl: string;
  payUrl: string;
};

/**
 * QR shown on the pay page. Priority:
 *  1. QR the admin uploaded in the admin panel (served from /api/qr-image)
 *  2. a per-invoice qrImageUrl
 *  3. a UPI deep link, if PAYMENT_UPI_ID is set
 *  4. a QR pointing at the /pay page itself
 */
export async function buildPaymentQrDataUrl(
  invoice: Invoice,
): Promise<PaymentQr> {
  const cfg = paymentConfig();
  const admin = await getAdminQr();
  const upiId = admin?.upiId || cfg.upiId;
  const payeeName = admin?.payeeName || cfg.payeeName;
  const payUrl = invoicePayUrl(invoice.id);
  const note = `${cfg.notePrefix}-${invoice.id.slice(0, 8)}`;

  const uploaded = admin
    ? `/api/qr-image?v=${encodeURIComponent(admin.uploadedAt)}`
    : publicQrUrl(invoice);
  if (uploaded) {
    return {
      kind: "image",
      payload: admin?.payload || uploaded,
      note,
      upiId,
      payeeName,
      dataUrl: uploaded,
      payUrl,
    };
  }

  const useUpi = Boolean(upiId);
  const payload = useUpi
    ? `upi://pay?${new URLSearchParams({
        pa: upiId,
        pn: payeeName,
        am: invoice.amount.toFixed(2),
        cu: invoice.currency || "INR",
        tn: note,
      }).toString()}`
    : payUrl;

  const dataUrl = await QRCode.toDataURL(payload, {
    width: 280,
    margin: 2,
    errorCorrectionLevel: "M",
  });

  return {
    kind: useUpi ? "upi" : "page",
    payload,
    note,
    upiId,
    payeeName,
    dataUrl,
    payUrl,
  };
}
