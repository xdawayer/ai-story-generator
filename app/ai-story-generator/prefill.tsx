"use client";

// Client-only query prefill. The story tool's inputs are uncontrolled DOM fields
// (a <textarea id="idea"> and tone/length/pov/endingStyle/useCase <select>s) in
// the StoryGenerator island. On mount this reads the URL's query string, validates
// each value against the real option sets, and writes them into those fields —
// exactly like example-prompts.tsx does (set value, dispatch input).
//
// We read window.location.search directly rather than useSearchParams(): on a
// statically prerendered route, useSearchParams() reads empty on the first
// (deps: []) effect pass, so the prefill silently never lands. Reading the live
// URL in a client effect is reliable for hard loads AND client transitions, and
// avoids the useSearchParams CSR deopt so these pages stay static. Never auto-
// submits — this only fills the form so the user can tweak and generate.
import { useEffect } from "react";
import { TONES, LENGTHS, POVS, ENDINGS, USE_CASES } from "./story-generator";

function setField(id: string, value: string) {
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

function PrefillFromQueryInner() {
  useEffect(() => {
    // URLSearchParams handles percent-decoding and never throws on bad input.
    const params = new URLSearchParams(window.location.search);

    const idea = params.get("idea");
    if (idea) setField("idea", idea.slice(0, 600));

    // Note: ?genre is prefilled inside StoryGenerator (the genre picker is a
    // React-controlled chip group, not a DOM <select>), so it's handled there.

    const tone = params.get("tone");
    if (tone && TONES.includes(tone)) setField("tone", tone);

    const length = params.get("length");
    if (length && LENGTHS.includes(length)) setField("length", length);

    const pov = params.get("pov");
    if (pov && POVS.includes(pov)) setField("pov", pov);

    // ?ending maps to the optional-details <select id="endingStyle">.
    const ending = params.get("ending");
    if (ending && ENDINGS.includes(ending)) setField("endingStyle", ending);

    const useCase = params.get("useCase");
    if (useCase && USE_CASES.includes(useCase)) setField("useCase", useCase);
    // Run once on mount only — don't clobber the user's later edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function PrefillFromQuery() {
  return <PrefillFromQueryInner />;
}
