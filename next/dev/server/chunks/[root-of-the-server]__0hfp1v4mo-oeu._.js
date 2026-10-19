module.exports = [
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
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const DATA_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "store.json");
const empty = {
    invoices: [],
    reminders: [],
    payments: []
};
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0hfp1v4mo-oeu._.js.map