"use client";

// One structured world-building section (factions / locations / plot threads):
// a counted, collapsible section of block cards (name on its own line, note as a
// readable block beneath — not a cramped inline run-on) plus an add form.
// Reused 3x in the campaign card.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addWorldEntryAction, deleteWorldEntryAction } from "@/app/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { WORLD_LABELS, type WorldKind } from "@/lib/world-kinds";
import {
  WORLD_KIND_TO_LINK,
  type LinkRef,
  type LinkTarget,
} from "@/lib/link-kinds";
import { Section } from "./section";
import { Connections } from "./connections";

export interface WorldEntry {
  id: string;
  name: string;
  note: string;
  links: LinkRef[];
}

export function WorldSection({
  campaignId,
  kind,
  items,
  targets,
}: {
  campaignId: string;
  kind: WorldKind;
  items: WorldEntry[];
  targets: LinkTarget[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const { title, placeholder } = WORLD_LABELS[kind];
  const linkKind = WORLD_KIND_TO_LINK[kind];

  async function add() {
    if (!name.trim()) return;
    setBusy(true);
    setMsg("");
    const res = await addWorldEntryAction(kind, campaignId, name, note);
    setBusy(false);
    if (res.ok) {
      setName("");
      setNote("");
      router.refresh();
    } else {
      setMsg(res.error ?? "Could not add.");
    }
  }

  return (
    <Section title={title} count={items.length}>
      {items.length === 0 ? (
        <p className="empty">Nothing here yet.</p>
      ) : (
        <div className="world-list">
          {items.map((it) => (
            <div
              key={it.id}
              className="world-entry"
              id={`entry-${linkKind}-${it.id}`}
            >
              <div className="world-entry-head">
                <strong className="world-entry-name">{it.name}</strong>
                <ConfirmButton
                  label="✕"
                  confirmLabel="Delete?"
                  onConfirm={async () => {
                    await deleteWorldEntryAction(kind, it.id);
                    router.refresh();
                  }}
                />
              </div>
              {it.note && <p className="world-entry-note">{it.note}</p>}
              <Connections
                campaignId={campaignId}
                node={{ kind: linkKind, id: it.id }}
                links={it.links}
                targets={targets}
              />
            </div>
          ))}
        </div>
      )}
      <div className="row2" style={{ marginTop: 10 }}>
        <input
          value={name}
          maxLength={120}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          value={note}
          maxLength={2000}
          placeholder={placeholder}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="actions">
        <button
          className="ghost"
          type="button"
          onClick={add}
          disabled={busy || !name.trim()}
        >
          {busy ? "Adding…" : "Add"}
        </button>
        {msg && <span className="statusline">{msg}</span>}
      </div>
    </Section>
  );
}
