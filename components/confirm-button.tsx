"use client";

// Inline two-step confirm for destructive actions — never uses the native
// confirm() dialog (which blocks and breaks automation/UX). First click arms;
// second click runs onConfirm.
import { useState } from "react";

export function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Confirm",
  className = "ghost",
}: {
  onConfirm: () => Promise<void> | void;
  label?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!armed) {
    return (
      <button
        className={className}
        type="button"
        onClick={() => setArmed(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <button
        className={className}
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await onConfirm();
          setBusy(false);
          setArmed(false);
        }}
      >
        {busy ? "…" : confirmLabel}
      </button>
      <button
        className="ghost"
        type="button"
        disabled={busy}
        onClick={() => setArmed(false)}
      >
        Cancel
      </button>
    </span>
  );
}
