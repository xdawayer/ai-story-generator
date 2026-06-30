"use client";

// Hero "Quick Start" card. Never calls an AI API and never auto-generates. The
// homepage now hosts the live StoryGenerator inline (id="generator"), so on submit
// this writes its values straight into that generator's fields and scrolls it into
// view — rather than navigating to a separate page. The generator's inputs are
// uncontrolled DOM fields, so we set value + dispatch input/change, exactly like
// the query-prefill island. GENRES/TONES/USE_CASES come from the generator so the
// option values always match what it accepts. Empty input is fine.
import { useState } from "react";
import {
  GENRES,
  TONES,
  USE_CASES,
} from "@/app/ai-story-generator/story-generator";
import { QUICK_START_CHIPS } from "@/lib/home-data";
import { trackEvent } from "@/lib/track";

const MAX_IDEA = 600;
const GENERATOR_ANCHOR_ID = "generator";

// Mirror of the query-prefill island's setter: the inline generator's inputs are
// uncontrolled DOM fields, so set value then dispatch input/change.
function setGeneratorField(id: string, value: string) {
  const el = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export function HomeQuickStart() {
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [useCase, setUseCase] = useState("");

  function openGenerator() {
    const trimmed = idea.trim().slice(0, MAX_IDEA);

    // Push the Quick Start values into the inline generator, then reveal it.
    setGeneratorField("idea", trimmed);
    setGeneratorField("genre", genre);
    setGeneratorField("tone", tone);
    setGeneratorField("useCase", useCase);

    trackEvent("home_quick_start_submit", {
      has_idea: trimmed.length > 0,
      genre: genre || "any",
      tone: tone || "any",
      use_case: useCase || "any",
    });

    document
      .getElementById(GENERATOR_ANCHOR_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fillFromChip(text: string) {
    setIdea(text);
    trackEvent("home_prompt_chip_click", { chip: text });
  }

  return (
    <div className="panel" style={{ marginTop: 24, maxWidth: 560 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          openGenerator();
        }}
      >
        <div className="field">
          <label htmlFor="quick-start-idea">Start with a rough idea</label>
          <input
            id="quick-start-idea"
            name="idea"
            value={idea}
            maxLength={MAX_IDEA}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: A cursed tavern appears only during eclipses."
          />
        </div>

        <div className="row2">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="quick-start-genre">Genre</label>
            <select
              id="quick-start-genre"
              name="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="quick-start-tone">Tone</label>
            <select
              id="quick-start-tone"
              name="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field" style={{ marginTop: 14, marginBottom: 0 }}>
          <label htmlFor="quick-start-use-case">Use case</label>
          <select
            id="quick-start-use-case"
            name="useCase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
          >
            {USE_CASES.map((u) => (
              <option key={u} value={u}>
                {u || "Any"}
              </option>
            ))}
          </select>
        </div>

        <div className="actions" style={{ marginTop: 14 }}>
          <button className="primary" type="submit">
            Open Story Generator
          </button>
        </div>
      </form>

      <div className="chips" style={{ marginTop: 14 }}>
        {QUICK_START_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            className="chip"
            onClick={() => fillFromChip(chip)}
            style={{ cursor: "pointer" }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
