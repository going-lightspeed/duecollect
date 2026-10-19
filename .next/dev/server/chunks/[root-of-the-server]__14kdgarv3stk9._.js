module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/reminders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET() {
    const reminders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listReminders"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        reminders
    });
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
/* ------------------------------------------------------------------ */ /* emails.csv — every email Remitra sent or received (append-only)     */ /* ------------------------------------------------------------------ */ const EMAILS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "emails.csv");
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

//# sourceMappingURL=%5Broot-of-the-server%5D__14kdgarv3stk9._.js.map