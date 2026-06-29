import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryPage, type Faq } from "@/components/story-page";
import { STORY_GENRES, getStoryGenre } from "@/lib/story-genres";

// Programmatic SEO: one page per genre in lib/story-genres.ts (e.g.
// /fantasy-story-generator). Only the whitelisted slugs render — every other
// top-level path that has no static route falls through to a 404
// (dynamicParams = false). Static routes (/campaigns, /npc-generator, …) still
// take precedence over this dynamic segment.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return STORY_GENRES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getStoryGenre(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: `/${g.slug}` },
    openGraph: { title: g.title, description: g.description, type: "website" },
  };
}

function faqFor(label: string): Faq[] {
  return [
    {
      q: `Is the ${label.toLowerCase()} story generator free?`,
      a: "Yes — generating is free and needs no account. Copy or download the result instantly. Saving it into a persistent campaign is the optional next step.",
    },
    {
      q: "Who owns the stories I generate?",
      a: "You do. Output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises, but always review before publishing commercially.",
    },
    {
      q: "Can I make the story longer?",
      a: "Yes. Pick Short, Flash, or Scene, then use Continue to extend the story beat by beat for as long as you like.",
    },
    {
      q: "Can I use it for tabletop RPGs?",
      a: "Absolutely. Generate a story, then pull its characters out as ready-to-run NPCs and save them to a campaign your other tools remember.",
    },
  ];
}

export default async function GenreStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getStoryGenre(slug);
  if (!g) notFound();

  return (
    <StoryPage
      eyebrow={`Free ${g.label} Story Generator · no login`}
      h1={g.h1}
      lead={g.lead}
      lockedGenre={g.genre}
      currentSlug={g.slug}
      faqs={faqFor(g.label)}
      intro={
        <>
          <h2>How the {g.label.toLowerCase()} story generator works</h2>
          <p className="lead">{g.blurb}</p>
          <p className="lead">
            Add an idea or leave it blank, set a tone and length, then generate.
            The story streams in as it&apos;s written. Hit <strong>Continue</strong>{" "}
            to extend it, <strong>Regenerate</strong> for a fresh take, or{" "}
            <strong>Download</strong> it as Markdown.
          </p>
        </>
      }
    />
  );
}
