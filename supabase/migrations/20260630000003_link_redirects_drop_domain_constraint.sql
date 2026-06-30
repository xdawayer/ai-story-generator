-- The link_redirects table in this Supabase project (snpkanwonccndjtvjmvh) is SHARED by
-- multiple apps: aistorygenerator.work (this repo, via Supabase) and astrologywiki.com
-- (the oracle backend, which points SUPABASE_URL at the same project).
--
-- Migration 20260630000002 locked the destination to aistorygenerator.work. On a shared
-- table that broke astrologywiki.com short-link inserts (the oracle API got an insert error
-- and returned storage_unconfigured / 503). Destination domain is already validated at the
-- application layer in BOTH apps, so the DB-level single-domain constraint is wrong here.
--
-- Drop the domain constraint to restore multi-tenant writes (back to the table's original,
-- pre-20260630000001 state).

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_aistorygenerator_chk;

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_aigenerator_chk;

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_url_check;
