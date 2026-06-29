"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const SETTINGS = [
  "",
  "Fantasy",
  "Sci-fi",
  "Horror",
  "Modern / urban",
  "Cyberpunk",
  "Western",
];
const ENVIRONMENTS = [
  "",
  "Forest",
  "Dungeon",
  "City",
  "Road / wilderness",
  "Coast / sea",
  "Mountains",
  "Underground",
  "Desert",
  "Swamp",
];
const KINDS = ["", "Combat", "Social", "Environmental", "Mixed"];
const LEVELS = ["", "Low level", "Mid level", "High level"];

export function RandomEncounterGenerator() {
  const gen = useStreamGenerate("/api/generate-encounter");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "random-encounter-generator" });
    void gen.generate({
      setting: data.get("setting"),
      environment: data.get("environment"),
      kind: data.get("kind"),
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
            <label htmlFor="environment">Environment</label>
            <select id="environment" name="environment" defaultValue="">
              {ENVIRONMENTS.map((e) => (
                <option key={e} value={e}>
                  {e || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="kind">Encounter type</label>
            <select id="kind" name="kind" defaultValue="">
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k || "Any"}
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
            placeholder="The party is being hunted; keep it tense and avoid a straight fight…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Rolling…" : "Generate encounters"}
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
            6 encounters will appear here. Pick a setting (or none) and hit{" "}
            <strong>Generate encounters</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            More encounters
          </button>
        }
        cta={
          <>
            Build one out — grab a{" "}
            <Link href="/rpg-tools/quest-hook-generator">quest hook</Link> or
            staff it with an <Link href="/rpg-tools/npc-generator">NPC →</Link>
          </>
        }
      />
    </div>
  );
}
