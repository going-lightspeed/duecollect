module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
;
// Simple in-memory brute-force guard: 5 wrong attempts per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map();
function clientIp(request) {
    return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
}
async function POST(request) {
    const ip = clientIp(request);
    const now = Date.now();
    const rec = fails.get(ip);
    if (rec && now - rec.since > WINDOW_MS) fails.delete(ip);
    const current = fails.get(ip);
    if (current && current.count >= MAX_FAILS) {
        const wait = Math.ceil((WINDOW_MS - (now - current.since)) / 60000);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Too many attempts. Try again in ${wait} min.`
        }, {
            status: 429
        });
    }
    const body = await request.json().catch(()=>({}));
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkAdminLogin"])(username, password)) {
        fails.set(ip, {
            count: (current?.count ?? 0) + 1,
            since: current?.since ?? now
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Wrong username or password"
        }, {
            status: 401
        });
    }
    fails.delete(ip);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAdminSession"])(username);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        username
    });
}
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_COOKIE",
    ()=>COOKIE,
    "adminGuard",
    ()=>adminGuard,
    "checkAdminLogin",
    ()=>checkAdminLogin,
    "clearAdminSession",
    ()=>clearAdminSession,
    "createAdminToken",
    ()=>createAdminToken,
    "isAdminLoggedIn",
    ()=>isAdminLoggedIn,
    "setAdminSession",
    ()=>setAdminSession,
    "verifyAdminToken",
    ()=>verifyAdminToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
;
;
;
;
const COOKIE = "duecollect_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
function secret() {
    return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "duecollect-dev-secret";
}
function sign(value) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])("sha256", secret()).update(value).digest("hex");
}
function createAdminToken(username) {
    const payload = `${username}.${Date.now()}`;
    return `${payload}.${sign(payload)}`;
}
function verifyAdminToken(token) {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [username, ts, sig] = parts;
    const payload = `${username}.${ts}`;
    const expected = sign(payload);
    try {
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(a, b)) return false;
    } catch  {
        return false;
    }
    const { username: expectedUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminCredentials"])();
    if (username !== expectedUser) return false;
    const age = Date.now() - Number(ts);
    return Number.isFinite(age) && age >= 0 && age < MAX_AGE * 1000;
}
async function isAdminLoggedIn() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return verifyAdminToken(jar.get(COOKIE)?.value);
}
async function setAdminSession(username) {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    jar.set(COOKIE, createAdminToken(username), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: MAX_AGE
    });
}
async function clearAdminSession() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    jar.delete(COOKIE);
}
async function adminGuard() {
    if (await isAdminLoggedIn()) return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
}
function checkAdminLogin(username, password) {
    const creds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminCredentials"])();
    // Env values are trimmed, so ignore stray spaces from copy/paste or autofill.
    const user = username.trim();
    const pass = password.trim();
    const ok = user === creds.username && pass === creds.password;
    if (!ok && ("TURBOPACK compile-time value", "development") !== "production") {
        // Dev-only hint in the server terminal (never prints the password).
        const fromEnv = Boolean(process.env.ADMIN_PASSWORD?.trim());
        console.log(`[duecollect] login failed: username ${user === creds.username ? "OK" : `WRONG (server expects "${creds.username}")`}, ` + `password ${pass === creds.password ? "OK" : `WRONG (${creds.password.length} chars expected, ${pass.length} typed)`}` + `${fromEnv ? "" : " — ADMIN_PASSWORD not loaded from .env.local, using default \"admin\""}`);
    }
    return ok;
}
;
}),
"[project]/src/lib/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminCredentials",
    ()=>adminCredentials,
    "appBaseUrl",
    ()=>appBaseUrl,
    "autoSettleMinConfidence",
    ()=>autoSettleMinConfidence,
    "emailConfigured",
    ()=>emailConfigured,
    "paymentConfig",
    ()=>paymentConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mail-credentials.ts [app-route] (ecmascript)");
;
function appBaseUrl() {
    return process.env.APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
function paymentConfig() {
    return {
        upiId: process.env.PAYMENT_UPI_ID?.trim() || "",
        payeeName: process.env.PAYMENT_PAYEE_NAME?.trim() || "DueCollect",
        notePrefix: process.env.PAYMENT_NOTE_PREFIX?.trim() || "INV"
    };
}
function adminCredentials() {
    return {
        username: process.env.ADMIN_USERNAME?.trim() || "admin",
        password: process.env.ADMIN_PASSWORD?.trim() || "admin"
    };
}
function emailConfigured() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendingConfigured"])();
}
function autoSettleMinConfidence() {
    const n = Number(process.env.AUTO_SETTLE_MIN_CONFIDENCE);
    return Number.isFinite(n) && n > 0 && n <= 1 ? n : 0.75;
}
}),
"[project]/src/lib/mail-credentials.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mailCredentials",
    ()=>mailCredentials,
    "receivingConfigured",
    ()=>receivingConfigured,
    "sendingConfigured",
    ()=>sendingConfigured
]);
/**
 * The ONE place DueCollect gets the mailbox email + password from.
 *
 * Put the values in .env.local (never commit that file):
 *
 *   MAIL_EMAIL=billing@yourdomain.com
 *   MAIL_PASSWORD=your-app-password
 *
 * Gmail/Outlook need an "app password", not your normal password.
 * Hosts default from the email domain (Gmail/Outlook/Yahoo auto-detected);
 * override with MAIL_SMTP_HOST / MAIL_IMAP_HOST for anything else.
 *
 * The old SMTP_* variables still work as a fallback.
 */ const PRESETS = {
    "gmail.com": {
        smtp: "smtp.gmail.com",
        imap: "imap.gmail.com"
    },
    "googlemail.com": {
        smtp: "smtp.gmail.com",
        imap: "imap.gmail.com"
    },
    "outlook.com": {
        smtp: "smtp-mail.outlook.com",
        imap: "outlook.office365.com"
    },
    "hotmail.com": {
        smtp: "smtp-mail.outlook.com",
        imap: "outlook.office365.com"
    },
    "live.com": {
        smtp: "smtp-mail.outlook.com",
        imap: "outlook.office365.com"
    },
    "yahoo.com": {
        smtp: "smtp.mail.yahoo.com",
        imap: "imap.mail.yahoo.com"
    },
    "zoho.com": {
        smtp: "smtp.zoho.com",
        imap: "imap.zoho.com"
    }
};
function bareAddress(from) {
    const m = from.match(/<([^>]+)>/);
    return (m ? m[1] : from).trim();
}
function mailCredentials() {
    const email = (process.env.MAIL_EMAIL || process.env.SMTP_USER || "").trim();
    const password = process.env.MAIL_PASSWORD || process.env.SMTP_PASS || "";
    const domain = email.split("@")[1]?.toLowerCase() || "";
    const preset = PRESETS[domain];
    const smtpHost = process.env.MAIL_SMTP_HOST || process.env.SMTP_HOST || preset?.smtp || "";
    const imapHost = process.env.MAIL_IMAP_HOST || preset?.imap || (smtpHost ? smtpHost.replace(/^smtp[-.]?/, "imap.") : "");
    const smtpPort = Number(process.env.MAIL_SMTP_PORT || process.env.SMTP_PORT || 587);
    const from = process.env.MAIL_FROM || process.env.SMTP_FROM || (email ? `DueCollect <${email}>` : "");
    return {
        email,
        password,
        from,
        fromAddress: from ? bareAddress(from).toLowerCase() : email.toLowerCase(),
        smtp: {
            host: smtpHost,
            port: smtpPort,
            secure: (process.env.MAIL_SMTP_SECURE ?? process.env.SMTP_SECURE) === "true" || smtpPort === 465
        },
        imap: {
            host: imapHost,
            port: Number(process.env.MAIL_IMAP_PORT || 993),
            secure: (process.env.MAIL_IMAP_SECURE ?? "true") !== "false"
        }
    };
}
function sendingConfigured() {
    const c = mailCredentials();
    return Boolean(c.email && c.password && c.smtp.host);
}
function receivingConfigured() {
    const c = mailCredentials();
    return Boolean(c.email && c.password && c.imap.host);
}
}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08-fy5ut4ovvh._.js.map