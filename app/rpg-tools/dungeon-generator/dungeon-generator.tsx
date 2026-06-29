"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";

const SETTINGS = ["", "Fantasy", "Dark fantasy", "Sci-fi", "Horror", "Steampunk"];
const THEMES = [
  "",
  "Ancient tomb",
  "Temple",
  "Cave system",
  "Monster lair",
  "Ruins",
  "Prison / vault",
  "Sewers",
];
const SIZES = ["", "Small (~4 rooms)", "Medium (~6 rooms)", "Large (~8 rooms)"];
const LEVELS = ["", "Low level", "Mid level", "High level"];

export function DungeonGenerator() {
  const gen = useStreamGenerate("/api/generate-dungeon");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    void gen.generate({
      setting: data.get("setting"),
      theme: data.get("theme"),
      size: data.get("size"),
      level: data.get("level"),
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
            <label htmlFor="theme">Dungeon type</label>
            <select id="theme" name="theme" defaultValue="">
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="size">Size</label>
            <select id="size" name="size" defaultValue="">
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s || "Any"}
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
            placeholder="A flooded crypt; the boss is a grieving lich, not just evil…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Excavating…" : "Generate dungeon"}
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
            Your dungeon — premise, rooms, boss, treasure, and a hook — will
            appear here. Pick a type (or none) and hit{" "}
            <strong>Generate dungeon</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            Regenerate
          </button>
        }
        cta={
          <>
            Stock the vault with a{" "}
            <Link href="/rpg-tools/loot-generator">treasure hoard</Link> and a{" "}
            <Link href="/rpg-tools/random-encounter-generator">
              random encounter →
            </Link>
          </>
        }
      />
    </div>
  );
}
