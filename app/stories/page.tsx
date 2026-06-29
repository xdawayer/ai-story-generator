import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StoryList, type StoryItem } from "./story-list";

export const dynamic = "force-dynamic";

interface StoryRow {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  created_at: string;
}
interface CampaignRow {
  id: string;
  name: string;
}

export default async function StoriesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="hero wrap">
        <h1>Your stories</h1>
        <p className="lead">
          Saving stories isn&apos;t wired yet. Add Supabase keys to{" "}
          <code>.env.local</code> and run the migrations in{" "}
          <code>supabase/migrations/</code>.
        </p>
        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/ai-story-generator">← Back to the Story Generator</Link>
        </p>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <main className="hero wrap">
        <h1>Your stories</h1>
        <p className="lead">
          No stories yet. Generate one and hit <strong>Save story</strong> to
          keep it.
        </p>
        <p className="lead" style={{ fontSize: 14 }}>
          <Link href="/ai-story-generator">→ Generate a story</Link>
        </p>
      </main>
    );
  }

  const [storiesRes, campaignsRes] = await Promise.all([
    supabase
      .from("stories")
      .select("id,campaign_id,title,content,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("campaigns").select("id,name"),
  ]);

  const stories = (storiesRes.data ?? []) as StoryRow[];
  const campaigns = (campaignsRes.data ?? []) as CampaignRow[];
  const nameById = new Map(campaigns.map((c) => [c.id, c.name]));

  const items: StoryItem[] = stories.map((s) => ({
    id: s.id,
    title: s.title || "Untitled story",
    content: s.content,
    campaignName: nameById.get(s.campaign_id) ?? "Campaign",
    created_at: s.created_at,
  }));

  return (
    <main className="hero wrap">
      <h1>Your stories</h1>
      <p className="lead">
        Every story you save lives here — read it, download it, or open its
        campaign.
      </p>

      {items.length === 0 ? (
        <p className="lead">
          No stories yet.{" "}
          <Link href="/ai-story-generator">Generate one</Link> and save it.
        </p>
      ) : (
        <StoryList stories={items} />
      )}

      <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
        <Link href="/ai-story-generator">← Generate another story</Link> ·{" "}
        <Link href="/campaigns">Your campaigns</Link>
      </p>
    </main>
  );
}
