"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";

const GENRES = [
  "",
  "Fantasy",
  "Sci-fi",
  "Horror",
  "Mystery",
  "Adventure",
  "Romance",
  "Fairy tale",
  "Cyberpunk",
  "Western",
];
const TONES = [
  "",
  "Whimsical",
  "Dark",
  "Heroic",
  "Melancholic",
  "Comic",
  "Suspenseful",
  "Hopeful",
];
const LENGTHS = ["Short", "Flash", "Scene"];

export function StoryGenerator() {
  const gen = useStreamGenerate("/api/generate-story");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    void gen.generate({
      idea: data.get("idea"),
      genre: data.get("genre"),
      tone: data.get("tone"),
      length: data.get("length"),
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
        <div className="field">
          <label htmlFor="idea">Your idea (optional)</label>
          <textarea
            id="idea"
            name="idea"
            maxLength={600}
            placeholder="A lighthouse keeper who collects shipwrecked memories…"
          />
        </div>

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

        <div className="field">
          <label htmlFor="length">Length</label>
          <select id="length" name="length" defaultValue="Short">
            {LENGTHS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Writing…" : "Generate story"}
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
            Your story will appear here. Add an idea (or leave it blank) and hit{" "}
            <strong>Generate story</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            Regenerate
          </button>
        }
        cta={
          <>
            Love a character in here? Turn the story into a campaign —{" "}
            <Link href="/npc-generator">build an NPC from it →</Link> and save it
            to a world your tools remember.
          </>
        }
      />
    </div>
  );
}
