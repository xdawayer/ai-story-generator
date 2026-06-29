// Prompt builder for the Settlement / Town generator. Returns ONE settlement —
// vibe, notable locations, people to meet, and trouble brewing — so a GM can run
// a town on the fly. Targets "town generator" / "settlement generator" intent.
export interface SettlementInput {
  kind: string; // hamlet / village / town / city
  setting: string; // fantasy / sci-fi / etc.
  vibe: string; // prosperous / struggling / secretive / lawless / etc.
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master creating a settlement a GM can run on the fly.",
  "Output GitHub-flavored Markdown with these sections, in order, using ## headings:",
  "## <Settlement name> (<kind>) — one-line population estimate and overall vibe.",
  "## Notable locations — 3 places, each a name then a sentence on what makes it worth a scene.",
  "## People to meet — 2-3 NPCs, each: name — role, a defining trait, and a hook or secret.",
  "## Trouble brewing — one local problem or rumor the party can get pulled into.",
  "",
  "Make it specific and evocative, not generic. Keep it system-agnostic.",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the settlement, no preamble.",
].join("\n");

export function buildSettlementPrompt(i: SettlementInput): {
  system: string;
  user: string;
} {
  const fields = [
    i.kind && `Settlement type: ${i.kind}`,
    i.setting && `Setting/genre: ${i.setting}`,
    i.vibe && `Vibe: ${i.vibe}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Create one settlement matching:\n${fields}`
    : "Create one original fantasy town for a tabletop RPG party to explore.";

  return { system: SYSTEM, user };
}
