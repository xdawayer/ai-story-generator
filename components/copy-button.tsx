"use client";

// Copy-to-clipboard button with its own transient "Copied" feedback. Shared by
// the campaign NPC and story cards. Falls back silently if the Clipboard API is
// unavailable (e.g. non-secure context).
import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
  className = "ghost",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — nothing actionable to show the user.
    }
  }

  return (
    <button className={className} type="button" onClick={copy}>
      {copied ? "Copied" : label}
    </button>
  );
}
