import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { sendDuesToAll } from "@/lib/collections";
import {
  deleteAdminQr,
  getAdminQr,
  MAX_QR_BYTES,
  saveAdminQr,
} from "@/lib/qr-store";

export const runtime = "nodejs";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await isAdminLoggedIn())) return unauthorized();
  return NextResponse.json({ qr: await getAdminQr() });
}

/** Admin uploads the QR that payments are received on. */
export async function POST(request: Request) {
  if (!(await isAdminLoggedIn())) return unauthorized();

  const form = await request.formData();
  const file = form.get("qr");
  const emailCustomers = form.get("emailCustomers") === "true";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a QR image" }, { status: 400 });
  }
  if (file.size > MAX_QR_BYTES) {
    return NextResponse.json({ error: "QR image is over 5 MB" }, { status: 400 });
  }

  let qr;
  try {
    qr = await saveAdminQr(Buffer.from(await file.arrayBuffer()), file.type);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save QR" },
      { status: 400 },
    );
  }

  // Email every customer who owes us — runs in the background (the local AI
  // writes each email, which can take a while). Results land in data/emails.csv.
  if (emailCustomers) {
    void sendDuesToAll({ force: true }).catch((err) =>
      console.error("Background dues emailing failed:", err),
    );
  }

  return NextResponse.json({ qr, emailing: emailCustomers });
}

export async function DELETE() {
  if (!(await isAdminLoggedIn())) return unauthorized();
  await deleteAdminQr();
  return NextResponse.json({ ok: true });
}
