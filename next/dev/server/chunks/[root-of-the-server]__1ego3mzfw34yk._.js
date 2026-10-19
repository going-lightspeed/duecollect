module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/reminders/run/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reminders.ts [app-route] (ecmascript)");
;
;
;
async function handle() {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runReminderScan"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ...result,
        ai: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiConfigStatus"])()
    });
}
async function POST() {
    return handle();
}
async function GET() {
    return handle();
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
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addReminder",
    ()=>addReminder,
    "deleteInvoice",
    ()=>deleteInvoice,
    "getInvoice",
    ()=>getInvoice,
    "hasRecentReminder",
    ()=>hasRecentReminder,
    "listInvoices",
    ()=>listInvoices,
    "listReminders",
    ()=>listReminders,
    "readStore",
    ()=>readStore,
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
    reminders: []
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
            reminders: parsed.reminders ?? []
        };
    } catch  {
        return {
            ...empty,
            invoices: [],
            reminders: []
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
    // Keep last 200 reminders
    store.reminders = store.reminders.slice(0, 200);
    await writeStore(store);
    return reminder;
}
async function hasRecentReminder(invoiceId, kind, withinHours = 20) {
    const store = await readStore();
    const cutoff = Date.now() - withinHours * 60 * 60 * 1000;
    return store.reminders.some((r)=>r.invoiceId === invoiceId && r.kind === kind && new Date(r.createdAt).getTime() >= cutoff);
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
    for (const raw of invoices){
        if (raw.status === "paid") continue;
        const invoice = refreshInvoiceStatus(raw);
        if (invoice.status !== raw.status) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])(invoice);
            updatedStatuses += 1;
        }
        const pick = pickKind(invoice);
        if (!pick) continue;
        // Avoid spamming the same kind within ~20h (daily cron friendly)
        const already = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasRecentReminder"])(invoice.id, pick.kind, 20);
        if (already) continue;
        const { message, aiGenerated } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["craftReminder"])(invoice, pick.kind, pick.daysRelative);
        const reminder = {
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
            daysRelative: pick.daysRelative
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addReminder"])(reminder);
        created.push(reminder);
    }
    return {
        created,
        checked: invoices.length,
        updatedStatuses
    };
}
function computeStats(invoices) {
    const open = invoices.filter((i)=>i.status !== "paid");
    const payable = open.filter((i)=>i.direction === "payable");
    const receivable = open.filter((i)=>i.direction === "receivable");
    const overdue = open.filter((i)=>i.status === "overdue");
    const sum = (list)=>list.reduce((acc, i)=>acc + (i.currency === "USD" ? i.amount : i.amount), 0);
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
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1ego3mzfw34yk._.js.map