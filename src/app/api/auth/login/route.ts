import { NextResponse } from "next/server";
import { checkAdminLogin, setAdminSession } from "@/lib/auth";

// Simple in-memory brute-force guard: 5 wrong attempts per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map<string, { count: number; since: number }>();

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const now = Date.now();
  const rec = fails.get(ip);
  if (rec && now - rec.since > WINDOW_MS) fails.delete(ip);

  const current = fails.get(ip);
  if (current && current.count >= MAX_FAILS) {
    const wait = Math.ceil((WINDOW_MS - (now - current.since)) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${wait} min.` },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!checkAdminLogin(username, password)) {
    fails.set(ip, {
      count: (current?.count ?? 0) + 1,
      since: current?.since ?? now,
    });
    return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
  }

  fails.delete(ip);
  await setAdminSession(username);
  return NextResponse.json({ ok: true, username });
}
