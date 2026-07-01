"use client";

// The world-links UI embedded in every entity card: chips for existing
// connections (grouped by kind, click to jump, × to unlink) plus a "+ Link"
// picker of other entities. Links are undirected, so a location's chips already
// include the NPCs here — no separate backlink concept.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addLinkAction, deleteLinkAction } from "@/app/actions";
import {
  LINK_GROUP_LABELS,
  LINK_KINDS,
  LINK_LABELS,
  linkKey,
  type LinkKind,
  type LinkRef,
  type LinkTarget,
} from "@/lib/link-kinds";

// Fallback labels that carry no identity — never worth auto-suggesting a link on.
const GENERIC_LABELS = new Set(["npc", "untitled story"]);

function isAlnum(ch: string): boolean {
  return /[a-z0-9]/.test(ch);
}

// Case-insensitive whole-phrase mention test: `name` must appear in `haystack`
// not flanked by alphanumerics (so "Ash" doesn't match "Ashen"), which lets
// multi-word names match as a phrase. Drives the "Suggested" link chips.
function mentions(haystack: string, name: string): boolean {
  const n = name.trim().toLowerCase();
  if (n.length < 3) return false;
  const hay = haystack.toLowerCase();
  let from = 0;
  for (;;) {
    const idx = hay.indexOf(n, from);
    if (idx === -1) return false;
    const before = idx === 0 ? "" : hay[idx - 1];
    const after = idx + n.length >= hay.length ? "" : hay[idx + n.length];
    if (!isAlnum(before) && !isAlnum(after)) return true;
    from = idx + n.length;
  }
}

// Scroll a linked entity into view and open it: climb the DOM opening every
// <details> ancestor (its Section and the card itself) so the target is visible.
export function jumpToEntry(kind: LinkKind, id: string): void {
  const el = document.getElementById(`entry-${kind}-${id}`);
  if (!el) return;
  let p: HTMLElement | null = el;
  while (p) {
    if (p instanceof HTMLDetailsElement) p.open = true;
    p = p.parentElement;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function Connections({
  campaignId,
  node,
  links,
  targets,
  text,
}: {
  campaignId: string;
  node: { kind: LinkKind; id: string };
  links: LinkRef[];
  targets: LinkTarget[];
  // This entity's own body text — scanned for other entities' names to suggest
  // links. Omit to disable suggestions for this card.
  text?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const selfKey = linkKey(node.kind, node.id);
  const linkedKeys = new Set(links.map((l) => linkKey(l.kind, l.id)));
  const available = targets.filter((t) => {
    const k = linkKey(t.kind, t.id);
    return k !== selfKey && !linkedKeys.has(k);
  });

  // Suggestions: not-yet-linked entities whose name appears in this card's text.
  // Capped so a text mentioning many entities never floods the card.
  const suggestions = (
    text
      ? available.filter(
          (t) =>
            !GENERIC_LABELS.has(t.label.trim().toLowerCase()) &&
            mentions(text, t.label),
        )
      : []
  ).slice(0, 8);

  if (links.length === 0 && available.length === 0) return null;

  async function add(value: string) {
    if (!value) return;
    const idx = value.indexOf(":");
    const kind = value.slice(0, idx) as LinkKind;
    const id = value.slice(idx + 1);
    setBusy(true);
    setMsg("");
    const res = await addLinkAction(campaignId, node.kind, node.id, kind, id);
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Could not add the link.");
      return;
    }
    router.refresh();
  }

  async function remove(linkId: string) {
    setBusy(true);
    setMsg("");
    const res = await deleteLinkAction(linkId);
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error ?? "Could not remove the link.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="conn">
      <span className="conn-title">Connections</span>
      {LINK_KINDS.map((k) => {
        const group = links.filter((l) => l.kind === k);
        if (group.length === 0) return null;
        return (
          <div key={k} className="conn-group">
            <span className="conn-group-label">{LINK_GROUP_LABELS[k]}</span>
            {group.map((l) => (
              <span key={l.linkId} className="conn-chip">
                <button
                  type="button"
                  className="conn-chip-jump"
                  onClick={() => jumpToEntry(l.kind, l.id)}
                  title={`Go to ${l.label}`}
                >
                  {l.label}
                </button>
                <button
                  type="button"
                  className="conn-chip-x"
                  aria-label={`Unlink ${l.label}`}
                  disabled={busy}
                  onClick={() => remove(l.linkId)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        );
      })}
      {suggestions.length > 0 && (
        <div className="conn-suggest">
          <span className="conn-group-label">Suggested</span>
          {suggestions.map((t) => (
            <button
              key={linkKey(t.kind, t.id)}
              type="button"
              className="conn-suggest-chip"
              disabled={busy}
              onClick={() => add(linkKey(t.kind, t.id))}
              title={`Link ${LINK_LABELS[t.kind]}: ${t.label}`}
            >
              + {t.label}
            </button>
          ))}
        </div>
      )}
      {available.length > 0 && (
        <select
          className="conn-add"
          value=""
          disabled={busy}
          onChange={(e) => add(e.target.value)}
          aria-label="Add a connection"
        >
          <option value="">+ Link…</option>
          {LINK_KINDS.map((k) => {
            const opts = available.filter((t) => t.kind === k);
            if (opts.length === 0) return null;
            return (
              <optgroup key={k} label={LINK_GROUP_LABELS[k]}>
                {opts.map((t) => (
                  <option
                    key={linkKey(t.kind, t.id)}
                    value={linkKey(t.kind, t.id)}
                  >
                    {t.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      )}
      {msg && <span className="statusline">{msg}</span>}
    </div>
  );
}
