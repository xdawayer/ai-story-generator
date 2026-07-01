// Prompt builder for the story -> structured elements bridge. Reads a finished
// story and returns a compact JSON object of its reusable, table-ready elements
// (characters, locations, conflicts, secrets, plot hooks, open questions) plus a
// title and one-sentence summary. This powers the result panel's "Story elements"
// card — the product's differentiator — without changing the streaming generate
// endpoint (the story still streams as prose; elements are a second, structured
// pass over the finished text).
import { z } from "zod";

// Validated shape returned to the client. Every field is resilient so a partial
// or sloppy model response still renders: `.catch` rescues a bad element/array to
// a safe fallback (not just a missing one), and empty names are filtered out at
// render. We never trust raw model JSON — a single bad row can't nuke the card.
const listOfStrings = z.array(z.string().catch("")).catch([]).default([]);

export const StoryElementsSchema = z.object({
  title: z.string().catch("").default(""),
  summary: z.string().catch("").default(""),
  characters: z
    .array(
      z.object({
        name: z.string().catch(""),
        role: z.string().optional().default(""),
      }),
    )
    .catch([])
    .default([]),
  locations: z
    .array(z.object({ name: z.string().catch("") }))
    .catch([])
    .default([]),
  conflicts: listOfStrings,
  secrets: listOfStrings,
  plotHooks: listOfStrings,
  openQuestions: listOfStrings,
});

export type StoryElements = z.infer<typeof StoryElementsSchema>;

const SYSTEM = [
  "You are a tabletop RPG Game Master's assistant. Read the story and return a",
  "compact JSON object describing its reusable elements. Output ONLY valid JSON —",
  "no markdown, no code fences, no commentary before or after.",
  "",
  "Exact shape:",
  "{",
  '  "title": "<the story\'s title>",',
  '  "summary": "<one vivid sentence, at most 180 characters>",',
  '  "characters": [{"name": "…", "role": "…"}],',
  '  "locations": [{"name": "…"}],',
  '  "conflicts": ["…"],',
  '  "secrets": ["…"],',
  '  "plotHooks": ["…"],',
  '  "openQuestions": ["…"]',
  "}",
  "",
  "Rules: named characters only (at most 6); at most 6 locations; at most 4",
  "conflicts and 4 secrets; at most 5 plot hooks and 5 open questions. Keep each",
  "string short, specific, and directly usable at the table. Use [] for anything",
  "the story does not support — never invent beyond what the story implies.",
].join("\n");

export function buildStoryElementsPrompt(story: string): {
  system: string;
  user: string;
} {
  const user = `Story:\n\n${story.trim().slice(0, 8000)}\n\nReturn the JSON now.`;
  return { system: SYSTEM, user };
}

// Parse a model JSON response defensively: strip ``` fences, grab the outermost
// {...}, JSON.parse, then validate. Returns null on any failure (caller degrades
// gracefully — the story stays fully usable without the elements card).
export function parseStoryElements(raw: string): StoryElements | null {
  const cleaned = raw
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    const result = StoryElementsSchema.safeParse(obj);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
