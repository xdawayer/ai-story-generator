# AI Story Generator → RPG Campaign Companion

Free AI tools for tabletop RPG Game Masters. The free generators are the
top-of-funnel; the **saved campaign** (persistent NPCs, world, session log) is
the product and the moat. Built with Next.js 16 + Azure OpenAI + Supabase.

**Live site:** https://aistorygenerator.work

## Live tools (free, no login)
- `/ai-story-generator` — broad story tool, kept as the primary head-term SEO funnel
- `/npc-generator` — flagship; generates an NPC and saves it to a campaign
- `/character-backstory`, `/dnd-name-generator`, `/tavern-name-generator`

## Campaign workspace (`/campaigns`)
- World/setting note per campaign (the bible every generation grounds in)
- Persistent NPC list
- Session log v0 (log what happened each session)
- Grounded **recap** generation ("previously on…", built from world + NPCs + sessions)
- Markdown export of a whole campaign

## Local setup
1. `cp .env.example .env.local` and fill in the **Azure OpenAI** values
   (copy from `gengrowth-agents/.env.local`). The provider is Azure OpenAI, not Anthropic.
2. (Optional, for saving) Set up Supabase — see below.
3. `npm install && npm run dev`

The app runs fully without Supabase — only campaign saving is disabled until it's configured.

## Supabase setup (enables the campaign workspace)

The free tier caps you at **2 active projects per account** (across all orgs),
so instead of a new project this app **shares an existing Supabase project**,
isolated in its own `storygen` schema. Pick the host project, then:

1. **Authentication → Sign In / Providers → enable "Anonymous sign-ins".**
   This is project-wide — first confirm the host project's other tables all have
   correct RLS, so anonymous users can't reach them.
2. **Settings → API → Exposed schemas → add `storygen`** (so PostgREST serves it).
3. Apply both migrations in order (via `supabase db push`, or paste into the SQL editor):
   - `supabase/migrations/20260629000001_init.sql` (creates `storygen` schema + campaigns + npcs + RLS)
   - `supabase/migrations/20260629000002_sessions.sql` (session log + RLS)
4. Add the **host project's** keys to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Restart `npm run dev`, generate an NPC, hit **Save to campaign**, then open
   `/campaigns` to verify the world note, session log, recap, and export.

Service-role key is **not** needed — the app uses anon auth + Row Level Security.
This sharing is deliberate early-stage infra debt; migrate to a dedicated
project/DB once the app gets traction or the deployment target is fixed.

## Docs (local-only, not pushed)
- `docs/PLAN-rpg.md` — current strategy (RPG wedge)
- `docs/REVIEW.md` — multi-perspective review that drove the reframe
- `docs/PRD.md` — original head-term PRD (superseded, kept for reference)
