/**
 * Runs once when the Next.js server starts. Checks the mailbox for customer
 * payment replies every INBOX_POLL_SECONDS (default 60, 0 = off).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const g = globalThis as { __remitraInbox?: NodeJS.Timeout };
  if (g.__remitraInbox) return; // already running (dev hot-reload)

  const seconds = Number(process.env.INBOX_POLL_SECONDS ?? 60);
  if (!Number.isFinite(seconds) || seconds <= 0) return;

  const { receivingConfigured } = await import("@/lib/mail-credentials");
  if (!receivingConfigured()) return;

  const { pollInbox } = await import("@/lib/inbox");
  const tick = async () => {
    try {
      const r = await pollInbox();
      if (r.checked || r.errors.length) console.log("[remitra inbox]", r);
    } catch (err) {
      console.error("[remitra inbox] poll failed:", err);
    }
  };
  g.__remitraInbox = setInterval(tick, seconds * 1000);
  void tick();
}
