import { ImageResponse } from "next/og";

// Default social share card (code-rendered, not AI). Dark brand background with
// gold accent. metadataBase makes this the OG image for pages without their own.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI Story Generator — free AI tools for tabletop Game Masters";

export default function Image() {
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
          background:
            "radial-gradient(circle at 18% 0%, #3a2f12, transparent 60%), linear-gradient(180deg, #0f1020, #0b0c16)",
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
              background: "linear-gradient(135deg, #ffcb6b, #ffe8a3)",
            }}
          />
          <div style={{ fontSize: 30, color: "#b9b3a4" }}>
            aistorygenerator.work
          </div>
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -2,
            marginTop: 40,
            lineHeight: 1.05,
          }}
        >
          AI Story Generator
        </div>
        <div style={{ fontSize: 38, color: "#b9b3a4", marginTop: 24, maxWidth: 900 }}>
          Free AI tools for tabletop RPG Game Masters — generate, then save to a
          campaign your world remembers.
        </div>
      </div>
    ),
    { ...size },
  );
}
