"use client";

// Hand a just-generated story to another tool (e.g. the quest-hook generator)
// without persisting it. The story has no id until it's saved to a campaign, so
// we stash it in sessionStorage and the target tool reads it on arrival (gated
// by a ?source=story query param). It stays available for the tab session (so a
// reload keeps the grounding) and is overwritten by the next handoff; capped to
// keep storage light. If storage is unavailable the target tool just opens blank.
const KEY = "story-handoff";

export interface StoryHandoff {
  title: string;
  story: string;
}

export function stashStory(h: StoryHandoff): void {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        title: h.title.slice(0, 200),
        story: h.story.slice(0, 8000),
      }),
    );
  } catch {
    /* storage blocked — target tool opens fresh */
  }
}

export function readStory(): StoryHandoff | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Partial<StoryHandoff>;
    if (typeof obj?.story !== "string" || !obj.story.trim()) return null;
    return {
      title: String(obj.title ?? "").slice(0, 200),
      story: obj.story.slice(0, 8000),
    };
  } catch {
    return null;
  }
}
