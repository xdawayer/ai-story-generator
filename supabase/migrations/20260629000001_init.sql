-- Campaign persistence for the Game Master workspace (the moat).
-- This app SHARES an existing Supabase project, isolated in its own `storygen`
-- schema so its tables never collide with the host project's. RLS still scopes
-- every row to its owner. Anonymous Supabase Auth gives each guest a stable
-- auth.uid().
--
-- REQUIRED in the host project's dashboard:
--   1. Authentication → Sign In / Providers → enable "Anonymous sign-ins".
--   2. Settings → API → Exposed schemas → add `storygen` (so PostgREST serves it).

create schema if not exists storygen;
grant usage on schema storygen to anon, authenticated;
-- Future tables in this schema (e.g. migration 0002) inherit table grants.
alter default privileges in schema storygen grant all on tables to anon, authenticated;

create extension if not exists pgcrypto;

create table if not exists storygen.campaigns (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  world_note  text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists storygen.npcs (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references storygen.campaigns (id) on delete cascade,
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  content      text not null,
  inputs       jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists npcs_campaign_idx on storygen.npcs (campaign_id);
create unique index if not exists campaigns_owner_name_idx on storygen.campaigns (owner, name);

alter table storygen.campaigns enable row level security;
alter table storygen.npcs enable row level security;

-- Owner-only access. The `owner` columns default to auth.uid() on insert, so
-- clients never pass it; the WITH CHECK still enforces it.
drop policy if exists "own campaigns" on storygen.campaigns;
create policy "own campaigns" on storygen.campaigns
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists "own npcs" on storygen.npcs;
create policy "own npcs" on storygen.npcs
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

-- Table-level access for the API roles (RLS still enforces row ownership).
grant all on storygen.campaigns, storygen.npcs to anon, authenticated;
