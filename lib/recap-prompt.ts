// Prompt builder for a campaign recap — the first context-aware generation that
// is GROUNDED in saved state (world note + session logs + NPCs). This is the
// wedge ChatGPT can't easily do: it remembers THIS campaign.
export interface RecapContext {
  campaignName: string;
  worldNote: string;
  npcTitles: string[];
  sessionNotes: string[];
  factions?: string[];
  locations?: string[];
  plotThreads?: string[];
  // "A — relationship — B" lines resolved from the world-links graph, so the
  // recap can ground in HOW entities relate, not just that they exist.
  relationships?: string[];
}

const SYSTEM = [
  "You are a tabletop RPG Game Master's assistant. Write a concise 'previously on…'",
  "recap of the campaign so far, suitable to read aloud at the start of the next",
  "session. Ground it strictly in the provided campaign state — do not invent major",
  "new plot points. Output GitHub-flavored Markdown: a short narrative paragraph,",
  "then a '### Open threads' bullet list of 2-4 unresolved hooks the party can pursue.",
  "Keep it under ~200 words. Mature fantasy themes are fine; no real-world harm.",
].join("\n");

export function buildRecapPrompt(c: RecapContext): {
  system: string;
  user: string;
} {
  const parts = [
    `Campaign: ${c.campaignName}`,
    c.worldNote && `World / setting:\n${c.worldNote}`,
    c.factions && c.factions.length > 0 && `Factions: ${c.factions.join("; ")}`,
    c.locations &&
      c.locations.length > 0 &&
      `Locations: ${c.locations.join("; ")}`,
    c.plotThreads &&
      c.plotThreads.length > 0 &&
      `Plot threads: ${c.plotThreads.join("; ")}`,
    c.npcTitles.length > 0 && `Known NPCs: ${c.npcTitles.join("; ")}`,
    c.relationships &&
      c.relationships.length > 0 &&
      `Connections (how entities relate — respect these):\n${c.relationships
        .map((r) => `- ${r}`)
        .join("\n")}`,
    c.sessionNotes.length > 0
      ? `Session logs (oldest first):\n${c.sessionNotes
          .map((n, idx) => `Session ${idx + 1}: ${n}`)
          .join("\n")}`
      : "No session logs yet — base the recap on the world note and NPCs.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    system: SYSTEM,
    user: `Write a recap from this campaign state:\n\n${parts}`,
  };
}
