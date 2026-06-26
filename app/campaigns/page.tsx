import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface NpcRow {
  id: string;
  campaign_id: string;
  content: string;
  created_at: string;
}
interface CampaignRow {
  id: string;
  name: string;
  created_at: string;
}

function npcTitle(content: string): string {
  const firstLine = content.split("\n").find((l) => l.trim().length > 0) ?? "NPC";
  return firstLine.replace(/^#+\s*/, "").trim().slice(0, 90) || "NPC";
}

export default async function CampaignsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="hero wrap">
        <h1>Campaigns</h1>
        <p className="lead">
          Saving NPCs to a persistent campaign isn&apos;t wired yet. Create a Supabase project,
          add the keys to <code>.env.local</code>, and run <code>supabase/migrations/0001_init.sql</code>.
          See the README setup steps.
        </p>
        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/npc-generator">← Back to the NPC Generator</Link>
        </p>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <main className="hero wrap">
        <h1>Your campaigns</h1>
        <p className="lead">No campaigns yet. Generate an NPC and hit <strong>Save to campaign</strong> to start a world.</p>
        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/npc-generator">→ Generate an NPC</Link>
        </p>
      </main>
    );
  }

  const campaignsRes = await supabase
    .from("campaigns")
    .select("id,name,created_at")
    .order("created_at", { ascending: false });
  const npcsRes = await supabase
    .from("npcs")
    .select("id,campaign_id,content,created_at")
    .order("created_at", { ascending: false });

  const campaigns = (campaignsRes.data ?? []) as CampaignRow[];
  const npcs = (npcsRes.data ?? []) as NpcRow[];

  return (
    <main className="hero wrap">
      <h1>Your campaigns</h1>
      <p className="lead">
        Everything you save lives here — a world your tools remember across sessions.
      </p>

      {campaigns.length === 0 && (
        <p className="lead">
          No campaigns yet. <Link href="/npc-generator">Generate an NPC</Link> and save it.
        </p>
      )}

      <div style={{ marginTop: 18 }}>
        {campaigns.map((c) => {
          const mine = npcs.filter((n) => n.campaign_id === c.id);
          return (
            <div className="panel" key={c.id} style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 10px" }}>{c.name}</h3>
              {mine.length === 0 ? (
                <p className="empty">No NPCs saved here yet.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.7 }}>
                  {mine.map((n) => (
                    <li key={n.id}>{npcTitle(n.content)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="lead" style={{ fontSize: 14 }}>
        <Link href="/npc-generator">← Generate another NPC</Link>
      </p>
    </main>
  );
}
