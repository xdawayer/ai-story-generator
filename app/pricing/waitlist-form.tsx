"use client";

import { useState } from "react";
import { joinWaitlistAction } from "@/app/actions";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError("");
    const res = await joinWaitlistAction(email);
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? "Could not join.");
  }

  if (done) {
    return (
      <p className="statusline" style={{ margin: 0 }}>
        You&apos;re on the list — we&apos;ll be in touch. 🎲
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <input
        type="email"
        required
        value={email}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
        style={{ flex: "1 1 160px" }}
      />
      <button className="primary" type="submit" disabled={busy}>
        {busy ? "…" : "Join waitlist"}
      </button>
      {error && (
        <div className="errorbox" style={{ width: "100%" }}>
          {error}
        </div>
      )}
    </form>
  );
}
