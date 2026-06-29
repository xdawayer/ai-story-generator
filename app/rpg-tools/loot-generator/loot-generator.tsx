"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const TIERS = [
  "",
  "Pocket change",
  "Standard haul",
  "Big hoard",
  "Legendary trove",
];
const SETTINGS = [
  "",
  "Fantasy",
  "Dark fantasy",
  "Sci-fi",
  "Steampunk",
  "Western",
];
const THEMES = [
  "",
  "Pirate",
  "Undead crypt",
  "Arcane",
  "Noble / royal",
  "Bandit",
  "Dragon",
  "Cult",
];
const LEVELS = ["", "Low level", "Mid level", "High level"];

export function LootGenerator() {
  const gen = useStreamGenerate("/api/generate-loot");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "loot-generator" });
    void gen.generate({
      tier: data.get("tier"),
      setting: data.get("setting"),
      theme: data.get("theme"),
      level: data.get("level"),
      detail: data.get("detail"),
    });
  }

  return (
    <div className="tool">
      <form
        className="panel"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <div className="row2">
          <div className="field">
            <label htmlFor="tier">Tier</label>
            <select id="tier" name="tier" defaultValue="">
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="theme">Theme / owner</label>
            <select id="theme" name="theme" defaultValue="">
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="setting">Setting</label>
            <select id="setting" name="setting" defaultValue="">
              {SETTINGS.map((s) => (
                <option key={s} value={s}>
                  {s || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="level">Party level</label>
            <select id="level" name="level" defaultValue="">
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="Found in a sunken ship; include a cursed coin with a catch…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Tallying…" : "Generate loot"}
          </button>
          {gen.busy && (
            <button className="ghost" type="button" onClick={gen.stop}>
              Stop
            </button>
          )}
        </div>
      </form>

      <OutputPanel
        gen={gen}
        emptyHint={
          <>
            A treasure hoard will appear here. Pick a tier (or none) and hit{" "}
            <strong>Generate loot</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            Regenerate
          </button>
        }
        cta={
          <>
            Want a signature reward? Roll a{" "}
            <Link href="/rpg-tools/magic-item-generator">magic item →</Link>
          </>
        }
      />
    </div>
  );
}
