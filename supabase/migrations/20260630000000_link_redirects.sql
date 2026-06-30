-- AI Story Generator (aigenerator.work) owned short-link mappings for link attribution tools.
-- Mirrors the gengrowth-agents link_redirects schema; destination is locked to aigenerator.work.
CREATE TABLE IF NOT EXISTS public.link_redirects (
  code TEXT PRIMARY KEY CHECK (code ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  destination_url TEXT NOT NULL CHECK (
    destination_url ~ '^https://(www\.)?aigenerator\.work(/|$|\?)'
  ),
  redirect_status SMALLINT NOT NULL DEFAULT 302 CHECK (redirect_status = 302),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_link_redirects_created_at
  ON public.link_redirects (created_at DESC);

CREATE OR REPLACE FUNCTION public.update_link_redirects_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS link_redirects_updated_at ON public.link_redirects;
CREATE TRIGGER link_redirects_updated_at
  BEFORE UPDATE ON public.link_redirects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_link_redirects_updated_at();

ALTER TABLE public.link_redirects ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.link_redirects FROM anon, authenticated;

DROP POLICY IF EXISTS service_role_manage_link_redirects ON public.link_redirects;
CREATE POLICY service_role_manage_link_redirects
  ON public.link_redirects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
