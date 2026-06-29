"use client";

// Client-only query prefill. The story tool's inputs are uncontrolled DOM fields
// (a <textarea id="idea"> and tone/length/pov/endingStyle <select>s) in the
// StoryGenerator island. This reads ?idea/?genre/?tone/?length/?pov/?ending,
// validates each against the real option sets, and writes them into those fields
// on mount — exactly like example-prompts.tsx does (set value, dispatch input).
//
// Why client-only + Suspense: useSearchParams forces a route to client-side
// render unless it sits behind a <Suspense> boundary. Reading searchParams in
// the (static) genre/ai-story-generator SERVER pages would flip them to dynamic
// rendering and break static SEO — so prefill lives entirely here. We never
// auto-submit; this only fills the form so the user can tweak and generate.
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GENRES, TONES, LENGTHS, POVS, ENDINGS } from "./story-generator";

function setField(id: string, value: string) {
  const el = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  if (!el) return;
  el.value = value;
  // Notify listeners (and React, harmlessly) that the field changed.
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

// decodeURIComponent can throw on malformed input — never let it break the page.
function decodeParam(raw: string | null): string | null {
  if (raw === null) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

function PrefillInner({ lockedGenre }: { lockedGenre?: string }) {
  const params = useSearchParams();

  useEffect(() => {
    // idea: free text, just bounded to the textarea's maxLength.
    const idea = decodeParam(params.get("idea"));
    if (idea) setField("idea", idea.slice(0, 600));

    // genre: only on the general page (locked-genre pages fix the genre).
    if (!lockedGenre) {
      const genre = decodeParam(params.get("genre"));
      if (genre && GENRES.includes(genre)) setField("genre", genre);
    }

    const tone = decodeParam(params.get("tone"));
    if (tone && TONES.includes(tone)) setField("tone", tone);

    const length = decodeParam(params.get("length"));
    if (length && LENGTHS.includes(length)) setField("length", length);

    const pov = decodeParam(params.get("pov"));
    if (pov && POVS.includes(pov)) setField("pov", pov);

    // ?ending maps to the optional-details <select id="endingStyle">.
    const ending = decodeParam(params.get("ending"));
    if (ending && ENDINGS.includes(ending)) setField("endingStyle", ending);
    // Run once on mount only — don't clobber the user's later edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// Suspense boundary is required so useSearchParams doesn't bail the whole route
// out to client-side rendering. fallback={null} — this island renders nothing.
export function PrefillFromQuery({ lockedGenre }: { lockedGenre?: string }) {
  return (
    <Suspense fallback={null}>
      <PrefillInner lockedGenre={lockedGenre} />
    </Suspense>
  );
}
