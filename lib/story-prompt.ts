// Prompt builder for the broad AI Story Generator (kept as the top-of-funnel SEO
// surface — the head term "ai story generator"). It is intentionally generic and
// instant-value; the funnel CTA routes story-curious visitors toward the RPG
// campaign workspace (the actual product/moat).
export interface StoryInput {
  idea: string;
  genre: string;
  tone: string;
  length: string;
  // When set, write the NEXT part of this story instead of a new one ("Continue").
  continueFrom?: string;
}

const LENGTH_GUIDE: Record<string, string> = {
  Flash: "a tight flash-fiction piece of about 150-250 words",
  Short: "a short story of about 400-700 words",
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

export function buildStoryPrompt(i: StoryInput): {
  system: string;
  user: string;
} {
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
    `Target length: ${length}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = i.idea
    ? `Write ${length} from this brief:\n${fields}`
    : `Write ${length}. Surprise me with an original, characterful premise.\n${fields}`;

  return { system: SYSTEM, user };
}
