import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { adminCredentials } from "./config";

const COOKIE = "duecollect_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "duecollect-dev-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminToken(username: string) {
  const payload = `${username}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [username, ts, sig] = parts;
  const payload = `${username}.${ts}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const { username: expectedUser } = adminCredentials();
  if (username !== expectedUser) return false;
  const age = Date.now() - Number(ts);
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE * 1000;
}

export async function isAdminLoggedIn() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value);
}

export async function setAdminSession(username: string) {
  const jar = await cookies();
  jar.set(COOKIE, createAdminToken(username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Returns a 401 response when nobody is logged in, otherwise null. */
export async function adminGuard(): Promise<NextResponse | null> {
  if (await isAdminLoggedIn()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function checkAdminLogin(username: string, password: string) {
  const creds = adminCredentials();
  // Env values are trimmed, so ignore stray spaces from copy/paste or autofill.
  const user = username.trim();
  const pass = password.trim();
  const ok = user === creds.username && pass === creds.password;

  if (!ok && process.env.NODE_ENV !== "production") {
    // Dev-only hint in the server terminal (never prints the password).
    const fromEnv = Boolean(process.env.ADMIN_PASSWORD?.trim());
    console.log(
      `[duecollect] login failed: username ${user === creds.username ? "OK" : `WRONG (server expects "${creds.username}")`}, ` +
        `password ${pass === creds.password ? "OK" : `WRONG (${creds.password.length} chars expected, ${pass.length} typed)`}` +
        `${fromEnv ? "" : " — ADMIN_PASSWORD not loaded from .env.local, using default \"admin\""}`,
    );
  }
  return ok;
}

export { COOKIE as ADMIN_COOKIE };
