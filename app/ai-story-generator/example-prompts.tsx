"use client";

// Clickable example prompts. The story tool's prompt box is an uncontrolled
// <textarea id="idea"> in the StoryGenerator client island; clicking a prompt
// writes straight into it (FormData reads the live DOM value on submit), then
// focuses and scrolls it into view so the user can tweak and generate.
export function ExamplePrompts({ prompts }: { prompts: readonly string[] }) {
  function usePrompt(text: string) {
    const el = document.getElementById("idea") as HTMLTextAreaElement | null;
    if (!el) return;
    el.value = text;
    // Notify any listeners (and React, harmlessly) that the field changed.
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <ul className="prompt-list">
      {prompts.map((p) => (
        <li key={p}>
          <button
            type="button"
            className="prompt-btn"
            onClick={() => usePrompt(p)}
            aria-label={`Use this prompt: ${p}`}
          >
            <span>{p}</span>
            <span className="prompt-cta">Use this prompt →</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
