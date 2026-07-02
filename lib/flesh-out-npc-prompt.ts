// Prompt builder for the per-NPC "Flesh out" button: expands a thin NPC stub
// (e.g. one extracted from a story with only a name + role) into a full,
// table-ready profile, grounded in the campaign's world note and the NPC's
// world-links. Mirrors the NPC generator's Markdown shape so fleshed-out NPCs
// look native next to generated ones.
export interface FleshOutNpcContext {
  npcContent: string;
  campaignName: string;
  worldNote: string;
  // Prompt-ready connection lines, e.g. "Location: East Gallery — trapped here".
  connections: string[];
}

const SYSTEM = [
  "You are a tabletop RPG Game Master's assistant. Expand the given NPC stub into",
  "exactly ONE complete, ready-to-use NPC profile. Keep the same name and stay",
  "true to every fact already in the stub — enrich, never contradict.",
  "Output GitHub-flavored Markdown with these sections, in this order:",
  "## <same name> — <5-word epithet>",
  "**Role:** … · **Alignment:** …",
  "### Appearance",
  "2-3 vivid, specific sentences (no generic filler).",
  "### Personality",
  "3 bullet traits, then one bullet **Flaw:** …, then one bullet **Secret:** …",
  "### Voice & Mannerism",
  "One line a GM can perform at the table.",
  "### Plot Hook",
  "One concrete hook — tie it to the campaign's world and the NPC's connections when given.",
  "### Stat seed (system-agnostic)",
  "3 notable skills and 1 signature item — works for D&D 5e, Pathfinder, or OSR.",
  "",
  "Rules: original characters only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Mature fantasy themes are fine. Never produce real-world",
  "harmful instructions or any sexual content involving minors. Output only the NPC",
  "profile — no preamble or closing commentary.",
].join("\n");

export function buildFleshOutNpcPrompt(c: FleshOutNpcContext): {
  system: string;
  user: string;
} {
  const parts = [
    `NPC stub to expand:\n${c.npcContent.trim()}`,
    `Campaign: ${c.campaignName}`,
    c.worldNote && `World / setting (ground the NPC in this):\n${c.worldNote}`,
    c.connections.length > 0 &&
      `Known connections (weave these into the profile):\n${c.connections
        .map((s) => `- ${s}`)
        .join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system: SYSTEM, user: `Flesh out this NPC now:\n\n${parts}` };
}
