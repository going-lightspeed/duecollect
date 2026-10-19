import { adminGuard } from "@/lib/auth";
import { NextResponse } from "next/server";
import { listReminders } from "@/lib/db";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const reminders = await listReminders();
  return NextResponse.json({ reminders });
}
