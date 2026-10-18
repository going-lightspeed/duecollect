import { NextResponse } from "next/server";
import { checkAdminLogin, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!checkAdminLogin(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await setAdminSession(username);
  return NextResponse.json({ ok: true, username });
}
