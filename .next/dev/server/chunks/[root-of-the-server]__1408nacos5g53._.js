module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/payments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
;
;
async function GET() {
    const admin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAdminLoggedIn"])();
    if (!admin) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const payments = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listPayments"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        payments
    });
}
async function POST(request) {
    const body = await request.json();
    const invoiceId = String(body.invoiceId || "");
    const paymentId = String(body.paymentId || "").trim();
    const note = String(body.note || "").trim();
    if (!invoiceId || !paymentId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "invoiceId and paymentId are required"
        }, {
            status: 400
        });
    }
    const invoice = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInvoice"])(invoiceId);
    if (!invoice) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invoice not found"
        }, {
            status: 404
        });
    }
    if (invoice.status === "paid") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invoice already paid"
        }, {
            status: 400
        });
    }
    const payment = {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        invoiceId,
        paymentId,
        amount: invoice.amount,
        currency: invoice.currency,
        partyName: invoice.partyName,
        note,
        status: "reported",
        reportedAt: new Date().toISOString()
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addPayment"])(payment);
    // Store payment id on invoice immediately as pending confirmation trail
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])({
        ...invoice,
        paymentId
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        payment
    }, {
        status: 201
    });
}
async function PATCH(request) {
    const admin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAdminLoggedIn"])();
    if (!admin) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }
    const body = await request.json();
    const id = String(body.id || "");
    const status = body.status;
    if (!id || ![
        "confirmed",
        "rejected"
    ].includes(status)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "id and status (confirmed|rejected) required"
        }, {
            status: 400
        });
    }
    const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updatePayment"])(id, {
        status,
        confirmedAt: new Date().toISOString(),
        confirmedBy: "admin"
    });
    if (!updated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Payment not found"
        }, {
            status: 404
        });
    }
    if (status === "confirmed") {
        const invoice = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInvoice"])(updated.invoiceId);
        if (invoice) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])({
                ...invoice,
                status: "paid",
                paidAt: new Date().toISOString(),
                paymentId: updated.paymentId
            });
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        payment: updated
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
"[project]/src/lib/csv-ledger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appendEmailLog",
    ()=>appendEmailLog,
    "csvPath",
    ()=>csvPath,
    "readDebtsCsv",
    ()=>readDebtsCsv,
    "readEmailLog",
    ()=>readEmailLog,
    "readSeenMessages",
    ()=>readSeenMessages,
    "syncDebtsCsv",
    ()=>syncDebtsCsv,
    "syncPaymentsCsv",
    ()=>syncPaymentsCsv,
    "writeSeenMessages",
    ()=>writeSeenMessages
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const CSV_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "debts.csv");
const HEADER = [
    "id",
    "party_name",
    "party_email",
    "direction",
    "amount",
    "currency",
    "description",
    "due_date",
    "status",
    "added_at",
    "settled_at",
    "amount_settled",
    "payment_id",
    "settlement_method"
].join(",");
function esc(value) {
    const s = value == null ? "" : String(value);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}
function rowFromInvoice(inv) {
    const settled = inv.status === "paid";
    return [
        esc(inv.id),
        esc(inv.partyName),
        esc(inv.partyEmail),
        esc(inv.direction),
        esc(inv.amount),
        esc(inv.currency),
        esc(inv.description),
        esc(inv.dueDate),
        esc(inv.status),
        esc(inv.createdAt),
        esc(inv.paidAt || ""),
        esc(settled ? inv.amount : ""),
        esc(inv.paymentId || ""),
        esc(inv.settlementMethod || "")
    ].join(",");
}
async function ensureCsv() {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(CSV_FILE);
    } catch  {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(CSV_FILE, HEADER + "\n", "utf8");
    }
}
async function syncDebtsCsv(invoices) {
    await ensureCsv();
    const lines = [
        HEADER,
        ...invoices.map(rowFromInvoice)
    ];
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(CSV_FILE, lines.join("\n") + "\n", "utf8");
}
async function readDebtsCsv() {
    await ensureCsv();
    return __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(CSV_FILE, "utf8");
}
function csvPath() {
    return CSV_FILE;
}
/* ------------------------------------------------------------------ */ /* payments.csv — every payment reported / verified / confirmed        */ /* ------------------------------------------------------------------ */ const PAYMENTS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "payments.csv");
const PAYMENTS_HEADER = [
    "id",
    "invoice_id",
    "party_name",
    "payment_id",
    "amount",
    "currency",
    "status",
    "reported_at",
    "confirmed_at",
    "confirmed_by",
    "verified_by_ai",
    "note"
].join(",");
async function syncPaymentsCsv(payments) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
    const rows = payments.map((p)=>[
            esc(p.id),
            esc(p.invoiceId),
            esc(p.partyName),
            esc(p.paymentId),
            esc(p.amount),
            esc(p.currency),
            esc(p.status),
            esc(p.reportedAt),
            esc(p.confirmedAt || ""),
            esc(p.confirmedBy || ""),
            esc(p.verifiedByAi ? "yes" : ""),
            esc(p.note)
        ].join(","));
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(PAYMENTS_FILE, [
        PAYMENTS_HEADER,
        ...rows
    ].join("\n") + "\n", "utf8");
}
/* ------------------------------------------------------------------ */ /* emails.csv — every email DueCollect sent or received (append-only)     */ /* ------------------------------------------------------------------ */ const EMAILS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "emails.csv");
const EMAILS_HEADER = [
    "id",
    "at",
    "direction",
    "email",
    "party_name",
    "invoice_ids",
    "subject",
    "outcome",
    "detail"
].join(",");
async function appendEmailLog(entry) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(EMAILS_FILE);
    } catch  {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(EMAILS_FILE, EMAILS_HEADER + "\n", "utf8");
    }
    const row = [
        esc(entry.id),
        esc(entry.at),
        esc(entry.direction),
        esc(entry.email),
        esc(entry.partyName),
        esc(entry.invoiceIds.join(" ")),
        esc(entry.subject),
        esc(entry.outcome),
        esc(entry.detail.slice(0, 500))
    ].join(",");
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].appendFile(EMAILS_FILE, row + "\n", "utf8");
}
function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for(let i = 0; i < text.length; i++){
        const c = text[i];
        if (quoted) {
            if (c === '"' && text[i + 1] === '"') {
                cell += '"';
                i++;
            } else if (c === '"') quoted = false;
            else cell += c;
        } else if (c === '"') quoted = true;
        else if (c === ",") {
            row.push(cell);
            cell = "";
        } else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++;
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
        } else cell += c;
    }
    if (cell || row.length) {
        row.push(cell);
        rows.push(row);
    }
    return rows;
}
async function readEmailLog(limit = 50) {
    let text;
    try {
        text = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(EMAILS_FILE, "utf8");
    } catch  {
        return [];
    }
    const [, ...rows] = parseCsv(text).filter((r)=>r.length > 1);
    return rows.map((r)=>({
            id: r[0],
            at: r[1],
            direction: r[2],
            email: r[3],
            partyName: r[4],
            invoiceIds: r[5] ? r[5].split(" ") : [],
            subject: r[6],
            outcome: r[7],
            detail: r[8] ?? ""
        })).reverse().slice(0, limit);
}
/** Message-ids already processed by the inbox poller (survives restarts). */ const SEEN_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "inbox-seen.json");
async function readSeenMessages() {
    try {
        return new Set(JSON.parse(await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(SEEN_FILE, "utf8")));
    } catch  {
        return new Set();
    }
}
async function writeSeenMessages(ids) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(SEEN_FILE, JSON.stringify([
        ...ids
    ].slice(-2000)), "utf8");
}
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addPayment",
    ()=>addPayment,
    "addReminder",
    ()=>addReminder,
    "deleteInvoice",
    ()=>deleteInvoice,
    "getInvoice",
    ()=>getInvoice,
    "getPaymentsForInvoice",
    ()=>getPaymentsForInvoice,
    "hasRecentReminder",
    ()=>hasRecentReminder,
    "listInvoices",
    ()=>listInvoices,
    "listPayments",
    ()=>listPayments,
    "listReminders",
    ()=>listReminders,
    "readStore",
    ()=>readStore,
    "updatePayment",
    ()=>updatePayment,
    "updateReminder",
    ()=>updateReminder,
    "upsertInvoice",
    ()=>upsertInvoice,
    "writeStore",
    ()=>writeStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$ledger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/csv-ledger.ts [app-route] (ecmascript)");
;
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const DATA_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "store.json");
async function ensureDir() {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
}
async function readStore() {
    try {
        await ensureDir();
        const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(DATA_FILE, "utf8");
        const parsed = JSON.parse(raw);
        return {
            invoices: parsed.invoices ?? [],
            reminders: parsed.reminders ?? [],
            payments: parsed.payments ?? []
        };
    } catch  {
        return {
            invoices: [],
            reminders: [],
            payments: []
        };
    }
}
async function writeStore(data) {
    await ensureDir();
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$ledger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncDebtsCsv"])(data.invoices);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$ledger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncPaymentsCsv"])(data.payments);
}
async function listInvoices() {
    const store = await readStore();
    return store.invoices.sort((a, b)=>new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}
async function getInvoice(id) {
    const store = await readStore();
    return store.invoices.find((i)=>i.id === id);
}
async function upsertInvoice(invoice) {
    const store = await readStore();
    const idx = store.invoices.findIndex((i)=>i.id === invoice.id);
    if (idx >= 0) store.invoices[idx] = invoice;
    else store.invoices.push(invoice);
    await writeStore(store);
    return invoice;
}
async function deleteInvoice(id) {
    const store = await readStore();
    const before = store.invoices.length;
    store.invoices = store.invoices.filter((i)=>i.id !== id);
    store.reminders = store.reminders.filter((r)=>r.invoiceId !== id);
    store.payments = store.payments.filter((p)=>p.invoiceId !== id);
    await writeStore(store);
    return store.invoices.length < before;
}
async function listReminders() {
    const store = await readStore();
    return store.reminders.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
async function addReminder(reminder) {
    const store = await readStore();
    store.reminders.unshift(reminder);
    store.reminders = store.reminders.slice(0, 200);
    await writeStore(store);
    return reminder;
}
async function updateReminder(id, patch) {
    const store = await readStore();
    const idx = store.reminders.findIndex((r)=>r.id === id);
    if (idx < 0) return undefined;
    store.reminders[idx] = {
        ...store.reminders[idx],
        ...patch
    };
    await writeStore(store);
    return store.reminders[idx];
}
async function hasRecentReminder(invoiceId, kind, withinHours = 20) {
    const store = await readStore();
    const cutoff = Date.now() - withinHours * 60 * 60 * 1000;
    return store.reminders.some((r)=>r.invoiceId === invoiceId && r.kind === kind && new Date(r.createdAt).getTime() >= cutoff);
}
async function listPayments() {
    const store = await readStore();
    return store.payments.sort((a, b)=>new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
}
async function addPayment(payment) {
    const store = await readStore();
    store.payments.unshift(payment);
    await writeStore(store);
    return payment;
}
async function updatePayment(id, patch) {
    const store = await readStore();
    const idx = store.payments.findIndex((p)=>p.id === id);
    if (idx < 0) return undefined;
    store.payments[idx] = {
        ...store.payments[idx],
        ...patch
    };
    await writeStore(store);
    return store.payments[idx];
}
async function getPaymentsForInvoice(invoiceId) {
    const store = await readStore();
    return store.payments.filter((p)=>p.invoiceId === invoiceId);
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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

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

//# sourceMappingURL=%5Broot-of-the-server%5D__1408nacos5g53._.js.map