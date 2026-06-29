import type { Metadata } from "next";
import { StoryPage, type Faq } from "@/components/story-page";

// SEO flagship: "ai story generator" is a primary head-term funnel into the RPG
// campaign product. Server component so it can export real per-page metadata
// (the client tool lives in ./story-generator.tsx).
export const metadata: Metadata = {
  title: "AI Story Generator — Free, No Login",
  description:
    "Free AI story generator. Turn any idea into an original short story in seconds — pick a genre and tone, no sign-up. Then bring your story into a tabletop campaign.",
  keywords: [
    "ai story generator",
    "free story generator",
    "short story generator",
    "ai story writer",
    "story idea generator",
  ],
  alternates: { canonical: "/ai-story-generator" },
  openGraph: {
    title: "AI Story Generator — Free, No Login",
    description:
      "Turn any idea into an original short story in seconds. Free, no sign-up.",
    type: "website",
  },
};

const FAQ: Faq[] = [
  {
    q: "Is the AI story generator free?",
    a: "Yes. Generating a story is free and needs no account. You can copy or download the result instantly. Saving stories and characters into a persistent campaign is the optional next step.",
  },
  {
    q: "Who owns the stories I generate?",
    a: "You do. Output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises, but always review before publishing commercially.",
  },
  {
    q: "How long are the stories?",
    a: "Choose Flash (≈150-250 words), a single Scene, or a Short story (≈400-700 words). Use Continue to extend any story beat by beat.",
  },
  {
    q: "Can I use it for Dungeons & Dragons or other tabletop RPGs?",
    a: "Absolutely — that's the point. Generate a story, then pull its characters out as NPCs and save them to a campaign your other tools remember.",
  },
];

export default function AiStoryGeneratorPage() {
  return (
    <StoryPage
      eyebrow="Free AI Story Generator · no login"
      h1="AI Story Generator"
      illustration="/illustrations/hero-home.jpg"
      lead="Turn any idea into an original short story in seconds. Pick a genre and tone, or leave it blank and let the AI surprise you — no sign-up, copy or download the result instantly."
      faqs={FAQ}
      intro={
        <>
          <h2>How the AI story generator works</h2>
          <p className="lead">
            Describe a premise (or skip it), choose a genre, tone, and length,
            then hit generate. The story streams in as it&apos;s written, so you
            see the opening lines immediately. Hit <strong>Continue</strong> to
            extend it, <strong>Regenerate</strong> for a fresh take, or{" "}
            <strong>Download</strong> it as Markdown.
          </p>
        </>
      }
    />
  );
}
