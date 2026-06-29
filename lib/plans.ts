// Single source of truth for subscription tiers. Drives the pricing page and
// (later) entitlement gates. Payment is NOT wired yet — Pro is a placeholder the
// waitlist collects interest for.
export type Tier = "free" | "pro";

export interface Plan {
  tier: Tier;
  name: string;
  tagline: string;
  price: string;
  rateLimitPerMin: number;
  features: string[];
}

export const PLANS: Record<Tier, Plan> = {
  free: {
    tier: "free",
    name: "Free",
    tagline: "Everything you need to start a world.",
    price: "$0",
    rateLimitPerMin: 8,
    features: [
      "All generators (NPC, story, backstory, names, taverns)",
      "Save NPCs & stories to campaigns",
      "Grounded recaps & character extraction",
      "Markdown / PDF export",
    ],
  },
  pro: {
    tier: "pro",
    name: "Pro",
    tagline: "For Game Masters running real campaigns.",
    price: "Coming soon",
    rateLimitPerMin: 30,
    features: [
      "Everything in Free",
      "Higher rate limits & longer outputs",
      "Chapter-by-chapter long-form stories",
      "Unlimited campaigns & saves",
      "Priority generation",
    ],
  },
};
