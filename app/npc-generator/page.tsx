"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Status = "idle" | "streaming" | "done" | "error" | "rate_limited";

const GENRES = ["", "Human", "Elf", "Dwarf", "Halfling", "Orc", "Tiefling", "Goblin", "Dragonborn"];
const ROLES = ["", "Tavern keeper", "Merchant", "Guard captain", "Cult leader", "Wandering sage", "Thief", "Noble", "Blacksmith"];
const ALIGNMENTS = ["", "Heroic", "Neutral / self-interested", "Villainous", "Morally grey"];
const TONES = ["", "Grim", "Whimsical", "Mysterious", "Comic", "Tragic", "Heroic"];

export default function NpcGenerator() {
  const [race, setRace] = useState("");
  const [role, setRole] = useState("");
  const [alignment, setAlignment] = useState("");
  const [tone, setTone] = useState("");
  const [detail, setDetail] = useState("");

  const [out, setOut] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const busy = status === "streaming";

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setOut("");
    setError("");
    setStatus("streaming");

    try {
      const res = await fetch("/api/generate-npc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ race, role, alignment, tone, detail }),
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

  return (
    <main>
      <section className="hero wrap">
        <div className="eyebrow">
          <span className="dot" /> Free NPC Generator · no login
        </div>
        <h1>AI NPC Generator</h1>
        <p className="lead">
          Describe the role and tone — get a table-ready NPC with appearance, personality, a
          performable voice, a plot hook, and a system-agnostic stat seed. Works for D&amp;D 5e,
          Pathfinder, and OSR.
        </p>

        <div className="tool">
          <form className="panel" onSubmit={generate}>
            <div className="row2">
              <div className="field">
                <label htmlFor="race">Race / species</label>
                <select id="race" value={race} onChange={(e) => setRace(e.target.value)}>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g || "Any"}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r || "Any"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="alignment">Alignment</label>
                <select id="alignment" value={alignment} onChange={(e) => setAlignment(e.target.value)}>
                  {ALIGNMENTS.map((a) => (
                    <option key={a} value={a}>{a || "Any"}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="tone">Tone</label>
                <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t || "Any"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="detail">Optional details</label>
              <textarea
                id="detail"
                value={detail}
                maxLength={400}
                placeholder="A name, a quirk, a secret, a connection to the party…"
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>

            <div className="actions">
              <button className="primary" type="submit" disabled={busy}>
                {busy ? "Generating…" : "Generate NPC"}
              </button>
              {busy && (
                <button className="ghost" type="button" onClick={stop}>
                  Stop
                </button>
              )}
            </div>
          </form>

          <div className="panel" aria-live="polite">
            <p className="statusline">
              {status === "idle" && "Ready"}
              {status === "streaming" && "Generating your NPC…"}
              {status === "done" && "Done"}
              {status === "error" && "Error"}
              {status === "rate_limited" && "Rate limited"}
            </p>

            {error && <div className="errorbox">{error}</div>}

            {!error && !out && status !== "streaming" && (
              <p className="empty">
                Your NPC will appear here. Pick a few options (or none) and hit{" "}
                <strong>Generate NPC</strong>.
              </p>
            )}

            {/* Plain text render — never innerHTML model output (XSS-safe). */}
            {out && <div className="out">{out}</div>}

            {out && status === "done" && (
              <div className="actions" style={{ marginTop: 14 }}>
                <button className="ghost" type="button" onClick={copyResult}>
                  Copy
                </button>
                <button className="ghost" type="button" onClick={generate as unknown as () => void}>
                  Regenerate
                </button>
                <button
                  className="ghost"
                  type="button"
                  title="Accounts are coming — campaigns will persist your NPCs, factions, and plot threads."
                  disabled
                >
                  Save to campaign (soon)
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/">← All Game Master tools</Link>
        </p>
      </section>

      <footer>
        <div className="wrap">
          Free, no login. Saving NPCs to a persistent campaign is the next step.
        </div>
      </footer>
    </main>
  );
}
