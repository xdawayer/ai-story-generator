"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";

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

export default function TavernNameGenerator() {
  const gen = useStreamGenerate("/api/generate-tavern");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    void gen.generate({
      kind: data.get("kind"),
      vibe: data.get("vibe"),
      region: data.get("region"),
      detail: data.get("detail"),
    });
  }

  return (
    <main>
      <section className="hero wrap">
        <div className="eyebrow">
          <span className="dot" /> Free Tavern Name Generator · no login
        </div>
        <h1>Tavern &amp; Inn Name Generator</h1>
        <p className="lead">
          Drop a memorable watering hole into your session — 12 tavern and inn
          names, each with a one-line hook on who runs it and what makes it
          worth a scene. Built for D&amp;D, Pathfinder, and any fantasy world.
        </p>

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
                Now staff the bar — <Link href="/npc-generator">build the
                tavern keeper NPC →</Link> and save the whole place to a
                campaign.
              </>
            }
          />
        </div>

        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/">← All Game Master tools</Link>
        </p>
      </section>

      <footer>
        <div className="wrap">
          Free, no login. Name the place, staff it with NPCs, save it to a
          persistent campaign.
        </div>
      </footer>
    </main>
  );
}
