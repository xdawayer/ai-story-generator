-- Campaign persistence for the Game Master workspace (the moat).
-- Anonymous Supabase Auth gives each guest a stable auth.uid(), so RLS scopes
-- every row to its owner. REQUIRED: enable "Anonymous sign-ins" in
-- Supabase → Authentication → Sign In / Providers.

create extension if not exists pgcrypto;

create table if not exists public.campaigns (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  world_note  text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.npcs (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references public.campaigns (id) on delete cascade,
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  content      text not null,
  inputs       jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists npcs_campaign_idx on public.npcs (campaign_id);
create unique index if not exists campaigns_owner_name_idx on public.campaigns (owner, name);

alter table public.campaigns enable row level security;
alter table public.npcs enable row level security;

-- Owner-only access. The `owner` columns default to auth.uid() on insert, so
-- clients never pass it; the WITH CHECK still enforces it.
drop policy if exists "own campaigns" on public.campaigns;
create policy "own campaigns" on public.campaigns
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists "own npcs" on public.npcs;
create policy "own npcs" on public.npcs
  for all using (auth.uid() = owner) with check (auth.uid() = owner);
