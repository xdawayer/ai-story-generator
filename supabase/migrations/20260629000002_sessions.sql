-- Session log v0 for the campaign workspace. Each row is one play-session the
-- Game Master logs (what happened). Recaps are generated on demand from these
-- notes + the world note + saved NPCs, so they are not stored here in v0.
-- Run AFTER 0001_init.sql. Lives in the shared-but-isolated `storygen` schema.
-- RLS scopes every row to its anonymous owner.

create table if not exists storygen.sessions (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references storygen.campaigns (id) on delete cascade,
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  notes        text not null,
  created_at   timestamptz not null default now()
);

create index if not exists sessions_campaign_idx on storygen.sessions (campaign_id, created_at desc);

alter table storygen.sessions enable row level security;

drop policy if exists "own sessions" on storygen.sessions;
create policy "own sessions" on storygen.sessions
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

grant all on storygen.sessions to anon, authenticated;
