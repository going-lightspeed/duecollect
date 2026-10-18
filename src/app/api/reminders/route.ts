import { NextResponse } from "next/server";
import { listReminders } from "@/lib/db";

export async function GET() {
  const reminders = await listReminders();
  return NextResponse.json({ reminders });
}
