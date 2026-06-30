-- Guarantee the link_redirects destination is locked to aigenerator.work.
--
-- Context: this project already had a bare `link_redirects` table (table + index present,
-- but no RLS policy / trigger) created out-of-band before the 20260630000000 migration.
-- Because that migration uses CREATE TABLE IF NOT EXISTS, its inline destination CHECK was
-- skipped on the pre-existing table. This migration enforces the correct constraint
-- explicitly so aigenerator.work destinations are accepted and any other host is rejected,
-- regardless of how the table was originally created.
--
-- NOT VALID: only validates rows inserted/updated after this point, so it never fails on
-- pre-existing legacy rows (the registration API only ever writes aigenerator.work anyway).

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_url_check;

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_aigenerator_chk;

ALTER TABLE public.link_redirects
  ADD CONSTRAINT link_redirects_destination_aigenerator_chk
  CHECK (destination_url ~ '^https://(www\.)?aigenerator\.work(/|$|\?)') NOT VALID;
