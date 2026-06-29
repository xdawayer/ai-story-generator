-- User profiles: carries the subscription tier (free | pro) and email. One row
-- per auth user (anonymous or real), id = auth.uid(). Lazily upserted on first
-- sign-in / save. Lives in the shared-but-isolated `storygen` schema; RLS scopes
-- each row to its owner.

create table if not exists storygen.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  tier        text not null default 'free',
  created_at  timestamptz not null default now()
);

alter table storygen.profiles enable row level security;

drop policy if exists "own profile" on storygen.profiles;
create policy "own profile" on storygen.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

grant all on storygen.profiles to anon, authenticated;
