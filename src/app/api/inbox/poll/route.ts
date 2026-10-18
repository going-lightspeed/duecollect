import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { pollInbox } from "@/lib/inbox";

export const runtime = "nodejs";
export const maxDuration = 300;

async function allowed(request: Request) {
  if (await isAdminLoggedIn()) return true;
  const secret = process.env.CRON_SECRET;
  return Boolean(
    secret && request.headers.get("authorization") === `Bearer ${secret}`,
  );
}

/** Read the mailbox now, verify any payment replies, update the ledger. */
export async function POST(request: Request) {
  if (!(await allowed(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await pollInbox());
}

export const GET = POST;
