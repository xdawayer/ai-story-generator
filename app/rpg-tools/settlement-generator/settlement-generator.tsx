"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";

const KINDS = ["", "Hamlet", "Village", "Town", "City"];
const SETTINGS = ["", "Fantasy", "Dark fantasy", "Sci-fi", "Steampunk", "Western"];
const VIBES = [
  "",
  "Prosperous",
  "Struggling",
  "Secretive",
  "Lawless",
  "Devout",
  "Haunted",
];

export function SettlementGenerator() {
  const gen = useStreamGenerate("/api/generate-settlement");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    void gen.generate({
      kind: data.get("kind"),
      setting: data.get("setting"),
      vibe: data.get("vibe"),
      detail: data.get("detail"),
    });
  }

  return (
    <div className="tool" style={{ gridTemplateColumns: "0.85fr 1.15fr" }}>
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
            <label htmlFor="kind">Type</label>
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
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="A river port that taxes magic; the mayor is hiding something…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Founding…" : "Generate settlement"}
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
            Your settlement — vibe, locations, people, and trouble — will appear
            here. Pick a type (or none) and hit{" "}
            <strong>Generate settlement</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            Regenerate
          </button>
        }
        cta={
          <>
            Name the inn with the{" "}
            <Link href="/rpg-tools/tavern-name-generator">
              Tavern Name Generator
            </Link>{" "}
            and staff it with an{" "}
            <Link href="/rpg-tools/npc-generator">NPC →</Link>
          </>
        }
      />
    </div>
  );
}
