-- Structured world-building for the campaign workspace (deepens the moat):
-- factions, locations, and plot threads. Three identical tables, each a named
-- entry with a free-text note, scoped to a campaign and its owner via RLS.

create table if not exists storygen.factions (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references storygen.campaigns (id) on delete cascade,
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  note        text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists storygen.locations (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references storygen.campaigns (id) on delete cascade,
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  note        text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists storygen.plot_threads (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references storygen.campaigns (id) on delete cascade,
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  note        text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists factions_campaign_idx on storygen.factions (campaign_id, created_at);
create index if not exists locations_campaign_idx on storygen.locations (campaign_id, created_at);
create index if not exists plot_threads_campaign_idx on storygen.plot_threads (campaign_id, created_at);

alter table storygen.factions enable row level security;
alter table storygen.locations enable row level security;
alter table storygen.plot_threads enable row level security;

drop policy if exists "own factions" on storygen.factions;
create policy "own factions" on storygen.factions
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists "own locations" on storygen.locations;
create policy "own locations" on storygen.locations
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists "own plot_threads" on storygen.plot_threads;
create policy "own plot_threads" on storygen.plot_threads
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

grant all on storygen.factions, storygen.locations, storygen.plot_threads
  to anon, authenticated;
