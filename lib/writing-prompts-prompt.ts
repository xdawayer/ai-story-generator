// Prompt builder for the Story Prompt Generator (a batch tool — like taverns and
// quest hooks). It returns writing prompts, NOT finished stories, targeting
// "story prompt generator" / "writing prompt generator" search intent and
// funneling into the actual AI Story Generator.
export interface WritingPromptsInput {
  genre: string; // fantasy / sci-fi / horror / etc.
  tone: string; // whimsical / dark / hopeful / etc.
  audience: string; // kids / teens / adults
  kind: string; // what-if / character / first line / setting / dialogue
  detail: string;
}

const SYSTEM = [
  "You are a creative writing coach. Generate a batch of original story writing prompts.",
  "Output GitHub-flavored Markdown: exactly 10 entries as a numbered list, one prompt per line:",
  "N. <a vivid 1-2 sentence writing prompt that sets up a character, a situation, and an implied tension>",
  "Make each prompt distinct in shape and genuinely sparky — not 10 variations of one idea.",
  "Do not write the stories themselves; write only the prompts.",
  "",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the numbered list, no preamble or closing text.",
].join("\n");

export function buildWritingPromptsPrompt(i: WritingPromptsInput): {
  system: string;
  user: string;
} {
  const fields = [
    i.genre && `Genre: ${i.genre}`,
    i.tone && `Tone: ${i.tone}`,
    i.audience && `Audience: ${i.audience}`,
    i.kind && `Prompt style: ${i.kind}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate 10 story writing prompts matching:\n${fields}`
    : "Generate 10 varied, original story writing prompts across a range of genres and moods.";

  return { system: SYSTEM, user };
}
