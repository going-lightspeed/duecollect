import { promises as fs } from "fs";
import path from "path";
import jsQR from "jsqr";
import sharp from "sharp";
import { localChat, extractJson, type AiImage } from "./local-ai";

const DIR = path.join(process.cwd(), "data", "uploads");
const META = path.join(DIR, "payment-qr.json");

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
export const MAX_QR_BYTES = 5 * 1024 * 1024;

export type QrInfo = {
  file: string;
  mimeType: string;
  uploadedAt: string;
  /** Raw text decoded from the QR (e.g. upi://pay?pa=...) */
  payload: string | null;
  upiId: string | null;
  payeeName: string | null;
  /** How the details were read: decoded from the code, or read by the AI model */
  readBy: "decoder" | "ai" | "none";
  aiSummary: string | null;
};

function parseUpi(payload: string) {
  if (!/^upi:\/\//i.test(payload)) return { upiId: null, payeeName: null };
  try {
    const q = new URL(payload.replace(/^upi:\/\//i, "https://x/")).searchParams;
    return { upiId: q.get("pa"), payeeName: q.get("pn") };
  } catch {
    return { upiId: null, payeeName: null };
  }
}

async function decodeQr(buf: Buffer): Promise<string | null> {
  // Try a few sizes — phone screenshots are often huge or have lots of margin.
  for (const width of [900, 600, 1400]) {
    const { data, info } = await sharp(buf)
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width, withoutEnlargement: false })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const hit = jsQR(new Uint8ClampedArray(data), info.width, info.height, {
      inversionAttempts: "attemptBoth",
    });
    if (hit?.data) return hit.data;
  }
  return null;
}

/** Ask the local vision model what this QR is for (fallback + sanity summary). */
async function aiReadQr(img: AiImage) {
  try {
    const raw = await localChat({
      system:
        'You read payment QR code images. Reply ONLY with JSON: {"upiId":string|null,"payeeName":string|null,"summary":string}. Use null if the text is not visible. Do not guess.',
      user: "What account/payee does this payment QR belong to? Read any visible UPI ID or name printed on the image.",
      images: [img],
      maxTokens: 200,
      temperature: 0,
    });
    return extractJson<{
      upiId: string | null;
      payeeName: string | null;
      summary: string;
    }>(raw);
  } catch (err) {
    console.error("Local AI could not read QR:", err);
    return null;
  }
}

export async function saveAdminQr(
  buf: Buffer,
  mimeType: string,
): Promise<QrInfo> {
  const ext = EXT[mimeType];
  if (!ext) throw new Error("QR must be a PNG, JPG or WebP image");
  if (buf.length > MAX_QR_BYTES) throw new Error("QR image is over 5 MB");
  // Make sure it is really an image before storing it.
  await sharp(buf).metadata();

  await fs.mkdir(DIR, { recursive: true });
  for (const e of Object.values(EXT)) {
    await fs.rm(path.join(DIR, `payment-qr.${e}`), { force: true });
  }
  const file = `payment-qr.${ext}`;
  await fs.writeFile(path.join(DIR, file), buf);

  const payload = await decodeQr(buf).catch(() => null);
  let { upiId, payeeName } = payload
    ? parseUpi(payload)
    : { upiId: null, payeeName: null };
  let readBy: QrInfo["readBy"] = payload ? "decoder" : "none";

  const ai = await aiReadQr({ mimeType, base64: buf.toString("base64") });
  if (!upiId && ai?.upiId) {
    upiId = ai.upiId;
    readBy = "ai";
  }
  if (!payeeName && ai?.payeeName) payeeName = ai.payeeName;

  const info: QrInfo = {
    file,
    mimeType,
    uploadedAt: new Date().toISOString(),
    payload,
    upiId,
    payeeName,
    readBy,
    aiSummary: ai?.summary ?? null,
  };
  await fs.writeFile(META, JSON.stringify(info, null, 2), "utf8");
  return info;
}

export async function getAdminQr(): Promise<QrInfo | null> {
  try {
    return JSON.parse(await fs.readFile(META, "utf8")) as QrInfo;
  } catch {
    return null;
  }
}

export async function readAdminQrFile(): Promise<{
  info: QrInfo;
  buffer: Buffer;
} | null> {
  const info = await getAdminQr();
  if (!info) return null;
  try {
    return { info, buffer: await fs.readFile(path.join(DIR, info.file)) };
  } catch {
    return null;
  }
}

export async function deleteAdminQr() {
  await fs.rm(DIR, { recursive: true, force: true });
}
