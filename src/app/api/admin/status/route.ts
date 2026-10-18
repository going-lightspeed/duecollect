import { NextResponse } from "next/server";
import { aiConfigStatus } from "@/lib/ai";
import { isAdminLoggedIn } from "@/lib/auth";
import { readEmailLog } from "@/lib/csv-ledger";
import { mailStatus } from "@/lib/email";
import { localAiHealth } from "@/lib/local-ai";
import { receivingConfigured } from "@/lib/mail-credentials";
import { getAdminQr } from "@/lib/qr-store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [health, qr, emails] = await Promise.all([
    localAiHealth(),
    getAdminQr(),
    readEmailLog(30),
  ]);
  return NextResponse.json({
    ai: { ...aiConfigStatus(), ...health },
    mail: { ...mailStatus(), inboxConfigured: receivingConfigured() },
    qr,
    emails,
  });
}
