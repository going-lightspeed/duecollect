import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { adminCredentials } from "./config";

const COOKIE = "remitra_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "remitra-dev-secret"
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

export function checkAdminLogin(username: string, password: string) {
  const creds = adminCredentials();
  return username === creds.username && password === creds.password;
}

export { COOKIE as ADMIN_COOKIE };
