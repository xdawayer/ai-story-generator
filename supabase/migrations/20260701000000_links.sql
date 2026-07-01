-- World-links: the grounded-world graph for the campaign workspace (the moat).
-- One generic, UNDIRECTED edge table connecting any two campaign entities
-- (npc / location / faction / plot_thread / story). Storing the pair
-- canonically (smaller "kind:id" always in the a_* columns) + a unique
-- constraint means an A<->B link is one row, never duplicated per direction.
--
-- a_id / b_id are polymorphic (no single FK can target five tables), so per-row
-- referential integrity is handled in app code: entity deletes purge links that
-- reference them, and the read path drops any link whose endpoints no longer
-- resolve. Deleting a whole campaign still cascades its links via campaign_id.

create table if not exists storygen.links (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references storygen.campaigns (id) on delete cascade,
  owner       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  a_kind      text not null check (a_kind in ('npc','location','faction','plot_thread','story')),
  a_id        uuid not null,
  b_kind      text not null check (b_kind in ('npc','location','faction','plot_thread','story')),
  b_id        uuid not null,
  created_at  timestamptz not null default now(),
  unique (owner, a_kind, a_id, b_kind, b_id)
);

create index if not exists links_campaign_idx on storygen.links (campaign_id);
create index if not exists links_a_idx on storygen.links (a_id);
create index if not exists links_b_idx on storygen.links (b_id);

alter table storygen.links enable row level security;

drop policy if exists "own links" on storygen.links;
create policy "own links" on storygen.links
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

grant all on storygen.links to anon, authenticated;
