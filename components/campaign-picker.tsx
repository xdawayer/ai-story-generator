"use client";

// Optional "ground this generation in one of your campaigns" selector. Fetches
// the user's campaigns client-side (RLS scopes to them); hidden when they have
// none. Emits the chosen campaign's world note so the tool can feed it to the
// model as grounding context — the moat a generic chatbot can't match.
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CampaignLite {
  id: string;
  name: string;
  world_note: string;
}

export function CampaignPicker({
  onSelect,
}: {
  onSelect: (worldNote: string) => void;
}) {
  const [campaigns, setCampaigns] = useState<CampaignLite[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("campaigns")
      .select("id,name,world_note")
      .then(({ data }) => setCampaigns((data as CampaignLite[]) ?? []));
  }, []);

  if (campaigns.length === 0) return null;

  return (
    <div className="field">
      <label htmlFor="ground">Ground in a campaign (optional)</label>
      <select
        id="ground"
        defaultValue=""
        onChange={(e) => {
          const c = campaigns.find((x) => x.id === e.target.value);
          onSelect(c?.world_note?.trim() ?? "");
        }}
      >
        <option value="">None — generic</option>
        {campaigns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
