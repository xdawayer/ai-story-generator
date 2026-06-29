// Client-side file download helpers shared by the story tools and the campaign
// workspace. Plain functions (call only from client components — they touch
// `document` and `URL`).

export function downloadText(
  filename: string,
  text: string,
  mime = "text/markdown;charset=utf-8",
): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Turn an arbitrary title into a safe, lowercase filename slug.
export function slugFilename(name: string, ext = "md"): string {
  const base =
    name
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "download";
  return `${base}.${ext}`;
}

// First non-empty line of a Markdown blob, stripped of heading markers — used as
// a human title for a generated story.
export function firstHeading(content: string, fallback = "Story"): string {
  const line = content.split("\n").find((l) => l.trim().length > 0) ?? fallback;
  return (
    line
      .replace(/^#+\s*/, "")
      .trim()
      .slice(0, 90) || fallback
  );
}
