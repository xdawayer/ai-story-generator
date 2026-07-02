// Prompt builder for the relationship-label "Suggest" button: given the two
// endpoints of a world-link, propose ONE short phrase describing how they
// relate. The link is undirected, so the phrase must read true from either
// side ("sworn enemies", "bound by the mirror"), never one-way ("father of").
export interface LinkLabelContext {
  aKind: string;
  aName: string;
  aText: string;
  bKind: string;
  bName: string;
  bText: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master's assistant. Two entities from the same",
  "campaign are linked. Suggest ONE short phrase (2-6 words) that captures how",
  "they relate, grounded strictly in the provided text.",
  "The link has no direction: the phrase must read correctly from BOTH sides,",
  "so prefer symmetric or neutral phrasings ('sworn enemies', 'bound by the",
  "mirror', 'haunted meeting place') over one-way ones ('father of', 'owns').",
  "Lowercase unless a proper noun. Output ONLY the phrase — no quotes, no",
  "punctuation at the end, no explanation.",
].join("\n");

export function buildLinkLabelPrompt(c: LinkLabelContext): {
  system: string;
  user: string;
} {
  const side = (kind: string, name: string, text: string) =>
    `${kind}: ${name}${text ? `\n${text}` : ""}`;
  const user = [
    "Entity A —",
    side(c.aKind, c.aName, c.aText),
    "",
    "Entity B —",
    side(c.bKind, c.bName, c.bText),
    "",
    "Suggest the relationship phrase now.",
  ].join("\n");
  return { system: SYSTEM, user };
}
