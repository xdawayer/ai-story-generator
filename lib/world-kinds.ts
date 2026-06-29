// Structured world-building entry kinds (factions / locations / plot threads).
// Plain module so both server actions and client components can import it
// ("use server" files may only export async functions).
export const WORLD_KINDS = ["factions", "locations", "plot_threads"] as const;
export type WorldKind = (typeof WORLD_KINDS)[number];

export function isWorldKind(k: string): k is WorldKind {
  return (WORLD_KINDS as readonly string[]).includes(k);
}

export const WORLD_LABELS: Record<
  WorldKind,
  { title: string; placeholder: string }
> = {
  factions: {
    title: "Factions",
    placeholder: "The Iron Syndicate — a ruthless smugglers' guild…",
  },
  locations: {
    title: "Locations",
    placeholder: "Blackreach — a sunless dwarven city carved into a chasm…",
  },
  plot_threads: {
    title: "Plot threads",
    placeholder: "The missing heir — who took them, and why it matters…",
  },
};
