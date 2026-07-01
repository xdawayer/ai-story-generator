"use client";

import { useEffect, useRef, useState } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { downloadText, firstHeading, slugFilename } from "@/lib/download";
import { trackEvent } from "@/lib/track";
import { StorySavePanel } from "./story-save-panel";
import { PrefillFromQuery } from "./prefill";

// Genre picker options. `value` is what the model receives (and what ?genre=
// prefill / the locked-genre landing pages match on — keep these stable); `label`
// is what the chip shows. Casing is unified for display ("Sci-Fi", "Fairy Tale")
// so the head-term page and the genre landing pages read the same.
export const GENRE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Sci-fi", label: "Sci-Fi" },
  { value: "Mystery", label: "Mystery" },
  { value: "Horror", label: "Horror" },
  { value: "Adventure", label: "Adventure" },
  { value: "Romance", label: "Romance" },
  { value: "Fairy tale", label: "Fairy Tale" },
  { value: "Cyberpunk", label: "Cyberpunk" },
  { value: "Western", label: "Western" },
];

// The raw value set, exported so the query-prefill island can validate ?genre
// against the exact options before writing it into the form (ignore unknowns).
export const GENRES = GENRE_OPTIONS.map((g) => g.value);
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
// Ordered shortest → longest so the choice reads intuitively. Medium/Long are
// served by expanded prompt instructions (see LENGTH_GUIDE) within the guest
// token cap — they don't require a backend length tier.
export const LENGTHS = ["Flash", "Short", "Medium", "Long", "Scene"];
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

// One-click starting ideas shown under the prompt box. The chip shows a short
// label; clicking drops a fuller, evocative premise into the idea field so the
// user can generate straight away (or tweak first). Labels match the product
// spec; the seeded idea is a richer sentence for better output.
const IDEA_SEEDS: readonly { label: string; idea: string }[] = [
  {
    label: "Haunted castle",
    idea: "A haunted castle where every mirror reflects a different century — and something in one of them is awake.",
  },
  {
    label: "Space explorer",
    idea: "A lone deep-space explorer wakes from cryosleep to find the ship's log already written in her own handwriting, dated years from now.",
  },
  {
    label: "Lost kingdom",
    idea: "A cartographer discovers a lost kingdom that appears only on maps drawn by the dying.",
  },
  {
    label: "Cyberpunk detective",
    idea: "A cyberpunk detective is hired to solve a murder the city's AI has already ruled a suicide.",
  },
  {
    label: "Bedtime dragon",
    idea: "A very small dragon who is afraid of the dark asks a child to tuck him in — a gentle bedtime story.",
  },
  {
    label: "D&D campaign opening",
    idea: "A D&D campaign opening: the party meets in a tavern on the night every bell in the city starts to ring on its own.",
  },
];

// `lockedGenre` powers the per-genre SEO landing pages: the genre is fixed (and
// the picker hidden) but everything else (idea, tone, length, continue, save)
// works identically.
export function StoryGenerator({ lockedGenre }: { lockedGenre?: string }) {
  const gen = useStreamGenerate("/api/generate-story");
  const formRef = useRef<HTMLFormElement>(null);
  // Genre is a chip picker (not a native <select>), so it lives in React state.
  const [genre, setGenre] = useState("");

  // One label per surface so the funnel can tell the head-term page apart from
  // each genre landing page.
  const toolLabel = lockedGenre ? `genre:${lockedGenre}` : "ai-story-generator";

  // Genre chips are React-controlled, so prefill the ?genre param here (the other
  // uncontrolled DOM fields are still handled by PrefillFromQuery). Read the live
  // URL rather than useSearchParams() so statically prerendered routes stay static.
  useEffect(() => {
    if (lockedGenre) return;
    const g = new URLSearchParams(window.location.search).get("genre");
    if (g && GENRES.includes(g)) setGenre(g);
  }, [lockedGenre]);

  function formValues() {
    const f = formRef.current;
    const data = f ? new FormData(f) : null;
    return {
      idea: data?.get("idea") ?? "",
      genre: lockedGenre ?? genre,
      tone: data?.get("tone") ?? "",
      length: data?.get("length") ?? "Short",
      pov: data?.get("pov") ?? "",
      characters: data?.get("characters") ?? "",
      setting: data?.get("setting") ?? "",
      endingStyle: data?.get("endingStyle") ?? "",
      useCase: data?.get("useCase") ?? "",
    };
  }

  // Drop an example idea into the prompt box (uncontrolled <textarea id="idea">);
  // FormData reads the live DOM value on submit, so this is enough — no auto-submit.
  function fillIdea(text: string) {
    const el = document.getElementById("idea") as HTMLTextAreaElement | null;
    if (!el) return;
    trackEvent("example_prompt_click", {
      tool: toolLabel,
      prompt: text.slice(0, 120),
    });
    el.value = text;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  }

  // Primary button reflects the generation lifecycle: idle → generating (disabled)
  // → another / try again.
  function submitLabel() {
    if (gen.busy) return "Generating…";
    if (gen.status === "done") return "Generate another story";
    if (gen.status === "error" || gen.status === "rate_limited")
      return "Try again";
    return "Generate story";
  }

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
      <PrefillFromQuery />
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
            placeholder="Example: A lonely lighthouse keeper discovers that the fog is carrying messages from the future."
          />
          <div className="chip-row" aria-label="Example ideas">
            {IDEA_SEEDS.map((s) => (
              <button
                key={s.label}
                type="button"
                className="chip"
                onClick={() => fillIdea(s.idea)}
                aria-label={`Use example idea: ${s.label}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {!lockedGenre && (
          <div className="field">
            <label id="genre-label">Genre</label>
            <div
              className="chip-row"
              role="group"
              aria-labelledby="genre-label"
            >
              {GENRE_OPTIONS.map((g) => {
                const selected = genre === g.value;
                return (
                  <button
                    key={g.value || "any"}
                    type="button"
                    className={selected ? "chip is-selected" : "chip"}
                    aria-pressed={selected}
                    onClick={() => setGenre(g.value)}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="row2">
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
            <label htmlFor="length">Length</label>
            <select id="length" name="length" defaultValue="Short">
              {LENGTHS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <details className="more-fields">
          <summary>Advanced options</summary>
          <div className="row2" style={{ marginTop: 12 }}>
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
          </div>
          <div className="field">
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
            {submitLabel()}
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
