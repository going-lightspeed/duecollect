module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/invoices/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reminders.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET() {
    const invoices = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listInvoices"])();
    const refreshed = await Promise.all(invoices.map(async (inv)=>{
        const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshInvoiceStatus"])(inv);
        if (next.status !== inv.status) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])(next);
        return next;
    }));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        invoices: refreshed
    });
}
async function POST(request) {
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAdminLoggedIn"])()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Admin only"
        }, {
            status: 401
        });
    }
    const body = await request.json();
    if (!body.partyName?.trim() || !body.dueDate || !body.amount) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "partyName, amount, and dueDate are required"
        }, {
            status: 400
        });
    }
    if (![
        "payable",
        "receivable"
    ].includes(body.direction)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "direction must be payable or receivable"
        }, {
            status: 400
        });
    }
    const now = new Date().toISOString();
    const invoice = {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        direction: body.direction,
        partyName: body.partyName.trim(),
        partyEmail: (body.partyEmail ?? "").trim(),
        amount: Number(body.amount),
        currency: body.currency?.trim() || "USD",
        description: (body.description ?? "").trim(),
        issueDate: body.issueDate || now.slice(0, 10),
        dueDate: body.dueDate,
        graceDays: body.graceDays ?? 7,
        status: "pending",
        reminderDaysBefore: body.reminderDaysBefore ?? [
            7,
            3,
            1
        ],
        createdAt: now
    };
    const saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshInvoiceStatus"])(invoice));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        invoice: saved
    }, {
        status: 201
    });
}
}),
"[project]/src/lib/ai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aiConfigStatus",
    ()=>aiConfigStatus,
    "craftReminder",
    ()=>craftReminder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
/**
 * Nebius Token Factory + NVIDIA low-cost models for token-optimized copy.
 * Default: Nemotron-3.5-Lightning (~$0.06 / $0.24 per 1M tokens).
 */ const BASE_URL = process.env.NEBIUS_BASE_URL ?? "https://api.tokenfactory.nebius.com/v1/";
const MODEL = process.env.NEBIUS_MODEL ?? "nvidia/Nemotron-3_5-Lightning";
function client() {
    const apiKey = process.env.NEBIUS_API_KEY;
    if (!apiKey) return null;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey,
        baseURL: BASE_URL
    });
}
function money(amount, currency) {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency
        }).format(amount);
    } catch  {
        return `${currency} ${amount.toFixed(2)}`;
    }
}
function templateMessage(invoice, kind, daysRelative) {
    const amt = money(invoice.amount, invoice.currency);
    const party = invoice.partyName;
    if (invoice.direction === "payable") {
        if (kind === "upcoming") {
            return `Heads up — ${amt} is due to ${party} in ${daysRelative} day${daysRelative === 1 ? "" : "s"} (${invoice.dueDate}). Set funds aside so payment stays on time.`;
        }
        if (kind === "due_today") {
            return `Payment due today: ${amt} owed to ${party}. Settle invoice “${invoice.description || "bill"}” to avoid late fees.`;
        }
        return `Overdue by ${daysRelative} day${daysRelative === 1 ? "" : "s"}: you still owe ${party} ${amt}. Pay as soon as you can to clear this balance.`;
    }
    if (kind === "upcoming") {
        return `${party} should pay ${amt} in ${daysRelative} day${daysRelative === 1 ? "" : "s"} (${invoice.dueDate}). A gentle nudge now keeps cash flow predictable.`;
    }
    if (kind === "due_today") {
        return `${party}'s invoice for ${amt} is due today. Confirm receipt or send a same-day reminder.`;
    }
    return `${party} has not paid ${amt} — ${daysRelative} day${daysRelative === 1 ? "" : "s"} past due (grace applied). Follow up now and escalate if needed.`;
}
async function craftReminder(invoice, kind, daysRelative) {
    const fallback = templateMessage(invoice, kind, daysRelative);
    const openai = client();
    if (!openai) {
        return {
            message: fallback,
            aiGenerated: false
        };
    }
    // Token-optimized: tiny system prompt + compact facts, low max_tokens
    const role = invoice.direction === "payable" ? "user owes a vendor" : "client owes the user";
    try {
        const response = await openai.chat.completions.create({
            model: MODEL,
            max_tokens: 90,
            temperature: 0.4,
            messages: [
                {
                    role: "system",
                    content: "Write one short invoice reminder (max 2 sentences). Professional, warm, actionable. No subject line. No markdown."
                },
                {
                    role: "user",
                    content: [
                        `kind=${kind}`,
                        `role=${role}`,
                        `party=${invoice.partyName}`,
                        `amount=${money(invoice.amount, invoice.currency)}`,
                        `due=${invoice.dueDate}`,
                        `days=${daysRelative}`,
                        `note=${invoice.description || "n/a"}`
                    ].join(" | ")
                }
            ]
        });
        const text = response.choices[0]?.message?.content?.trim();
        if (!text) return {
            message: fallback,
            aiGenerated: false
        };
        return {
            message: text,
            aiGenerated: true
        };
    } catch (err) {
        console.error("Nebius AI reminder failed, using template:", err);
        return {
            message: fallback,
            aiGenerated: false
        };
    }
}
function aiConfigStatus() {
    return {
        configured: Boolean(process.env.NEBIUS_API_KEY),
        model: MODEL,
        baseUrl: BASE_URL
    };
}
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_COOKIE",
    ()=>COOKIE,
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
;
;
;
const COOKIE = "remitra_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
function secret() {
    return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "remitra-dev-secret";
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
function checkAdminLogin(username, password) {
    const creds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminCredentials"])();
    return username === creds.username && password === creds.password;
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
    "emailConfigured",
    ()=>emailConfigured,
    "paymentConfig",
    ()=>paymentConfig
]);
function appBaseUrl() {
    return process.env.APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
function paymentConfig() {
    return {
        upiId: process.env.PAYMENT_UPI_ID?.trim() || "",
        payeeName: process.env.PAYMENT_PAYEE_NAME?.trim() || "Remitra",
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
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}
}),
"[project]/src/lib/csv-ledger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "csvPath",
    ()=>csvPath,
    "readDebtsCsv",
    ()=>readDebtsCsv,
    "syncDebtsCsv",
    ()=>syncDebtsCsv
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
"[project]/src/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invoiceEmailTag",
    ()=>invoiceEmailTag,
    "mailStatus",
    ()=>mailStatus,
    "sendPaymentReminderEmail",
    ()=>sendPaymentReminderEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$dist$2f$esm$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/dist/esm/nodemailer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-route] (ecmascript)");
;
;
;
function mailStatus() {
    return {
        configured: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailConfigured"])(),
        from: process.env.SMTP_FROM || null,
        replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM || null
    };
}
function transporter() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailConfigured"])()) return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$dist$2f$esm$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}
function invoiceEmailTag(invoiceId) {
    return `[Remitra INV:${invoiceId}]`;
}
async function sendPaymentReminderEmail(invoice, reminder) {
    const to = invoice.partyEmail?.trim();
    if (!to) {
        return {
            sent: false,
            error: "No party email on invoice"
        };
    }
    const transport = transporter();
    if (!transport) {
        return {
            sent: false,
            error: "SMTP not configured"
        };
    }
    const payUrl = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appBaseUrl"])()}/pay/${invoice.id}`;
    const amount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatMoney"])(invoice.amount, invoice.currency);
    const tag = invoiceEmailTag(invoice.id);
    const replyTo = process.env.SMTP_REPLY_TO?.trim() || process.env.SMTP_FROM?.trim();
    const subject = reminder.kind === "overdue" ? `${tag} Overdue — ${amount} still unpaid` : reminder.kind === "due_today" ? `${tag} Payment due today — ${amount}` : `${tag} Payment reminder — ${amount} due ${invoice.dueDate}`;
    const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#14221c;line-height:1.5">
    <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#3f6b55">Remitra</p>
    <h1 style="font-size:22px;margin:8px 0 16px">Payment reminder</h1>
    <p>${reminder.message}</p>
    <p style="margin:20px 0;padding:16px;background:#eef4ef;border-radius:12px">
      <strong>${invoice.partyName}</strong><br/>
      Amount: <strong>${amount}</strong><br/>
      Due: ${invoice.dueDate}<br/>
      ${invoice.description ? `Note: ${invoice.description}<br/>` : ""}
      Ref: ${tag}
    </p>
    ${invoice.direction === "receivable" ? `<p><a href="${payUrl}" style="display:inline-block;background:#1a6b5c;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Open payment page &amp; QR</a></p>
           <p style="font-size:13px;color:#3d5248">Scan the QR uploaded by admin on that page to pay.</p>
           <p style="font-size:13px;color:#3d5248;margin-top:12px"><strong>After paying:</strong> reply to this email with your payment confirmation (UTR / UPI txn id / screenshot text). Our AI will verify it and mark the invoice paid.</p>` : `<p style="font-size:13px;color:#3d5248">Payable reminder for your records.</p>`}
    <p style="font-size:12px;color:#3d5248;margin-top:28px">Keep ${tag} in the subject when replying.</p>
  </div>`;
    const text = [
        reminder.message,
        "",
        `Amount: ${amount}`,
        `Due: ${invoice.dueDate}`,
        `Pay / QR page: ${payUrl}`,
        "",
        "After paying, reply to this email with your payment confirmation message.",
        `Keep this tag in the subject: ${tag}`
    ].join("\n");
    try {
        await transport.sendMail({
            from: process.env.SMTP_FROM,
            to,
            replyTo,
            subject,
            text,
            html
        });
        return {
            sent: true
        };
    } catch (err) {
        console.error("Email send failed:", err);
        return {
            sent: false,
            error: err instanceof Error ? err.message : "Email failed"
        };
    }
}
}),
"[project]/src/lib/format.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatMoney",
    ()=>formatMoney
]);
function formatMoney(amount, currency = "USD") {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 2
        }).format(amount);
    } catch  {
        return `${currency} ${amount.toFixed(2)}`;
    }
}
function formatDate(iso) {
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(new Date(iso));
    } catch  {
        return iso;
    }
}
}),
"[project]/src/lib/reminders.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeStats",
    ()=>computeStats,
    "refreshInvoiceStatus",
    ()=>refreshInvoiceStatus,
    "runReminderScan",
    ()=>runReminderScan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInCalendarDays.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfDay.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.ts [app-route] (ecmascript)");
;
;
;
;
;
function today() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])(new Date());
}
function refreshInvoiceStatus(invoice) {
    if (invoice.status === "paid") return invoice;
    const daysPastDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInCalendarDays"])(today(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseISO"])(invoice.dueDate)));
    if (daysPastDue > invoice.graceDays) {
        return {
            ...invoice,
            status: "overdue"
        };
    }
    return {
        ...invoice,
        status: "pending"
    };
}
function pickKind(invoice) {
    const daysUntilDue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInCalendarDays"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseISO"])(invoice.dueDate)), today());
    if (daysUntilDue > 0) {
        const windows = invoice.reminderDaysBefore ?? [
            7,
            3,
            1
        ];
        if (windows.includes(daysUntilDue)) {
            return {
                kind: "upcoming",
                daysRelative: daysUntilDue
            };
        }
        return null;
    }
    if (daysUntilDue === 0) {
        return {
            kind: "due_today",
            daysRelative: 0
        };
    }
    const daysOverdue = Math.abs(daysUntilDue);
    if (daysOverdue > invoice.graceDays) {
        return {
            kind: "overdue",
            daysRelative: daysOverdue
        };
    }
    return null;
}
async function runReminderScan() {
    const invoices = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listInvoices"])();
    const created = [];
    let updatedStatuses = 0;
    let emailsSent = 0;
    const emailErrors = [];
    for (const raw of invoices){
        if (raw.status === "paid") continue;
        const invoice = refreshInvoiceStatus(raw);
        if (invoice.status !== raw.status) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])(invoice);
            updatedStatuses += 1;
        }
        const pick = pickKind(invoice);
        if (!pick) continue;
        const already = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasRecentReminder"])(invoice.id, pick.kind, 20);
        if (already) continue;
        const { message, aiGenerated } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["craftReminder"])(invoice, pick.kind, pick.daysRelative);
        let reminder = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            invoiceId: invoice.id,
            partyName: invoice.partyName,
            direction: invoice.direction,
            kind: pick.kind,
            message,
            amount: invoice.amount,
            currency: invoice.currency,
            dueDate: invoice.dueDate,
            createdAt: new Date().toISOString(),
            aiGenerated,
            daysRelative: pick.daysRelative,
            emailed: false
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addReminder"])(reminder);
        // Auto-email: receivables to the client; payables to yourself if email set
        if (invoice.partyEmail?.trim()) {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendPaymentReminderEmail"])(invoice, reminder);
            if (result.sent) {
                emailsSent += 1;
                reminder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateReminder"])(reminder.id, {
                    emailed: true,
                    emailTo: invoice.partyEmail.trim()
                });
            } else if (result.error && result.error !== "SMTP not configured") {
                emailErrors.push(`${invoice.partyName}: ${result.error}`);
            }
        }
        created.push(reminder);
    }
    return {
        created,
        checked: invoices.length,
        updatedStatuses,
        emailsSent,
        emailErrors
    };
}
function computeStats(invoices) {
    const open = invoices.filter((i)=>i.status !== "paid");
    const payable = open.filter((i)=>i.direction === "payable");
    const receivable = open.filter((i)=>i.direction === "receivable");
    const overdue = open.filter((i)=>i.status === "overdue");
    const sum = (list)=>list.reduce((acc, i)=>acc + i.amount, 0);
    return {
        openCount: open.length,
        payableTotal: sum(payable),
        receivableTotal: sum(receivable),
        overdueCount: overdue.length,
        overdueParties: overdue.filter((i)=>i.direction === "receivable").map((i)=>({
                id: i.id,
                partyName: i.partyName,
                amount: i.amount,
                currency: i.currency,
                dueDate: i.dueDate,
                daysOverdue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInCalendarDays"])(today(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseISO"])(i.dueDate)))
            }))
    };
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
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:dns [external] (node:dns, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:dns", () => require("node:dns"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/node:https [external] (node:https, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:tls [external] (node:tls, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:tls", () => require("node:tls"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__18n_secbj60cu._.js.map