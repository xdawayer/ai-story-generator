-- Domain correction: the AI Story Generator app is served at aistorygenerator.work
-- (not aigenerator.work, which is an unrelated third-party service). The earlier
-- 20260630000001 migration locked destinations to aigenerator.work; replace that
-- constraint so the registration API can store aistorygenerator.work destinations.
--
-- NOT VALID: enforce on new rows only, never fail on any pre-existing legacy rows.

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_aigenerator_chk;

ALTER TABLE public.link_redirects
  DROP CONSTRAINT IF EXISTS link_redirects_destination_aistorygenerator_chk;

ALTER TABLE public.link_redirects
  ADD CONSTRAINT link_redirects_destination_aistorygenerator_chk
  CHECK (destination_url ~ '^https://(www\.)?aistorygenerator\.work(/|$|\?)') NOT VALID;
