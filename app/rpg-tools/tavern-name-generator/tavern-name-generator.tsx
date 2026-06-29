"use client";

// Client island for the tavern name generator: streams a batch of tavern/inn
// names with hooks. The hero, prose, FAQ + JSON-LD, and related links live in
// the server page.tsx; this file owns only the tool UI.
import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const KINDS = ["", "Tavern", "Inn", "Alehouse", "Teahouse", "Gambling den"];
const VIBES = [
  "",
  "Cozy",
  "Seedy",
  "Mysterious",
  "Upscale",
  "Rowdy",
  "Haunted",
];

export function TavernNameGenerator() {
  const gen = useStreamGenerate("/api/generate-tavern");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "tavern-name-generator" });
    void gen.generate({
      kind: data.get("kind"),
      vibe: data.get("vibe"),
      region: data.get("region"),
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
            <label htmlFor="kind">Establishment</label>
            <select id="kind" name="kind" defaultValue="">
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="vibe">Vibe</label>
            <select id="vibe" name="vibe" defaultValue="">
              {VIBES.map((v) => (
                <option key={v} value={v}>
                  {v || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="region">Setting / region (optional)</label>
          <input
            id="region"
            name="region"
            maxLength={60}
            placeholder="Coastal port, frozen north, desert caravan road…"
          />
        </div>

        <div className="field">
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="Run by a retired adventurer, secretly a smugglers' front…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Pouring…" : "Generate names"}
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
            12 tavern names will appear here. Pick a vibe (or none) and hit{" "}
            <strong>Generate names</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            More names
          </button>
        }
        cta={
          <>
            Now staff the bar —{" "}
            <Link href="/rpg-tools/npc-generator">
              build the tavern keeper NPC →
            </Link>{" "}
            and save the whole place to a campaign.
          </>
        }
      />
    </div>
  );
}
