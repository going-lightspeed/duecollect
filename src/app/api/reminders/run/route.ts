import { NextResponse } from "next/server";
import { aiConfigStatus } from "@/lib/ai";
import { runReminderScan } from "@/lib/reminders";

async function handle() {
  const result = await runReminderScan();
  return NextResponse.json({
    ...result,
    ai: aiConfigStatus(),
  });
}

export async function POST() {
  return handle();
}

export async function GET() {
  return handle();
}
