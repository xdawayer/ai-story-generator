-- Saved stories for the AI Story Generator funnel. A generated story can be kept
-- inside a campaign (the moat: a world the user returns to), alongside its NPCs
-- and session log. Run AFTER 0001_init.sql. Lives in the shared-but-isolated
-- `storygen` schema. RLS scopes every row to its anonymous owner.

create table if not exists storygen.stories (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references storygen.campaigns (id) on delete cascade,
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title        text not null default '',
  content      text not null,
  inputs       jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists stories_campaign_idx on storygen.stories (campaign_id, created_at desc);

alter table storygen.stories enable row level security;

drop policy if exists "own stories" on storygen.stories;
create policy "own stories" on storygen.stories
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

grant all on storygen.stories to anon, authenticated;
