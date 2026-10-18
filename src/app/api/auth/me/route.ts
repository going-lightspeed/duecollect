import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { adminCredentials } from "@/lib/config";

export async function GET() {
  const ok = await isAdminLoggedIn();
  if (!ok) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    username: adminCredentials().username,
  });
}
