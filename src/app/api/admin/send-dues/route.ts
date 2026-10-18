import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { sendDuesToAll } from "@/lib/collections";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Admin: write + send an email to every customer who owes us. */
export async function POST() {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const results = await sendDuesToAll({ force: true });
  return NextResponse.json({
    results,
    sent: results.filter((r) => r.sent).length,
    failed: results.filter((r) => r.error).length,
  });
}
