module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/invoices/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/reminders.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/status.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reminders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function GET() {
    const denied = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminGuard"])();
    if (denied) return denied;
    const invoices = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listInvoices"])();
    const refreshed = await Promise.all(invoices.map(async (inv)=>{
        const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshInvoiceStatus"])(inv);
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
    const saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertInvoice"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshInvoiceStatus"])(invoice));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        invoice: saved
    }, {
        status: 201
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/ai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aiConfigStatus",
    ()=>aiConfigStatus,
    "composeDuesEmail",
    ()=>composeDuesEmail,
    "craftReminder",
    ()=>craftReminder,
    "toDueLines",
    ()=>toDueLines
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInCalendarDays.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfDay.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/local-ai.ts [app-route] (ecmascript)");
;
;
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
    const role = invoice.direction === "payable" ? "user owes a vendor" : "client owes the user";
    try {
        const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["localChat"])({
            system: "Write one short invoice reminder (max 2 sentences). Professional, warm, actionable. No subject line. No markdown.",
            user: [
                `kind=${kind}`,
                `role=${role}`,
                `party=${invoice.partyName}`,
                `amount=${money(invoice.amount, invoice.currency)}`,
                `due=${invoice.dueDate}`,
                `days=${daysRelative}`,
                `note=${invoice.description || "n/a"}`
            ].join(" | "),
            maxTokens: 90,
            temperature: 0.4
        });
        if (!text) return {
            message: fallback,
            aiGenerated: false
        };
        return {
            message: text,
            aiGenerated: true
        };
    } catch (err) {
        console.error("Local AI reminder failed, using template:", err);
        return {
            message: fallback,
            aiGenerated: false
        };
    }
}
function toDueLines(invoices) {
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])(new Date());
    return invoices.map((invoice)=>({
            invoice,
            daysOverdue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["differenceInCalendarDays"])(today, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseISO"])(invoice.dueDate)))
        })).sort((a, b)=>b.daysOverdue - a.daysOverdue);
}
function sumByCurrency(lines) {
    const totals = new Map();
    for (const { invoice } of lines){
        totals.set(invoice.currency, (totals.get(invoice.currency) ?? 0) + invoice.amount);
    }
    return [
        ...totals.entries()
    ].map(([cur, amt])=>money(amt, cur)).join(" + ");
}
function templateEmailBody(name, lines, hasQr) {
    const overdue = lines.filter((l)=>l.daysOverdue > 0);
    const total = sumByCurrency(lines);
    const pay = hasQr ? "You can pay by scanning the QR code attached to this email." : "Please use the payment details we have shared with you.";
    if (overdue.length === 0) {
        return `Hi ${name},\n\nA quick reminder that ${total} is coming up for payment, as itemised below. ${pay}\n\nOnce you have paid, just reply to this email with a screenshot of the payment and we will update our records.\n\nThank you!`;
    }
    const oldest = overdue[0].daysOverdue;
    return `Hi ${name},\n\nOur records show ${overdue.length} overdue payment${overdue.length === 1 ? "" : "s"}, the oldest by ${oldest} day${oldest === 1 ? "" : "s"}, bringing your total outstanding to ${total} (itemised below). ${pay}\n\nOnce you have paid, please reply to this email with a screenshot of the payment so we can update our records. If you have already paid, send us the receipt and we will sort it out straight away.\n\nThank you.`;
}
async function composeDuesEmail(opts) {
    const { customerName, lines, businessName, hasQr } = opts;
    const overdue = lines.filter((l)=>l.daysOverdue > 0);
    const total = sumByCurrency(lines);
    const subject = overdue.length > 0 ? `Overdue payment${overdue.length === 1 ? "" : "s"} — ${total} outstanding` : `Payment reminder — ${total} due`;
    const fallback = templateEmailBody(customerName, lines, hasQr);
    const facts = lines.map(({ invoice, daysOverdue })=>`- ${money(invoice.amount, invoice.currency)} for "${invoice.description || "invoice"}", due ${invoice.dueDate} (${daysOverdue > 0 ? `${daysOverdue} days overdue` : daysOverdue === 0 ? "due today" : `due in ${-daysOverdue} days`})`).join("\n");
    try {
        const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["localChat"])({
            system: [
                `You write payment-collection emails on behalf of ${businessName}.`,
                "Write ONLY the email body: a greeting, 2-3 short paragraphs, and a sign-off. No subject line, no markdown, no tables.",
                "Take ALL the dues into account: mention how many are outstanding, the total, and acknowledge the oldest overdue one.",
                "Tone: warm and professional if nothing is overdue; politely firm if something is overdue for more than 14 days. Never threaten.",
                "Say the payment QR code is attached (if hasQr=yes) and that after paying they should REPLY to this email with a screenshot or receipt of the payment.",
                "Do not invent amounts, dates, links, or bank details. An itemised list is added below your text automatically."
            ].join(" "),
            user: [
                `customer=${customerName}`,
                `hasQr=${hasQr ? "yes" : "no"}`,
                `total=${total}`,
                `dues:`,
                facts
            ].join("\n"),
            maxTokens: 300,
            temperature: 0.4
        });
        if (text.length < 40) return {
            subject,
            body: fallback,
            aiGenerated: false
        };
        return {
            subject,
            body: text,
            aiGenerated: true
        };
    } catch (err) {
        console.error("Local AI email compose failed, using template:", err);
        return {
            subject,
            body: fallback,
            aiGenerated: false
        };
    }
}
function aiConfigStatus() {
    const cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["localAiSettings"])();
    return {
        configured: process.env.LOCAL_AI_DISABLED !== "true",
        model: cfg.model,
        baseUrl: cfg.baseUrl
    };
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
"[project]/src/lib/collections.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "openDuesFor",
    ()=>openDuesFor,
    "sameEmail",
    ()=>sameEmail,
    "sendDuesEmail",
    ()=>sendDuesEmail,
    "sendDuesToAll",
    ()=>sendDuesToAll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$ledger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/csv-ledger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$qr$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/qr-store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/status.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$qr$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$qr$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
const sameEmail = (a, b)=>Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());
async function openDuesFor(email) {
    const all = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listInvoices"])();
    return all.filter((i)=>i.direction === "receivable" && i.status !== "paid" && sameEmail(i.partyEmail, email)).map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshInvoiceStatus"]);
}
async function sendDuesEmail(email, opts = {}) {
    const dues = await openDuesFor(email);
    const partyName = dues[0]?.partyName || email;
    const base = {
        email,
        partyName,
        invoiceIds: dues.map((d)=>d.id)
    };
    if (dues.length === 0) return {
        ...base,
        sent: false,
        skipped: "No open dues"
    };
    if (!opts.force) {
        const cutoff = Date.now() - 20 * 60 * 60 * 1000;
        const recent = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$ledger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readEmailLog"])(200)).some((e)=>e.direction === "outbound" && e.outcome === "sent" && sameEmail(e.email, email) && new Date(e.at).getTime() >= cutoff);
        if (recent) return {
            ...base,
            sent: false,
            skipped: "Emailed within the last 20h"
        };
    }
    const qr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$qr$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readAdminQrFile"])();
    const lines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toDueLines"])(dues);
    const mail = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["composeDuesEmail"])({
        customerName: partyName,
        lines,
        businessName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paymentConfig"])().payeeName,
        hasQr: Boolean(qr),
        qrPayee: qr?.info.upiId
    });
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendDuesMail"])({
        to: email,
        customerName: partyName,
        subject: mail.subject,
        body: mail.body,
        lines,
        qr: qr ? {
            buffer: qr.buffer,
            mimeType: qr.info.mimeType
        } : null
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$ledger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendEmailLog"])({
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        at: new Date().toISOString(),
        direction: "outbound",
        email,
        partyName,
        invoiceIds: base.invoiceIds,
        subject: result.subject,
        outcome: result.sent ? "sent" : "failed",
        detail: result.sent ? `${mail.aiGenerated ? "AI-written" : "template"} · ${dues.length} due(s)${qr ? " · QR attached" : " · no QR uploaded"}` : result.error || "failed"
    });
    return {
        ...base,
        sent: result.sent,
        error: result.error,
        aiGenerated: mail.aiGenerated
    };
}
async function sendDuesToAll(opts = {}) {
    const all = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listInvoices"])();
    const emails = new Map();
    for (const i of all){
        if (i.direction === "receivable" && i.status !== "paid" && i.partyEmail?.trim()) {
            emails.set(i.partyEmail.trim().toLowerCase(), i.partyEmail.trim());
        }
    }
    const results = [];
    for (const email of emails.values()){
        results.push(await sendDuesEmail(email, opts));
    }
    return results;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/src/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "esc",
    ()=>esc,
    "invoiceEmailTag",
    ()=>invoiceEmailTag,
    "mailStatus",
    ()=>mailStatus,
    "sendAutoReply",
    ()=>sendAutoReply,
    "sendDuesMail",
    ()=>sendDuesMail,
    "sendPaymentReminderEmail",
    ()=>sendPaymentReminderEmail
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$nodemailer$29$__ = __turbopack_context__.i("[externals]/nodemailer [external] (nodemailer, esm_import, [project]/node_modules/nodemailer)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mail-credentials.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$nodemailer$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$nodemailer$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function mailStatus() {
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mailCredentials"])();
    return {
        configured: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailConfigured"])(),
        from: c.from || null,
        replyTo: process.env.SMTP_REPLY_TO || c.from || null,
        inboxHost: c.imap.host || null
    };
}
function transporter() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailConfigured"])()) return null;
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mailCredentials"])();
    return __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$nodemailer$29$__["default"].createTransport({
        host: c.smtp.host,
        port: c.smtp.port,
        secure: c.smtp.secure,
        auth: {
            user: c.email,
            pass: c.password
        }
    });
}
function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function invoiceEmailTag(invoiceId) {
    return `[DueCollect INV:${invoiceId}]`;
}
/** Public pay-page links are only useful when the app isn't on localhost. */ function publicPayUrl(invoiceId) {
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appBaseUrl"])();
    if (/localhost|127\.0\.0\.1/.test(base)) return null;
    return `${base}/pay/${invoiceId}`;
}
async function sendDuesMail(opts) {
    const transport = transporter();
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mailCredentials"])();
    // First line carries the tag so replies are matched even if the subject is edited.
    const primary = opts.lines[0]?.invoice;
    const subject = primary ? `${invoiceEmailTag(primary.id)} ${opts.subject}` : opts.subject;
    if (!transport) return {
        sent: false,
        error: "Email not configured",
        subject
    };
    const rows = opts.lines.map(({ invoice, daysOverdue })=>{
        const status = daysOverdue > 0 ? `<span style="color:#b3402a">${daysOverdue}d overdue</span>` : daysOverdue === 0 ? "Due today" : `Due in ${-daysOverdue}d`;
        const link = publicPayUrl(invoice.id);
        return `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #dde7df">${esc(invoice.description || "Invoice")}<br/><span style="font-size:11px;color:#6b7f74">${invoiceEmailTag(invoice.id)}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid #dde7df;white-space:nowrap">${esc(invoice.dueDate)}<br/>${status}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #dde7df;text-align:right;white-space:nowrap"><strong>${esc((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatMoney"])(invoice.amount, invoice.currency))}</strong>${link ? `<br/><a href="${link}" style="font-size:11px">pay page</a>` : ""}</td>
      </tr>`;
    }).join("");
    const html = `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#14221c;line-height:1.55">
    ${opts.body.split(/\n{2,}/).map((p)=>`<p>${esc(p).replace(/\n/g, "<br/>")}</p>`).join("")}
    <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px;background:#f4f8f5;border-radius:10px">
      <thead><tr style="text-align:left;font-size:12px;color:#3d5248">
        <th style="padding:8px 10px">Invoice</th><th style="padding:8px 10px">Due</th><th style="padding:8px 10px;text-align:right">Amount</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${opts.qr ? `<p style="text-align:center;margin:22px 0 6px"><img src="cid:payment-qr" alt="Payment QR" width="240" style="border:1px solid #dde7df;border-radius:12px"/></p>
           <p style="text-align:center;font-size:12px;color:#3d5248;margin:0 0 18px">Scan to pay</p>` : ""}
    <p style="font-size:13px;color:#3d5248"><strong>After paying:</strong> reply to this email and attach a screenshot of the payment. We'll verify it and update your account.</p>
  </div>`;
    const text = [
        opts.body,
        "",
        ...opts.lines.map(({ invoice })=>`- ${invoice.description || "Invoice"} | due ${invoice.dueDate} | ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatMoney"])(invoice.amount, invoice.currency)} | ${invoiceEmailTag(invoice.id)}`),
        "",
        opts.qr ? "The payment QR code is attached." : "",
        "After paying, reply to this email with a screenshot of the payment."
    ].join("\n");
    try {
        await transport.sendMail({
            from: c.from,
            to: opts.to,
            replyTo: process.env.SMTP_REPLY_TO?.trim() || c.from,
            subject,
            text,
            html,
            attachments: opts.qr ? [
                {
                    filename: `payment-qr.${opts.qr.mimeType.includes("png") ? "png" : opts.qr.mimeType.includes("webp") ? "webp" : "jpg"}`,
                    content: opts.qr.buffer,
                    contentType: opts.qr.mimeType,
                    cid: "payment-qr"
                }
            ] : []
        });
        return {
            sent: true,
            subject
        };
    } catch (err) {
        console.error("Dues email failed:", err);
        return {
            sent: false,
            subject,
            error: err instanceof Error ? err.message : "Email failed"
        };
    }
}
async function sendAutoReply(opts) {
    const transport = transporter();
    if (!transport) return {
        sent: false,
        error: "Email not configured"
    };
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mailCredentials"])();
    try {
        await transport.sendMail({
            from: c.from,
            to: opts.to,
            subject: opts.subject.startsWith("Re:") ? opts.subject : `Re: ${opts.subject}`,
            text: opts.text,
            inReplyTo: opts.inReplyTo,
            references: opts.inReplyTo,
            headers: {
                "Auto-Submitted": "auto-replied",
                Precedence: "bulk"
            }
        });
        return {
            sent: true
        };
    } catch (err) {
        return {
            sent: false,
            error: err instanceof Error ? err.message : "Email failed"
        };
    }
}
async function sendPaymentReminderEmail(invoice, reminder) {
    const to = invoice.partyEmail?.trim();
    if (!to) return {
        sent: false,
        error: "No party email on invoice"
    };
    const transport = transporter();
    if (!transport) return {
        sent: false,
        error: "SMTP not configured"
    };
    const amount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatMoney"])(invoice.amount, invoice.currency);
    const tag = invoiceEmailTag(invoice.id);
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2d$credentials$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mailCredentials"])();
    const subject = reminder.kind === "overdue" ? `${tag} Overdue — ${amount} still unpaid` : reminder.kind === "due_today" ? `${tag} Payment due today — ${amount}` : `${tag} Payment reminder — ${amount} due ${invoice.dueDate}`;
    const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#14221c;line-height:1.5">
    <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#3f6b55">DueCollect</p>
    <h1 style="font-size:22px;margin:8px 0 16px">Payment reminder</h1>
    <p>${esc(reminder.message)}</p>
    <p style="margin:20px 0;padding:16px;background:#eef4ef;border-radius:12px">
      <strong>${esc(invoice.partyName)}</strong><br/>
      Amount: <strong>${esc(amount)}</strong><br/>
      Due: ${esc(invoice.dueDate)}<br/>
      ${invoice.description ? `Note: ${esc(invoice.description)}<br/>` : ""}
      Ref: ${tag}
    </p>
    <p style="font-size:13px;color:#3d5248">Payable reminder for your records.</p>
  </div>`;
    try {
        await transport.sendMail({
            from: c.from,
            to,
            subject,
            text: `${reminder.message}\n\nAmount: ${amount}\nDue: ${invoice.dueDate}\nRef: ${tag}`,
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/src/lib/local-ai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractJson",
    ()=>extractJson,
    "localAiHealth",
    ()=>localAiHealth,
    "localAiSettings",
    ()=>localAiSettings,
    "localChat",
    ()=>localChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
function localAiSettings() {
    return {
        baseUrl: (process.env.LOCAL_AI_BASE_URL || "http://localhost:8000/v1").replace(/\/$/, ""),
        model: process.env.LOCAL_AI_MODEL || "nvidia/Cosmos3-Nano",
        apiKey: process.env.LOCAL_AI_API_KEY || "local",
        timeoutMs: Number(process.env.LOCAL_AI_TIMEOUT_MS || 120_000)
    };
}
function client() {
    const s = localAiSettings();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: s.apiKey,
        baseURL: s.baseUrl,
        timeout: s.timeoutMs,
        maxRetries: 0
    });
}
async function localChat(opts) {
    const s = localAiSettings();
    const content = [];
    for (const img of opts.images ?? []){
        content.push({
            type: "image_url",
            image_url: {
                url: `data:${img.mimeType};base64,${img.base64}`
            }
        });
    }
    content.push({
        type: "text",
        text: opts.user
    });
    const res = await client().chat.completions.create({
        model: s.model,
        max_tokens: opts.maxTokens ?? 400,
        temperature: opts.temperature ?? 0.3,
        messages: [
            {
                role: "system",
                content: opts.system
            },
            {
                role: "user",
                content
            }
        ]
    });
    return res.choices[0]?.message?.content?.trim() ?? "";
}
function extractJson(raw) {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
        return JSON.parse(m[0]);
    } catch  {
        return null;
    }
}
async function localAiHealth() {
    const s = localAiSettings();
    try {
        const ctrl = new AbortController();
        const t = setTimeout(()=>ctrl.abort(), 3000);
        const res = await fetch(`${s.baseUrl}/models`, {
            signal: ctrl.signal,
            headers: {
                Authorization: `Bearer ${s.apiKey}`
            }
        });
        clearTimeout(t);
        return res.ok ? {
            reachable: true
        } : {
            reachable: false,
            error: `HTTP ${res.status}`
        };
    } catch (err) {
        return {
            reachable: false,
            error: err instanceof Error ? err.message : "unreachable"
        };
    }
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
"[project]/src/lib/qr-store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "MAX_QR_BYTES",
    ()=>MAX_QR_BYTES,
    "deleteAdminQr",
    ()=>deleteAdminQr,
    "getAdminQr",
    ()=>getAdminQr,
    "readAdminQrFile",
    ()=>readAdminQrFile,
    "saveAdminQr",
    ()=>saveAdminQr
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsqr$2f$dist$2f$jsQR$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsqr/dist/jsQR.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__ = __turbopack_context__.i("[externals]/sharp [external] (sharp, esm_import, [project]/node_modules/sharp)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/local-ai.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "uploads");
const META = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DIR, "payment-qr.json");
const EXT = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp"
};
const MAX_QR_BYTES = 5 * 1024 * 1024;
function parseUpi(payload) {
    if (!/^upi:\/\//i.test(payload)) return {
        upiId: null,
        payeeName: null
    };
    try {
        const q = new URL(payload.replace(/^upi:\/\//i, "https://x/")).searchParams;
        return {
            upiId: q.get("pa"),
            payeeName: q.get("pn")
        };
    } catch  {
        return {
            upiId: null,
            payeeName: null
        };
    }
}
async function decodeQr(buf) {
    // Try a few sizes — phone screenshots are often huge or have lots of margin.
    for (const width of [
        900,
        600,
        1400
    ]){
        const { data, info } = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(buf).rotate().flatten({
            background: "#ffffff"
        }).resize({
            width,
            withoutEnlargement: false
        }).ensureAlpha().raw().toBuffer({
            resolveWithObject: true
        });
        const hit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsqr$2f$dist$2f$jsQR$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(new Uint8ClampedArray(data), info.width, info.height, {
            inversionAttempts: "attemptBoth"
        });
        if (hit?.data) return hit.data;
    }
    return null;
}
/** Ask the local vision model what this QR is for (fallback + sanity summary). */ async function aiReadQr(img) {
    try {
        const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["localChat"])({
            system: 'You read payment QR code images. Reply ONLY with JSON: {"upiId":string|null,"payeeName":string|null,"summary":string}. Use null if the text is not visible. Do not guess.',
            user: "What account/payee does this payment QR belong to? Read any visible UPI ID or name printed on the image.",
            images: [
                img
            ],
            maxTokens: 200,
            temperature: 0
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$local$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractJson"])(raw);
    } catch (err) {
        console.error("Local AI could not read QR:", err);
        return null;
    }
}
async function saveAdminQr(buf, mimeType) {
    const ext = EXT[mimeType];
    if (!ext) throw new Error("QR must be a PNG, JPG or WebP image");
    if (buf.length > MAX_QR_BYTES) throw new Error("QR image is over 5 MB");
    // Make sure it is really an image before storing it.
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(buf).metadata();
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DIR, {
        recursive: true
    });
    for (const e of Object.values(EXT)){
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].rm(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DIR, `payment-qr.${e}`), {
            force: true
        });
    }
    const file = `payment-qr.${ext}`;
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DIR, file), buf);
    const payload = await decodeQr(buf).catch(()=>null);
    let { upiId, payeeName } = payload ? parseUpi(payload) : {
        upiId: null,
        payeeName: null
    };
    let readBy = payload ? "decoder" : "none";
    const ai = await aiReadQr({
        mimeType,
        base64: buf.toString("base64")
    });
    if (!upiId && ai?.upiId) {
        upiId = ai.upiId;
        readBy = "ai";
    }
    if (!payeeName && ai?.payeeName) payeeName = ai.payeeName;
    const info = {
        file,
        mimeType,
        uploadedAt: new Date().toISOString(),
        payload,
        upiId,
        payeeName,
        readBy,
        aiSummary: ai?.summary ?? null
    };
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(META, JSON.stringify(info, null, 2), "utf8");
    return info;
}
async function getAdminQr() {
    try {
        return JSON.parse(await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(META, "utf8"));
    } catch  {
        return null;
    }
}
async function readAdminQrFile() {
    const info = await getAdminQr();
    if (!info) return null;
    try {
        return {
            info,
            buffer: await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DIR, info.file))
        };
    } catch  {
        return null;
    }
}
async function deleteAdminQr() {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].rm(DIR, {
        recursive: true,
        force: true
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/reminders.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "computeStats",
    ()=>computeStats,
    "runReminderScan",
    ()=>runReminderScan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInCalendarDays.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfDay.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$collections$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/collections.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/status.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$collections$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$collections$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
function today() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])(new Date());
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
        const invoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshInvoiceStatus"])(raw);
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
        // Receivables: ONE AI-written email per customer covering all their dues,
        // with the admin QR attached. Payables: plain reminder to the address on file.
        if (invoice.partyEmail?.trim()) {
            if (invoice.direction === "receivable") {
                const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$collections$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendDuesEmail"])(invoice.partyEmail.trim());
                if (r.sent) {
                    emailsSent += 1;
                    reminder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateReminder"])(reminder.id, {
                        emailed: true,
                        emailTo: invoice.partyEmail.trim()
                    });
                } else if (r.error) {
                    emailErrors.push(`${invoice.partyName}: ${r.error}`);
                }
            } else {
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
;
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/status.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "refreshInvoiceStatus",
    ()=>refreshInvoiceStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInCalendarDays$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInCalendarDays.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfDay.js [app-route] (ecmascript)");
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0-awn8fv_lhrc._.js.map