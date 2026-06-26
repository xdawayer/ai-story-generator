"use client";

// Shared result panel for the streaming free tools. Owns the status line, error
// box, empty hint, and a Copy button; pages inject their own extra actions
// (e.g. Regenerate) and a funnel CTA. Renders model output as plain text only.
import type { ReactNode } from "react";
import type { StreamGenerator } from "@/lib/use-stream-generate";

export function OutputPanel({
  gen,
  emptyHint,
  extraActions,
  cta,
}: {
  gen: StreamGenerator;
  emptyHint: ReactNode;
  extraActions?: ReactNode;
  cta?: ReactNode;
}) {
  const { out, status, error, copyResult } = gen;

  return (
    <div className="panel" aria-live="polite">
      <p className="statusline">
        {status === "idle" && "Ready"}
        {status === "streaming" && "Generating…"}
        {status === "done" && "Done"}
        {status === "error" && "Error"}
        {status === "rate_limited" && "Rate limited"}
      </p>

      {error && <div className="errorbox">{error}</div>}

      {!error && !out && status !== "streaming" && (
        <p className="empty">{emptyHint}</p>
      )}

      {/* Plain text render — never innerHTML model output (XSS-safe). */}
      {out && <div className="out">{out}</div>}

      {out && status === "done" && (
        <div style={{ marginTop: 14 }}>
          <div className="actions">
            <button className="ghost" type="button" onClick={copyResult}>
              Copy
            </button>
            {extraActions}
          </div>
          {cta && (
            <p className="statusline" style={{ marginTop: 12 }}>
              {cta}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
