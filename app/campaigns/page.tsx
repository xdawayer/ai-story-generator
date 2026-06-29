import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CampaignCard, type CampaignData } from "./campaign-card";

export const dynamic = "force-dynamic";

interface NpcRow {
  id: string;
  campaign_id: string;
  content: string;
}
interface CampaignRow {
  id: string;
  name: string;
  world_note: string;
}
interface SessionRow {
  id: string;
  campaign_id: string;
  notes: string;
  created_at: string;
}
interface StoryRow {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  created_at: string;
}
interface WorldRow {
  id: string;
  campaign_id: string;
  name: string;
  note: string;
}

export default async function CampaignsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="hero wrap">
        <h1>Campaigns</h1>
        <p className="lead">
          Saving NPCs to a persistent campaign isn&apos;t wired yet. Create a
          Supabase project, add the keys to <code>.env.local</code>, and run the
          migrations in <code>supabase/migrations/</code>. See the README setup
          steps.
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
        <p className="lead">
          No campaigns yet. Generate an NPC and hit{" "}
          <strong>Save to campaign</strong> to start a world.
        </p>
        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/npc-generator">→ Generate an NPC</Link>
        </p>
      </main>
    );
  }

  const worldSelect = "id,campaign_id,name,note";
  const [
    campaignsRes,
    npcsRes,
    sessionsRes,
    storiesRes,
    factionsRes,
    locationsRes,
    threadsRes,
  ] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id,name,world_note")
      .order("created_at", { ascending: false }),
    supabase
      .from("npcs")
      .select("id,campaign_id,content")
      .order("created_at", { ascending: false }),
    supabase
      .from("sessions")
      .select("id,campaign_id,notes,created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("stories")
      .select("id,campaign_id,title,content,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("factions").select(worldSelect).order("created_at"),
    supabase.from("locations").select(worldSelect).order("created_at"),
    supabase.from("plot_threads").select(worldSelect).order("created_at"),
  ]);

  const campaigns = (campaignsRes.data ?? []) as CampaignRow[];
  const npcs = (npcsRes.data ?? []) as NpcRow[];
  const sessions = (sessionsRes.data ?? []) as SessionRow[];
  const stories = (storiesRes.data ?? []) as StoryRow[];
  const factions = (factionsRes.data ?? []) as WorldRow[];
  const locations = (locationsRes.data ?? []) as WorldRow[];
  const threads = (threadsRes.data ?? []) as WorldRow[];

  const world = (rows: WorldRow[], id: string) =>
    rows
      .filter((r) => r.campaign_id === id)
      .map((r) => ({ id: r.id, name: r.name, note: r.note ?? "" }));

  const cards: CampaignData[] = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    world_note: c.world_note ?? "",
    npcs: npcs
      .filter((n) => n.campaign_id === c.id)
      .map((n) => ({ id: n.id, content: n.content })),
    sessions: sessions
      .filter((s) => s.campaign_id === c.id)
      .map((s) => ({ id: s.id, notes: s.notes, created_at: s.created_at })),
    stories: stories
      .filter((s) => s.campaign_id === c.id)
      .map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        created_at: s.created_at,
      })),
    factions: world(factions, c.id),
    locations: world(locations, c.id),
    plotThreads: world(threads, c.id),
  }));

  return (
    <main className="hero wrap">
      <h1>Your campaigns</h1>
      <p className="lead">
        Everything you save lives here — a world your tools remember across
        sessions.
      </p>

      {cards.length === 0 && (
        <p className="lead">
          No campaigns yet. <Link href="/npc-generator">Generate an NPC</Link>{" "}
          and save it.
        </p>
      )}

      <div style={{ marginTop: 18 }}>
        {cards.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      <p className="lead" style={{ fontSize: 14 }}>
        <Link href="/npc-generator">← Generate another NPC</Link>
      </p>
    </main>
  );
}
