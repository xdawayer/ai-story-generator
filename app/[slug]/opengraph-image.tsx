import { ImageResponse } from "next/og";
import { STORY_GENRES, getStoryGenre } from "@/lib/story-genres";

// Per-genre social card, themed by the genre accent (code-rendered, not AI).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Story Generator";

export function generateStaticParams() {
  return STORY_GENRES.map((g) => ({ slug: g.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getStoryGenre(slug);
  const accent = g?.accent ?? "#ffcb6b";
  const title = g?.h1 ?? "Story Generator";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: `radial-gradient(circle at 18% 0%, ${accent}33, transparent 60%), linear-gradient(180deg, #0f1020, #0b0c16)`,
          color: "#f7f3e8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: accent,
            }}
          />
          <div style={{ fontSize: 30, color: "#b9b3a4" }}>
            aistorygenerator.work
          </div>
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            marginTop: 40,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 36, color: "#b9b3a4", marginTop: 24 }}>
          Free · no login · then build it into a campaign
        </div>
      </div>
    ),
    { ...size },
  );
}
