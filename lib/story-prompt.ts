// Prompt builder for the broad AI Story Generator (kept as the top-of-funnel SEO
// surface — the head term "ai story generator"). It is intentionally generic and
// instant-value; the funnel CTA routes story-curious visitors toward the RPG
// campaign workspace (the actual product/moat).
export interface StoryInput {
  idea: string;
  genre: string;
  tone: string;
  length: string;
  pov?: string; // e.g. "First person", "Third person limited"
  characters?: string; // optional character notes (names, roles, relationships)
  setting?: string; // optional setting / place / era
  endingStyle?: string; // e.g. "Twist", "Bittersweet", "Cliffhanger"
  useCase?: string; // e.g. "D&D session", "Campaign opening" — shapes usable output
  // When set, write the NEXT part of this story instead of a new one ("Continue").
  continueFrom?: string;
  // Long-form chapter mode.
  mode?: "outline" | "chapter";
  chapters?: string; // desired chapter count (outline mode)
  outline?: string; // the full outline (chapter mode)
  chapter?: string; // the chapter to write now (chapter mode)
}

// Word targets stay under the guest maxOutputTokens cap (~1500 tokens ≈ 1100
// words) so nothing truncates mid-sentence. Medium/Long are expanded-short
// prompts, not a separate backend tier — they lengthen the ask, not the cap.
const LENGTH_GUIDE: Record<string, string> = {
  Flash: "a tight flash-fiction piece of about 150-250 words",
  Short: "a short story of about 400-700 words",
  Medium: "a fuller short story of about 700-900 words",
  Long: "a longer, complete short story of about 950-1100 words",
  Scene: "a single vivid scene of about 300-500 words",
};

const SYSTEM = [
  "You are a skilled fiction writer. Write ONE original short story for the reader.",
  "Output GitHub-flavored Markdown:",
  "# <evocative title>",
  "Then the prose in short paragraphs. Optionally use a divider (---) between beats.",
  "Craft: a clear arc (hook, turn, resolution), concrete sensory detail, a distinct",
  "voice, and real characters with wants. Avoid cliché openings ('Once upon a time'),",
  "adjective soup, and generic filler.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Mature themes (violence, intrigue, the macabre) are",
  "fine. Never produce real-world harmful instructions or any sexual content",
  "involving minors.",
].join("\n");

const CONTINUE_SYSTEM = [
  "You are a skilled fiction writer continuing an existing story.",
  "Write ONLY the next part — do not repeat or summarize what came before, and do",
  "not restate the title. Continue seamlessly in the same voice, tense, and POV.",
  "Write about 200-350 words that advance the plot with a fresh beat (a",
  "complication, reversal, or revelation). Output Markdown prose in short",
  "paragraphs with NO heading. Do not wrap up the whole story unless it is clearly",
  "reaching its natural end.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Never produce real-world harmful instructions or any",
  "sexual content involving minors.",
].join("\n");

const OUTLINE_SYSTEM = [
  "You are a fiction author planning a serialized story. Produce ONLY a chapter",
  "outline — no prose. Output a numbered Markdown list, one line per chapter:",
  "`N. <evocative chapter title> — <one-sentence beat>`. Give the story a clear",
  "arc across the chapters (setup, rising complications, climax, resolution).",
  "No preamble, no closing notes — just the numbered list.",
].join("\n");

const CHAPTER_SYSTEM = [
  "You are a skilled fiction writer composing ONE chapter of a longer story.",
  "Write about 400-600 words for THIS chapter only. Begin with a Markdown",
  "heading '## <chapter title>'. Continue the established voice, tense, and POV.",
  "Do NOT summarize previous chapters or restate the outline; advance the story.",
  "End on a beat that pulls the reader into the next chapter.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. No sexual content involving minors.",
].join("\n");

export function buildStoryPrompt(i: StoryInput): {
  system: string;
  user: string;
} {
  // Outline mode: plan the chapters of a long-form story.
  if (i.mode === "outline") {
    const count = i.chapters || "6";
    const fields = [
      i.idea && `Premise / idea: ${i.idea}`,
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Tone: ${i.tone}`,
    ]
      .filter(Boolean)
      .join("\n");
    const user = `Outline ${count} chapters for an original story.${fields ? `\n${fields}` : " Surprise me with a strong premise."}`;
    return { system: OUTLINE_SYSTEM, user };
  }

  // Chapter mode: write one chapter, grounded in the outline + story so far.
  if (i.mode === "chapter") {
    const user = [
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Tone: ${i.tone}`,
      i.pov && `Point of view: ${i.pov}`,
      i.outline && `Full outline:\n${i.outline.slice(0, 3000)}`,
      i.continueFrom?.trim() &&
        `Story so far (for continuity — do not repeat it):\n${i.continueFrom.trim().slice(0, 4000)}`,
      `\nWrite this chapter now: ${i.chapter || "the next chapter"}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    return { system: CHAPTER_SYSTEM, user };
  }

  // Continuation mode: extend an existing story rather than starting a new one.
  if (i.continueFrom && i.continueFrom.trim()) {
    const ctx = [
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Tone: ${i.tone}`,
      i.idea && `Where to take it next: ${i.idea}`,
    ]
      .filter(Boolean)
      .join("\n");
    const user = [
      "Story so far:\n",
      i.continueFrom.trim().slice(0, 6000),
      "\n\nContinue the story from exactly where it stops.",
      ctx && `\n${ctx}`,
    ]
      .filter(Boolean)
      .join("");
    return { system: CONTINUE_SYSTEM, user };
  }

  const length = LENGTH_GUIDE[i.length] ?? LENGTH_GUIDE.Short;
  const fields = [
    i.idea && `Premise / idea: ${i.idea}`,
    i.genre && `Genre: ${i.genre}`,
    i.tone && `Tone: ${i.tone}`,
    i.pov && `Point of view: ${i.pov}`,
    i.characters && `Characters to feature: ${i.characters}`,
    i.setting && `Setting: ${i.setting}`,
    i.endingStyle && `Ending style: ${i.endingStyle}`,
    i.useCase &&
      `Use case: ${i.useCase} — write it so it is directly usable for this at the table`,
    `Target length: ${length}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = i.idea
    ? `Write ${length} from this brief:\n${fields}`
    : `Write ${length}. Surprise me with an original, characterful premise.\n${fields}`;

  return { system: SYSTEM, user };
}
