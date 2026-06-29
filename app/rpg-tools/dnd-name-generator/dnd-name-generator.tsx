"use client";

// Client island for the D&D name generator: streams a batch of fitting names.
// The hero, prose, FAQ + JSON-LD, and related links live in the server
// page.tsx; this file owns only the tool UI.
import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const RACES = [
  "",
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Orc",
  "Half-Orc",
  "Tiefling",
  "Gnome",
  "Dragonborn",
  "Goblin",
];
const STYLES = ["", "Masculine", "Feminine", "Neutral"];

export function DndNameGenerator() {
  const gen = useStreamGenerate("/api/generate-name");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "dnd-name-generator" });
    void gen.generate({
      race: data.get("race"),
      gender: data.get("gender"),
      style: data.get("style"),
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
            <label htmlFor="race">Race / species</label>
            <select id="race" name="race" defaultValue="">
              {RACES.map((r) => (
                <option key={r} value={r}>
                  {r || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="gender">Name style</label>
            <select id="gender" name="gender" defaultValue="">
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="style">Culture / vibe (optional)</label>
          <input
            id="style"
            name="style"
            maxLength={60}
            placeholder="Norse-inspired, elegant, harsh, desert nomad…"
          />
        </div>

        <div className="field">
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="Starts with V, two syllables, sounds noble…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Naming…" : "Generate names"}
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
            12 names will appear here. Pick a race and style (or none) and hit{" "}
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
            Found the one? Turn it into a full character —{" "}
            <Link href="/rpg-tools/npc-generator">build the NPC →</Link>
          </>
        }
      />
    </div>
  );
}
