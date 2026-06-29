"use client";

// Sign-in / sign-up via email magic link or Google. Preserves an anonymous
// guest's data by UPGRADING the existing anon account (updateUser for email,
// linkIdentity for Google) instead of starting a fresh one.
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function callbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }

  async function sendMagicLink(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = user?.is_anonymous
      ? // Upgrade the guest account in place — keeps their saved data (same uid).
        await supabase.auth.updateUser(
          { email },
          { emailRedirectTo: callbackUrl() },
        )
      : await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: callbackUrl() },
        });

    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  async function withGoogle() {
    setBusy(true);
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = user?.is_anonymous
      ? await supabase.auth.linkIdentity({
          provider: "google",
          options: { redirectTo: callbackUrl() },
        })
      : await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: callbackUrl() },
        });

    if (error) {
      setBusy(false);
      setError(error.message);
    }
    // On success the browser is redirected to Google — no further UI needed.
  }

  if (sent) {
    return (
      <div className="panel">
        <h3 style={{ margin: "0 0 6px" }}>Check your inbox</h3>
        <p className="lead" style={{ margin: 0 }}>
          We sent a sign-in link to <strong>{email}</strong>. Open it on this
          device to finish.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <button
        className="ghost"
        type="button"
        onClick={withGoogle}
        disabled={busy}
        style={{ width: "100%" }}
      >
        Continue with Google
      </button>

      <p
        className="statusline"
        style={{ textAlign: "center", margin: "14px 0" }}
      >
        or
      </p>

      <form onSubmit={sendMagicLink}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            required
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="primary"
          type="submit"
          disabled={busy}
          style={{ width: "100%" }}
        >
          {busy ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {error && (
        <div className="errorbox" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
