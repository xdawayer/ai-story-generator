// Shared vocabulary for the campaign world-links graph. Plain module (no
// "use server") so both the server actions and the client UI can import it.
import type { WorldKind } from "@/lib/world-kinds";

// Keep in sync with the `a_kind`/`b_kind` CHECK constraint in
// supabase/migrations/20260701000000_links.sql — adding a kind here also needs a
// migration that widens that CHECK, or the DB will reject links of the new kind.
export const LINK_KINDS = [
  "npc",
  "location",
  "faction",
  "plot_thread",
  "story",
] as const;
export type LinkKind = (typeof LINK_KINDS)[number];

export function isLinkKind(k: string): k is LinkKind {
  return (LINK_KINDS as readonly string[]).includes(k);
}

// Singular label (one entity) and plural group label (a chip section).
export const LINK_LABELS: Record<LinkKind, string> = {
  npc: "NPC",
  location: "Location",
  faction: "Faction",
  plot_thread: "Plot thread",
  story: "Story",
};
export const LINK_GROUP_LABELS: Record<LinkKind, string> = {
  npc: "NPCs",
  location: "Locations",
  faction: "Factions",
  plot_thread: "Plot threads",
  story: "Stories",
};

// The plural world-entry kinds map to their singular link kinds.
export const WORLD_KIND_TO_LINK: Record<WorldKind, LinkKind> = {
  factions: "faction",
  locations: "location",
  plot_threads: "plot_thread",
};

export function linkKey(kind: LinkKind, id: string): string {
  return `${kind}:${id}`;
}

export interface LinkEndpoint {
  kind: LinkKind;
  id: string;
}

// Canonical (undirected) ordering so an A<->B link is stored once. The endpoint
// with the smaller "kind:id" key is always `a`.
export function canonicalPair(
  aKind: LinkKind,
  aId: string,
  bKind: LinkKind,
  bId: string,
): [LinkEndpoint, LinkEndpoint] {
  const a: LinkEndpoint = { kind: aKind, id: aId };
  const b: LinkEndpoint = { kind: bKind, id: bId };
  return linkKey(aKind, aId) <= linkKey(bKind, bId) ? [a, b] : [b, a];
}

// One resolved connection shown on an entity: the OTHER endpoint + the shared
// row id (so either side can delete it).
export interface LinkRef {
  linkId: string;
  kind: LinkKind;
  id: string;
  label: string;
}

// A candidate to link to, shown in the "+ Link" picker.
export interface LinkTarget {
  kind: LinkKind;
  id: string;
  label: string;
}

// One undirected edge (a resolved, non-orphan link row) — drives the map view.
export interface LinkEdge {
  id: string;
  aKind: LinkKind;
  aId: string;
  bKind: LinkKind;
  bId: string;
}
