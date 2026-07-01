"use client";

// The story generator's result panel — a story-specific replacement for the
// shared OutputPanel, with four explicit states:
//   empty    — value-forward copy + a lightweight example preview
//   loading  — rotating step copy over a paragraph skeleton, then streaming text
//   success  — "Generated story" (title, summary, body) + Story elements + actions
//   error    — a recoverable message + Try again (prompt/options are preserved)
// The generic OutputPanel is left untouched so the RPG tools that share it are
// unaffected. Action buttons come in as ReactNode (like OutputPanel's
// extraActions) so the parent owns every handler — this file takes no function
// props. Model output is rendered as plain text only (never innerHTML; XSS-safe).
import { useEffect, useRef, useState } from "react";
import { firstHeading } from "@/lib/download";
import type { StreamGenerator } from "@/lib/use-stream-generate";
import type { StoryElements } from "@/lib/story-elements-prompt";

export interface StoryMeta {
  genre: string;
  tone: string;
  length: string;
  pov: string;
}

// Cosmetic loading copy — deliberately generic ("Building / Choosing / Writing"),
// not a promise of real backend steps.
const LOADING_STEPS = [
  "Building the premise…",
  "Choosing the story shape…",
  "Creating characters and conflict…",
  "Writing the first draft…",
  "Finding reusable story elements…",
];

// Varied widths so the skeleton reads like paragraphs, not a progress bar.
const SKELETON_WIDTHS = [
  "92%",
  "100%",
  "84%",
  "97%",
  "68%",
  "100%",
  "88%",
  "74%",
];

function metaLine(m: StoryMeta): string {
  const parts = [
    `Genre: ${m.genre || "Any"}`,
    `Tone: ${m.tone || "Any"}`,
    `Length: ${m.length || "Short"}`,
  ];
  if (m.pov) parts.push(`POV: ${m.pov}`);
  return parts.join(" · ");
}

// The story's title is shown separately, so drop its leading Markdown heading
// from the displayed body (data ops like Copy/Download still use the full text).
function stripFirstHeading(md: string): string {
  const lines = md.split("\n");
  const idx = lines.findIndex((l) => l.trim().length > 0);
  if (idx >= 0 && /^#{1,6}\s/.test(lines[idx]!.trim())) {
    lines.splice(idx, 1);
    if (lines[idx]?.trim() === "") lines.splice(idx, 1);
  }
  return lines.join("\n").trim();
}

// Rotating loading copy; advances every 1.6s and holds on the last step.
function LoadingSteps() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((n) => (n < LOADING_STEPS.length - 1 ? n + 1 : n)),
      1600,
    );
    return () => clearInterval(id);
  }, []);
  return <p className="result-title">{LOADING_STEPS[i]}</p>;
}

function ElementList({ label, items }: { label: string; items: string[] }) {
  // Drop empty strings (a resilient-parse `.catch("")` fallback) so a malformed
  // model row never renders as a blank bullet.
  const clean = items.map((t) => t.trim()).filter(Boolean);
  if (clean.length === 0) return null;
  return (
    <div className="element-group">
      <h4>{label}</h4>
      <ul>
        {clean.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// The differentiator: table-ready structure pulled from the finished story.
// Degrades gracefully — a loading line while extracting, and nothing at all if
// extraction failed or found nothing (the story stays fully usable regardless).
function StoryElementsCard({
  elements,
  loading,
}: {
  elements: StoryElements | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="result-section">
        <p className="section-label">Story elements</p>
        <p className="statusline" style={{ margin: 0 }}>
          Finding reusable story elements…
        </p>
      </div>
    );
  }
  if (!elements) return null;
  const characters = elements.characters
    .filter((c) => c.name.trim())
    .map((c) => (c.role ? `${c.name} — ${c.role}` : c.name));
  const locations = elements.locations
    .map((l) => l.name)
    .filter((n) => n.trim());
  const hasAny =
    characters.length ||
    locations.length ||
    elements.conflicts.length ||
    elements.secrets.length ||
    elements.plotHooks.length ||
    elements.openQuestions.length;
  if (!hasAny) return null;
  return (
    <div className="result-section">
      <p className="section-label">Story elements</p>
      <div className="elements">
        <ElementList label="Characters" items={characters} />
        <ElementList label="Locations" items={locations} />
        <ElementList label="Conflicts" items={elements.conflicts} />
        <ElementList label="Secrets" items={elements.secrets} />
        <ElementList label="Plot hooks" items={elements.plotHooks} />
        <ElementList label="Open questions" items={elements.openQuestions} />
      </div>
    </div>
  );
}

export function StoryResultPanel({
  gen,
  meta,
  elements,
  elementsLoading,
  actions,
  errorAction,
}: {
  gen: StreamGenerator;
  meta: StoryMeta | null;
  elements: StoryElements | null;
  elementsLoading: boolean;
  actions: React.ReactNode; // success-state action bar, built by the parent
  errorAction: React.ReactNode; // error-state "Try again", built by the parent
}) {
  const { out, status, error } = gen;
  const bodyRef = useRef<HTMLDivElement>(null);

  const isError = status === "error" || status === "rate_limited";
  const isStreaming = status === "streaming";
  const isSuccess = status === "done" && Boolean(out);

  const title = (elements?.title?.trim() || firstHeading(out)) as string;
  const summary = elements?.summary?.trim() ?? "";

  // When a result-panel action (Regenerate/Continue/Rewrite) starts a generation,
  // its button unmounts and focus falls to <body>. Reclaim it onto the result
  // region so keyboard/SR users aren't dropped — but only if focus was actually
  // lost (don't steal it from the form's still-mounted "Generating…" button).
  useEffect(() => {
    if (status === "streaming" && document.activeElement === document.body) {
      bodyRef.current?.focus();
    }
  }, [status]);

  return (
    <div className="panel result-panel">
      <div className="result-body" ref={bodyRef} tabIndex={-1}>
        {/* Coarse, polite status for assistive tech — one announcement per phase
            instead of re-reading the whole story on every streamed token. */}
        <p className="sr-only" role="status">
          {isStreaming
            ? "Generating your story…"
            : isSuccess
              ? "Story ready."
              : ""}
        </p>

        {/* ERROR — keep the user's prompt and options; just offer a retry. */}
        {isError && (
          <>
            <div className="errorbox" role="alert">
              {status === "rate_limited" && error
                ? error
                : "Something went wrong while generating your story. Please try again, or simplify your prompt."}
            </div>
            {errorAction}
          </>
        )}

        {/* LOADING — rotating steps over a skeleton, then the streaming text. */}
        {!isError && isStreaming && (
          <>
            <LoadingSteps />
            {out ? (
              <div className="out">
                {out}
                <span className="cursor" />
              </div>
            ) : (
              <div className="skeleton" aria-hidden="true">
                {SKELETON_WIDTHS.map((w, i) => (
                  <div key={i} className="skeleton-line" style={{ width: w }} />
                ))}
              </div>
            )}
          </>
        )}

        {/* SUCCESS — stacked reading column: story, then elements, then actions.
            The tool is capped to a reading width (globals.css) so the story keeps
            a sensible line length and nothing sits in dead space beside it. */}
        {!isError && !isStreaming && isSuccess && (
          <>
            <p className="result-eyebrow">Generated story</p>
            <h3 className="result-title">{title}</h3>
            {meta && <p className="result-meta">{metaLine(meta)}</p>}
            {summary && <p className="result-summary">{summary}</p>}
            <div className="out" style={{ marginTop: 12 }}>
              {stripFirstHeading(out)}
            </div>

            <StoryElementsCard elements={elements} loading={elementsLoading} />

            {actions}
          </>
        )}

        {/* EMPTY — value-forward copy plus a lightweight example preview. */}
        {!isError && !isStreaming && !isSuccess && (
          <>
            <p className="empty-title">Your story will appear here.</p>
            <p className="empty">
              Start with an idea, or choose an example prompt. After generation,
              you can copy, continue, rewrite, download, or save the result.
            </p>
            <div className="preview-card">
              <p className="preview-label">Example output</p>
              <p className="preview-text">
                The bells of Hollow Reach hadn&apos;t rung in thirty years — not
                since the night the sea gave back its dead. Now a child has
                started ringing them again…
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
