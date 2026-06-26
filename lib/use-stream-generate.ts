"use client";

// Shared client hook for the streaming free tools (NPC, backstory, names, taverns).
// Encapsulates the fetch -> reader -> abort lifecycle so each tool page stays thin.
// Render the result as plain text (never innerHTML the model output) — XSS-safe.
import { useRef, useState } from "react";

export type GenStatus = "idle" | "streaming" | "done" | "error" | "rate_limited";

export interface StreamGenerator {
  out: string;
  status: GenStatus;
  error: string;
  busy: boolean;
  generate: (body: Record<string, unknown>) => Promise<void>;
  stop: () => void;
  copyResult: () => Promise<void>;
}

export function useStreamGenerate(endpoint: string): StreamGenerator {
  const [out, setOut] = useState("");
  const [status, setStatus] = useState<GenStatus>("idle");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function generate(body: Record<string, unknown>) {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setOut("");
    setError("");
    setStatus("streaming");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });

      if (res.status === 429) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Free limit reached — try again in a minute.");
        setStatus("rate_limited");
        return;
      }
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `Generation failed (${res.status}).`);
        setStatus("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOut(acc);
      }
      setStatus("done");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Network error — please retry.");
      setStatus("error");
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStatus(out ? "done" : "idle");
  }

  async function copyResult() {
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return { out, status, error, busy: status === "streaming", generate, stop, copyResult };
}
