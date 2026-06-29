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

// Open a clean, print-ready window for the text and trigger the browser print
// dialog (where the user can "Save as PDF"). No dependency, escapes all output.
export function printDocument(title: string, content: string): void {
  const w = window.open("", "_blank", "width=820,height=1000");
  if (!w) return;
  const esc = (s: string) =>
    s.replace(
      /[&<>]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c,
    );
  w.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>` +
      `<style>body{font-family:Georgia,'Times New Roman',serif;max-width:680px;` +
      `margin:48px auto;padding:0 24px;color:#111;line-height:1.7}` +
      `pre{white-space:pre-wrap;font-family:inherit;font-size:16px}</style></head>` +
      `<body><pre>${esc(content)}</pre></body></html>`,
  );
  w.document.close();
  w.focus();
  w.print();
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
