import { readAdminQrFile } from "@/lib/qr-store";

export const runtime = "nodejs";

/** The admin's payment QR, shown to customers on the pay page. */
export async function GET() {
  const qr = await readAdminQrFile();
  if (!qr) return new Response("No QR uploaded", { status: 404 });
  return new Response(new Uint8Array(qr.buffer), {
    headers: {
      "Content-Type": qr.info.mimeType,
      "Cache-Control": "no-cache",
    },
  });
}
