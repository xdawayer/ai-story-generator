"use client";

// Client island for the backstory generator: streams a character backstory.
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
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Orc",
  "Half-Orc",
  "Tiefling",
  "Gnome",
  "Dragonborn",
];
const CLASSES = [
  "",
  "Fighter",
  "Wizard",
  "Rogue",
  "Cleric",
  "Ranger",
  "Bard",
  "Barbarian",
  "Paladin",
  "Warlock",
  "Druid",
  "Sorcerer",
  "Monk",
];
const KINDS = ["", "Player character", "Villain", "Supporting NPC"];
const ALIGNMENTS = [
  "",
  "Heroic",
  "Neutral / self-interested",
  "Villainous",
  "Morally grey",
];
const TONES = [
  "",
  "Grim",
  "Whimsical",
  "Mysterious",
  "Tragic",
  "Heroic",
  "Hopeful",
];

export function CharacterBackstoryGenerator() {
  const gen = useStreamGenerate("/api/generate-backstory");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "character-backstory-generator" });
    void gen.generate({
      race: data.get("race"),
      charClass: data.get("charClass"),
      kind: data.get("kind"),
      alignment: data.get("alignment"),
      tone: data.get("tone"),
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
            <label htmlFor="charClass">Class / archetype</label>
            <select id="charClass" name="charClass" defaultValue="">
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="kind">Character type</label>
            <select id="kind" name="kind" defaultValue="">
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="alignment">Alignment</label>
            <select id="alignment" name="alignment" defaultValue="">
              {ALIGNMENTS.map((a) => (
                <option key={a} value={a}>
                  {a || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="tone">Tone</label>
          <select id="tone" name="tone" defaultValue="">
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t || "Any"}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="detail">Optional details</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={400}
            placeholder="A name, a homeland, a rival, a wound that never healed…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Writing…" : "Generate backstory"}
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
            Your character&apos;s backstory will appear here. Pick a race and
            class (or none) and hit <strong>Generate backstory</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            Regenerate
          </button>
        }
        cta={
          <>
            Now give them a face and a voice —{" "}
            <Link href="/rpg-tools/npc-generator">build the NPC →</Link> and save
            it to a campaign.
          </>
        }
      />
    </div>
  );
}
