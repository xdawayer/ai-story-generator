"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const GENRES = [
  "",
  "Fantasy",
  "Sci-fi",
  "Horror",
  "Mystery",
  "Romance",
  "Adventure",
  "Literary",
];
const TONES = [
  "",
  "Whimsical",
  "Dark",
  "Hopeful",
  "Suspenseful",
  "Bittersweet",
];
const AUDIENCES = ["", "Kids", "Teens", "Adults"];
const KINDS = [
  "",
  "What-if",
  "Character-driven",
  "First line",
  "Setting",
  "Dialogue",
];

export function PromptsGenerator() {
  const gen = useStreamGenerate("/api/generate-prompts");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "story-prompts" });
    void gen.generate({
      genre: data.get("genre"),
      tone: data.get("tone"),
      audience: data.get("audience"),
      kind: data.get("kind"),
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
            <label htmlFor="genre">Genre</label>
            <select id="genre" name="genre" defaultValue="">
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g || "Any"}
                </option>
              ))}
            </select>
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
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="audience">Audience</label>
            <select id="audience" name="audience" defaultValue="">
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {a || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="kind">Prompt style</label>
            <select id="kind" name="kind" defaultValue="">
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="detail">Theme or topic (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="Grief, second chances, a city that forgets its dead…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Dreaming up…" : "Generate prompts"}
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
            10 story prompts will appear here. Pick a genre (or none) and hit{" "}
            <strong>Generate prompts</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            More prompts
          </button>
        }
        cta={
          <>
            Found one you love? Turn it into a full story with the{" "}
            <Link href="/">AI Story Generator →</Link>
          </>
        }
      />
    </div>
  );
}
