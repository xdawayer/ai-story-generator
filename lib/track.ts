// Thin, typed wrapper over Vercel Analytics custom events. <Analytics /> is
// already mounted in app/layout.tsx, so track() ships events with no extra
// setup. Centralizing event names here keeps the taxonomy in one place and
// avoids stringly-typed drift across the client islands that call it.
//
// Usage (client components only):
//   import { trackEvent } from "@/lib/track";
//   trackEvent("generate", { tool: "ai-story-generator", genre });
import { track } from "@vercel/analytics";

// The funnel we actually care about: did someone generate, keep going, and
// save into the campaign loop (the product's wedge). Keep this list small and
// meaningful — events are only worth adding when they answer a real question.
export type AnalyticsEvent =
  | "generate" // a tool produced output (the activation moment)
  | "continue" // user extended a story / regenerated
  | "download" // user downloaded output
  | "save_to_campaign" // saved an item into a campaign (wedge)
  | "extract_characters" // pulled story characters out as NPCs (wedge)
  | "generate_recap" // grounded "previously on…" recap (wedge)
  | "tool_card_click" // navigated from a hub/listing card to a tool
  | "example_prompt_click"; // clicked an example prompt chip

// Vercel Analytics only accepts flat string/number/boolean/null props.
export type AnalyticsProps = Record<string, string | number | boolean | null>;

export function trackEvent(event: AnalyticsEvent, props?: AnalyticsProps): void {
  try {
    track(event, props);
  } catch {
    // Analytics must never break a user flow.
  }
}
