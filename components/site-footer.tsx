// Global footer rendered on every page (from the root layout). Mirrors the site
// IA — Story Generators and RPG Tools hubs with their children — and carries the
// company + legal links (About, Pricing, Blog, Privacy, Terms). Server component.
import Link from "next/link";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";
import { RPG_TOOLS, rpgToolPath } from "@/lib/rpg-tools";

// Keep the footer columns scannable: link the hub + a handful of top children.
const TOP_GENRES = STORY_GENRES.slice(0, 5);
const TOP_TOOLS = RPG_TOOLS.slice(0, 5);

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>
              <Link href="/story-generators">Story Generators</Link>
            </h4>
            <ul>
              {TOP_GENRES.map((g) => (
                <li key={g.slug}>
                  <Link href={genrePath(g.slug)}>{g.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/long-story-generator">Long Story</Link>
              </li>
              <li>
                <Link href="/story-generators/prompts">Story Prompts</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>
              <Link href="/rpg-tools">RPG Tools</Link>
            </h4>
            <ul>
              {TOP_TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link href={rpgToolPath(t.slug)}>{t.nav}</Link>
                </li>
              ))}
              <li>
                <Link href="/rpg-tools/quest-hook-generator">Quests</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Workspace</h4>
            <ul>
              <li>
                <Link href="/campaigns">Campaigns</Link>
              </li>
              <li>
                <Link href="/stories">Stories</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/login">Sign in</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <span>
            © {new Date().getFullYear()} AI Story Generator. Free AI tools for
            tabletop Game Masters.
          </span>
        </div>
      </div>
    </footer>
  );
}
