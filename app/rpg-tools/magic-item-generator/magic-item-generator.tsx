"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const RARITIES = ["", "Common", "Uncommon", "Rare", "Very rare", "Legendary"];
const TYPES = [
  "",
  "Weapon",
  "Armor",
  "Wondrous item",
  "Potion",
  "Ring",
  "Wand / staff",
  "Trinket",
];
const THEMES = [
  "",
  "Fire",
  "Frost",
  "Shadow",
  "Nature",
  "Arcane",
  "Holy",
  "Necrotic",
  "Storm",
];
const SETTINGS = ["", "Fantasy", "Dark fantasy", "Sci-fi", "Steampunk"];

export function MagicItemGenerator() {
  const gen = useStreamGenerate("/api/generate-magic-item");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "magic-item-generator" });
    void gen.generate({
      rarity: data.get("rarity"),
      type: data.get("type"),
      theme: data.get("theme"),
      setting: data.get("setting"),
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
            <label htmlFor="rarity">Rarity</label>
            <select id="rarity" name="rarity" defaultValue="">
              {RARITIES.map((r) => (
                <option key={r} value={r}>
                  {r || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="type">Item type</label>
            <select id="type" name="type" defaultValue="">
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="theme">Theme / element</label>
            <select id="theme" name="theme" defaultValue="">
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
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
        </div>

        <div className="field">
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="A cursed item with a tempting upside; tie it to a fallen knight…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Enchanting…" : "Generate magic items"}
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
            5 magic items will appear here. Pick a rarity (or none) and hit{" "}
            <strong>Generate magic items</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            More items
          </button>
        }
        cta={
          <>
            Where did it come from? Build the{" "}
            <Link href="/rpg-tools/npc-generator">NPC who carries it →</Link>{" "}
            and save it to a campaign.
          </>
        }
      />
    </div>
  );
}
