"use client";

import { FormEvent, useEffect, useState } from "react";

function safeNext() {
  const next = new URLSearchParams(window.location.search).get("next") || "/";
  // only allow same-site paths
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Already signed in? Skip the login screen.
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) window.location.replace(safeNext());
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not sign in");
        setBusy(false);
        return;
      }
      window.location.replace(safeNext());
    } catch {
      setError("Could not reach the server");
      setBusy(false);
    }
  }

  return (
    <main className="app-shell mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="animate-fade-up panel rounded-2xl p-7">
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--teal)] text-base font-bold text-[#f4fbf8]"
          >
            D
          </span>
          <div>
            <p className="font-display text-lg leading-none font-semibold">
              DueCollect
            </p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">
              Admin sign in
            </p>
          </div>
        </div>

        <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 mb-5 text-sm text-[var(--ink-soft)]">
          Sign in to manage invoices, payment QR codes and customer emails.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm font-medium">
            Username
            <input
              className="input mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <div className="relative mt-1">
              <input
                className="input !pr-16"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[var(--teal)]"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="text-sm text-[var(--coral)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={busy || !username || !password}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
      <p className="mt-5 text-center text-xs text-[var(--ink-soft)]">
        Customer paying an invoice? Use the link from your email.
      </p>
    </main>
  );
}
