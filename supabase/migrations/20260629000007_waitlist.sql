-- Pro waitlist (no payment yet). Anyone may add their email; the API role can
-- only INSERT — never read/update/delete — so the list isn't enumerable. Lives
-- in the shared `storygen` schema.

create table if not exists storygen.waitlist (
  email       text primary key,
  created_at  timestamptz not null default now()
);

alter table storygen.waitlist enable row level security;

drop policy if exists "insert waitlist" on storygen.waitlist;
create policy "insert waitlist" on storygen.waitlist
  for insert to anon, authenticated with check (true);

grant insert on storygen.waitlist to anon, authenticated;
