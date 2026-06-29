"use client";

// One structured world-building section (factions / locations / plot threads):
// list with inline delete + an add form. Reused 3x in the campaign card.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addWorldEntryAction, deleteWorldEntryAction } from "@/app/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { WORLD_LABELS, type WorldKind } from "@/lib/world-kinds";

export interface WorldEntry {
  id: string;
  name: string;
  note: string;
}

export function WorldSection({
  campaignId,
  kind,
  items,
}: {
  campaignId: string;
  kind: WorldKind;
  items: WorldEntry[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const { title, placeholder } = WORLD_LABELS[kind];

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
    <>
      <h4 style={{ margin: "18px 0 6px" }}>{title}</h4>
      {items.length === 0 ? (
        <p className="empty">Nothing here yet.</p>
      ) : (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          {items.map((it) => (
            <li key={it.id}>
              <strong>{it.name}</strong>
              {it.note ? ` — ${it.note}` : ""}{" "}
              <ConfirmButton
                label="✕"
                confirmLabel="Delete?"
                onConfirm={async () => {
                  await deleteWorldEntryAction(kind, it.id);
                  router.refresh();
                }}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="row2" style={{ marginTop: 8 }}>
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
    </>
  );
}
