"use client";

import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { downloadText, firstHeading, slugFilename } from "@/lib/download";
import { trackEvent } from "@/lib/track";
import { StorySavePanel } from "./story-save-panel";
import { PrefillFromQuery } from "./prefill";

// Exported so the query-prefill island can validate ?genre/?tone/etc. against the
// exact option sets before writing them into the form (ignore anything unknown).
export const GENRES = [
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
export const TONES = [
  "",
  "Whimsical",
  "Dark",
  "Heroic",
  "Melancholic",
  "Comic",
  "Suspenseful",
  "Hopeful",
];
export const LENGTHS = ["Short", "Flash", "Scene"];
export const POVS = [
  "",
  "First person",
  "Third person limited",
  "Third person omniscient",
];
export const ENDINGS = [
  "",
  "Twist",
  "Happy",
  "Bittersweet",
  "Cliffhanger",
  "Tragic",
  "Open-ended",
];
// What the reader will use the output for; sent to the model to shape directly
// usable output, and a prefill target (?useCase) from the homepage Quick Start.
// General writing use cases lead; the tabletop ones stay (the homepage Quick
// Start and its ?useCase prefill still depend on these exact values).
export const USE_CASES = [
  "",
  "Short story",
  "Creative writing",
  "Bedtime story",
  "Scene starter",
  "Worldbuilding",
  "D&D session",
  "Campaign opening",
  "NPC origin",
  "Quest hook",
];

// `lockedGenre` powers the per-genre SEO landing pages: the genre is fixed (and
// the selector hidden) but everything else (idea, tone, length, continue, save)
// works identically.
export function StoryGenerator({ lockedGenre }: { lockedGenre?: string }) {
  const gen = useStreamGenerate("/api/generate-story");
  const formRef = useRef<HTMLFormElement>(null);

  function formValues() {
    const f = formRef.current;
    const data = f ? new FormData(f) : null;
    return {
      idea: data?.get("idea") ?? "",
      genre: lockedGenre ?? data?.get("genre") ?? "",
      tone: data?.get("tone") ?? "",
      length: data?.get("length") ?? "Short",
      pov: data?.get("pov") ?? "",
      characters: data?.get("characters") ?? "",
      setting: data?.get("setting") ?? "",
      endingStyle: data?.get("endingStyle") ?? "",
      useCase: data?.get("useCase") ?? "",
    };
  }

  // One label per surface so the funnel can tell the head-term page apart from
  // each genre landing page.
  const toolLabel = lockedGenre ? `genre:${lockedGenre}` : "ai-story-generator";

  function run() {
    trackEvent("generate", { tool: toolLabel });
    void gen.generate(formValues());
  }

  function continueStory() {
    const v = formValues();
    trackEvent("continue", { tool: toolLabel });
    // Reuse the idea field as optional "where to take it next"; keep genre/tone.
    void gen.generate(
      { idea: v.idea, genre: v.genre, tone: v.tone, continueFrom: gen.out },
      { append: true },
    );
  }

  function downloadStory() {
    if (!gen.out) return;
    trackEvent("download", { tool: toolLabel });
    downloadText(slugFilename(firstHeading(gen.out)), gen.out);
  }

  return (
    <div className="tool">
      <PrefillFromQuery lockedGenre={lockedGenre} />
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
          {!lockedGenre && (
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
          )}
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
            <label htmlFor="length">Length</label>
            <select id="length" name="length" defaultValue="Short">
              {LENGTHS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pov">Point of view</label>
            <select id="pov" name="pov" defaultValue="">
              {POVS.map((p) => (
                <option key={p} value={p}>
                  {p || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="useCase">Use case</label>
          <select id="useCase" name="useCase" defaultValue="">
            {USE_CASES.map((u) => (
              <option key={u} value={u}>
                {u || "Any"}
              </option>
            ))}
          </select>
        </div>

        <details className="more-fields">
          <summary>Optional details</summary>
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="characters">Characters (optional)</label>
            <input
              id="characters"
              name="characters"
              maxLength={200}
              placeholder="Mara, a retired smuggler; her estranged brother, a customs officer"
            />
          </div>
          <div className="field">
            <label htmlFor="setting">Setting (optional)</label>
            <input
              id="setting"
              name="setting"
              maxLength={200}
              placeholder="A flooded city built on the bones of a giant, mid-monsoon"
            />
          </div>
          <div className="field">
            <label htmlFor="endingStyle">Ending style (optional)</label>
            <select id="endingStyle" name="endingStyle" defaultValue="">
              {ENDINGS.map((e) => (
                <option key={e} value={e}>
                  {e || "Any"}
                </option>
              ))}
            </select>
          </div>
        </details>

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
          <>
            <button className="ghost" type="button" onClick={continueStory}>
              Continue
            </button>
            <button className="ghost" type="button" onClick={run}>
              Regenerate
            </button>
            <button className="ghost" type="button" onClick={downloadStory}>
              Download .md
            </button>
          </>
        }
      />

      {gen.status === "done" && gen.out && (
        <StorySavePanel
          story={gen.out}
          inputs={{
            idea: String(formValues().idea),
            genre: String(formValues().genre),
            tone: String(formValues().tone),
            length: String(formValues().length),
          }}
        />
      )}
    </div>
  );
}
