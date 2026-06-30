"use client";

// Hero "Quick Start" card. Pure navigation — it never calls an AI API and never
// auto-generates. On submit it builds a query string the /ai-story-generator
// prefill contract understands (?idea, ?genre, ?tone) and routes there; the
// generator only applies values that exactly match its option arrays, which is
// why GENRES/TONES are imported straight from the generator (single source of
// truth, so prefill always lands). Empty input is allowed (it just navigates).
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GENRES,
  TONES,
  USE_CASES,
} from "@/app/ai-story-generator/story-generator";
import { QUICK_START_CHIPS } from "@/lib/home-data";
import { trackEvent } from "@/lib/track";

const MAX_IDEA = 600;

export function HomeQuickStart() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [useCase, setUseCase] = useState("");

  function openGenerator() {
    const params = new URLSearchParams();
    const trimmed = idea.trim().slice(0, MAX_IDEA);
    if (trimmed) params.set("idea", trimmed);
    if (genre) params.set("genre", genre);
    if (tone) params.set("tone", tone);
    if (useCase) params.set("useCase", useCase);

    trackEvent("home_quick_start_submit", {
      has_idea: trimmed.length > 0,
      genre: genre || "any",
      tone: tone || "any",
      use_case: useCase || "any",
    });

    const qs = params.toString();
    router.push(qs ? `/ai-story-generator?${qs}` : "/ai-story-generator");
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
