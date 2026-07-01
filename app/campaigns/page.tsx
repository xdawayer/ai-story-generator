import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  isLinkKind,
  linkKey,
  type LinkKind,
  type LinkEdge,
  type LinkRef,
  type LinkTarget,
} from "@/lib/link-kinds";
import { CampaignCard, type CampaignData } from "./campaign-card";

export const dynamic = "force-dynamic";

// Personal workspace page: thin/empty for logged-out crawlers and excluded from
// the sitemap. Keep it out of the index but let crawlers follow its links.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

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
interface LinkRow {
  id: string;
  campaign_id: string;
  a_kind: string;
  a_id: string;
  b_kind: string;
  b_id: string;
}

// First non-empty line of Markdown content, stripped of heading markers — the
// human label for an NPC or story in the links graph.
function firstLineLabel(content: string, fallback: string): string {
  const line = content.split("\n").find((l) => l.trim().length > 0) ?? fallback;
  return (
    line
      .replace(/^#+\s*/, "")
      .trim()
      .slice(0, 80) || fallback
  );
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
          <Link href="/rpg-tools/npc-generator">
            ← Back to the NPC Generator
          </Link>
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
          <Link href="/rpg-tools/npc-generator">→ Generate an NPC</Link>
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
    linksRes,
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
    supabase.from("links").select("id,campaign_id,a_kind,a_id,b_kind,b_id"),
  ]);

  const campaigns = (campaignsRes.data ?? []) as CampaignRow[];
  const npcs = (npcsRes.data ?? []) as NpcRow[];
  const sessions = (sessionsRes.data ?? []) as SessionRow[];
  const stories = (storiesRes.data ?? []) as StoryRow[];
  const factions = (factionsRes.data ?? []) as WorldRow[];
  const locations = (locationsRes.data ?? []) as WorldRow[];
  const threads = (threadsRes.data ?? []) as WorldRow[];
  const linkRows = (linksRes.data ?? []) as LinkRow[];

  const world = (rows: WorldRow[], id: string) =>
    rows
      .filter((r) => r.campaign_id === id)
      .map((r) => ({ id: r.id, name: r.name, note: r.note ?? "" }));

  const cards: CampaignData[] = campaigns.map((c) => {
    const cNpcs = npcs
      .filter((n) => n.campaign_id === c.id)
      .map((n) => ({ id: n.id, content: n.content }));
    const cStories = stories
      .filter((s) => s.campaign_id === c.id)
      .map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        created_at: s.created_at,
      }));
    const cFactions = world(factions, c.id);
    const cLocations = world(locations, c.id);
    const cThreads = world(threads, c.id);

    // Label index + picker targets for every linkable entity in this campaign.
    const labelOf = new Map<string, string>();
    const targets: LinkTarget[] = [];
    const addTarget = (kind: LinkKind, id: string, label: string) => {
      labelOf.set(linkKey(kind, id), label);
      targets.push({ kind, id, label });
    };
    cNpcs.forEach((n) =>
      addTarget("npc", n.id, firstLineLabel(n.content, "NPC")),
    );
    cStories.forEach((s) =>
      addTarget("story", s.id, s.title || "Untitled story"),
    );
    cFactions.forEach((f) => addTarget("faction", f.id, f.name));
    cLocations.forEach((l) => addTarget("location", l.id, l.name));
    cThreads.forEach((t) => addTarget("plot_thread", t.id, t.name));

    // Resolve links undirected: each row gives both endpoints a ref to the
    // other. Drop any link whose endpoints no longer resolve (orphan filter).
    // The same non-orphan rows also become the edge list for the map view.
    const linksByKey = new Map<string, LinkRef[]>();
    const edges: LinkEdge[] = [];
    const push = (key: string, ref: LinkRef) => {
      const arr = linksByKey.get(key) ?? [];
      arr.push(ref);
      linksByKey.set(key, arr);
    };
    for (const row of linkRows) {
      if (row.campaign_id !== c.id) continue;
      if (!isLinkKind(row.a_kind) || !isLinkKind(row.b_kind)) continue;
      const aKey = linkKey(row.a_kind, row.a_id);
      const bKey = linkKey(row.b_kind, row.b_id);
      const aLabel = labelOf.get(aKey);
      const bLabel = labelOf.get(bKey);
      if (aLabel === undefined || bLabel === undefined) continue;
      push(aKey, {
        linkId: row.id,
        kind: row.b_kind,
        id: row.b_id,
        label: bLabel,
      });
      push(bKey, {
        linkId: row.id,
        kind: row.a_kind,
        id: row.a_id,
        label: aLabel,
      });
      edges.push({
        id: row.id,
        aKind: row.a_kind,
        aId: row.a_id,
        bKind: row.b_kind,
        bId: row.b_id,
      });
    }
    const linksFor = (kind: LinkKind, id: string): LinkRef[] =>
      linksByKey.get(linkKey(kind, id)) ?? [];

    return {
      id: c.id,
      name: c.name,
      world_note: c.world_note ?? "",
      npcs: cNpcs.map((n) => ({ ...n, links: linksFor("npc", n.id) })),
      sessions: sessions
        .filter((s) => s.campaign_id === c.id)
        .map((s) => ({ id: s.id, notes: s.notes, created_at: s.created_at })),
      stories: cStories.map((s) => ({ ...s, links: linksFor("story", s.id) })),
      factions: cFactions.map((f) => ({
        ...f,
        links: linksFor("faction", f.id),
      })),
      locations: cLocations.map((l) => ({
        ...l,
        links: linksFor("location", l.id),
      })),
      plotThreads: cThreads.map((t) => ({
        ...t,
        links: linksFor("plot_thread", t.id),
      })),
      linkTargets: targets,
      linkEdges: edges,
    };
  });

  return (
    <main className="hero wrap">
      <h1>Your campaigns</h1>
      <p className="lead">
        Everything you save lives here — a world your tools remember across
        sessions.
      </p>

      {cards.length === 0 && (
        <p className="lead">
          No campaigns yet.{" "}
          <Link href="/rpg-tools/npc-generator">Generate an NPC</Link> and save
          it.
        </p>
      )}

      <div style={{ marginTop: 18 }}>
        {cards.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      <p className="lead" style={{ fontSize: 14 }}>
        <Link href="/rpg-tools/npc-generator">← Generate another NPC</Link>
      </p>
    </main>
  );
}
