// Prompt builder for the broad AI Story Generator (kept as the top-of-funnel SEO
// surface — the head term "ai story generator"). It is intentionally generic and
// instant-value; the funnel CTA routes story-curious visitors toward the RPG
// campaign workspace (the actual product/moat).
export interface StoryInput {
  idea: string;
  genre: string;
  tone: string;
  length: string;
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

export function buildStoryPrompt(i: StoryInput): { system: string; user: string } {
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
