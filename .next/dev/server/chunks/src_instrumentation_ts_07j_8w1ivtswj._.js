module.exports = [
"[project]/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Runs once when the Next.js server starts. Checks the mailbox for customer
 * payment replies every INBOX_POLL_SECONDS (default 60, 0 = off).
 */ __turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const g = globalThis;
    if (g.__duecollectInbox) return; // already running (dev hot-reload)
    const seconds = Number(process.env.INBOX_POLL_SECONDS ?? 60);
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    const { receivingConfigured } = await __turbopack_context__.A("[project]/src/lib/mail-credentials.ts [instrumentation] (ecmascript, async loader)");
    if (!receivingConfigured()) return;
    const { pollInbox } = await __turbopack_context__.A("[project]/src/lib/inbox.ts [instrumentation] (ecmascript, async loader)");
    const tick = async ()=>{
        try {
            const r = await pollInbox();
            if (r.checked || r.errors.length) console.log("[duecollect inbox]", r);
        } catch (err) {
            console.error("[duecollect inbox] poll failed:", err);
        }
    };
    g.__duecollectInbox = setInterval(tick, seconds * 1000);
    void tick();
}
}),
];

//# sourceMappingURL=src_instrumentation_ts_07j_8w1ivtswj._.js.map