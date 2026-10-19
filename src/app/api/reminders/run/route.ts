import { NextResponse } from "next/server";
import { aiConfigStatus } from "@/lib/ai";
import { isAdminLoggedIn } from "@/lib/auth";
import { runReminderScan } from "@/lib/reminders";

// Admin session, or a scheduler sending "Authorization: Bearer <CRON_SECRET>".
async function allowed(request: Request) {
  if (await isAdminLoggedIn()) return true;
  const secret = process.env.CRON_SECRET;
  return Boolean(
    secret && request.headers.get("authorization") === `Bearer ${secret}`,
  );
}

async function handle(request: Request) {
  if (!(await allowed(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runReminderScan();
  return NextResponse.json({ ...result, ai: aiConfigStatus() });
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
