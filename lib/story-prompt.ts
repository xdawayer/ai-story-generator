// Prompt builder for the broad AI Story Generator (kept as the top-of-funnel SEO
// surface — the head term "ai story generator"). It is intentionally generic and
// instant-value; the funnel CTA routes story-curious visitors toward the RPG
// campaign workspace (the actual product/moat).
export interface StoryInput {
  idea: string;
  genre: string;
  tone: string;
  length: string;
  pov?: string; // e.g. "First person", "Third person limited"
  characters?: string; // optional character notes (names, roles, relationships)
  setting?: string; // optional setting / place / era
  endingStyle?: string; // e.g. "Twist", "Bittersweet", "Cliffhanger"
  useCase?: string; // e.g. "D&D session", "Campaign opening" — shapes usable output
  // When set, write the NEXT part of this story instead of a new one ("Continue").
  continueFrom?: string;
  // When set, rewrite this finished story in a new `tone` ("Rewrite tone").
  rewriteFrom?: string;
  // Optional freeform rewrite instruction, e.g. "Make it darker", "Add a twist".
  rewriteInstruction?: string;
  // Long-form chapter mode.
  mode?: "outline" | "chapter";
  chapters?: string; // desired chapter count (outline mode)
  outline?: string; // the full outline (chapter mode)
  chapter?: string; // the chapter to write now (chapter mode)
}

// Word targets stay under the guest maxOutputTokens cap (~1500 tokens ≈ 1100
// words) so nothing truncates mid-sentence. Medium/Long are expanded-short
// prompts, not a separate backend tier — they lengthen the ask, not the cap.
const LENGTH_GUIDE: Record<string, string> = {
  Flash: "a tight flash-fiction piece of about 150-250 words",
  Short: "a short story of about 400-700 words",
  Medium: "a fuller short story of about 700-900 words",
  Long: "a longer, complete short story of about 950-1100 words",
  Scene: "a single vivid scene of about 300-500 words",
};

// Per-genre craft directives fed to the model so each genre writes to its own
// conventions instead of relying on the genre word alone. Keyed by the genre
// VALUE sent from GENRE_OPTIONS / STORY_GENRES (`.genre`), so this covers both
// the generic picker and the locked-genre landing pages. These are terse,
// model-facing distillations of the human-facing `tips` in lib/story-genres.ts —
// kept intentionally separate so display copy and prompt guidance can diverge.
const GENRE_CRAFT: Record<string, string[]> = {
  Fantasy: [
    "Anchor the magic to a cost or limit — magic that solves everything kills tension.",
    "Reveal the world through one strange custom or law, not a geography lecture.",
    "Give the quest a personal stake, not just 'save the kingdom.'",
    "Earn one unforgettable wonder rather than scattering ten generic ones.",
  ],
  "Sci-fi": [
    "Pick one 'what if' and follow its consequences honestly instead of piling on gadgets.",
    "Ground the future in a human problem — tech is the setting, not the story.",
    "Show technology through use, not exposition.",
    "Let the science cost something so it reads as real, not magic.",
  ],
  Mystery: [
    "Hide the solution in plain sight through details — play fair with the reader.",
    "Give every suspect a plausible motive so the misdirection holds.",
    "Make clues read as colour until the reveal recolours them.",
    "Mind the gap between what the detective knows and what the reader knows.",
  ],
  Horror: [
    "Withhold the threat — dread lives in the not-yet-seen.",
    "Make an ordinary, familiar place subtly wrong.",
    "End on a lingering turn, not a scream; leave one thing unresolved.",
    "Give the victim something to lose so the fear lands.",
  ],
  Adventure: [
    "Escalate — each obstacle worse than the last, with no easy way back.",
    "Use a ticking clock to turn wandering into momentum.",
    "Make the setting itself an antagonist (terrain, weather, sea).",
    "Force one hard choice; a real decision beats another action beat.",
  ],
  Romance: [
    "Build tension from a real obstacle, not just bad timing.",
    "Give both characters a want beyond the relationship.",
    "Earn the turning point — it should cost one of them something.",
    "Let subtext and what's unsaid carry the chemistry.",
  ],
  "Fairy tale": [
    "Use the rule of three — three trials, gifts, or siblings.",
    "Let the moral live in the events, never a sermon.",
    "Keep the language simple and timeless, made to be read aloud.",
    "Make the magic fair but strict — bargains have rules and costs.",
  ],
  Cyberpunk: [
    "Keep it street-level: the gutter looking up at the towers.",
    "Make the tech personal and invasive — chrome that changes who you are.",
    "Lean into noir: rain, neon, moral grey, a deal that was always rigged.",
    "Give the megacorp a name and a face.",
  ],
  Western: [
    "Let the landscape — heat, dust, distance — set the mood.",
    "Build to a single reckoning everyone sees coming.",
    "Keep the dialogue lean; make justice cost something.",
  ],
};

// Per-genre structural payoff — the "bespoke" tier above craft notes: a
// genre-specific shape or directly-usable section the model won't produce from
// the genre word alone. Each was designed + adversarially reviewed one genre at
// a time. Only genres with a REAL structural hook are here — Horror, Romance,
// and Western are DELIBERATELY absent: forcing a structure on them was found to
// be gimmicky, tone-narrowing, or redundant with their craft notes (horror
// lives on the UNexplained, so a "reveal the rule" section is its anti-payoff;
// romance's payoff is emotional, not a checkable artifact; western's single
// reckoning is already its craft note). Any appended "## Section" defers to the
// requested endingStyle — an open, ambiguous, or cliffhanger ending skips it —
// so structure never overrides the reader's chosen ending. Extensible, but only
// add a genre here if it has a genuine shape craft notes can't deliver.
const GENRE_STRUCTURE: Record<string, string> = {
  Mystery: [
    "Structure it as a fair-play mystery: plant at least three concrete clues in",
    "the narrative that an attentive reader could use, and give each suspect a",
    "plausible motive. Unless an open or ambiguous ending is requested, resolve it",
    "honestly — after the story add a '---' divider and a short section",
    "'## The Solution' (2-4 sentences) naming who did it, their motive, and the",
    "clue that gives them away.",
  ].join(" "),
  Fantasy: [
    "Give the world one clear, established rule — how its magic works and what it",
    "costs, or in a low-magic tale a fixed law of its nature or society — and plant",
    "it concretely in the first third. Let the climax turn on that same rule being",
    "invoked, inverted, or pushed past its limit, so the resolution is paid for by",
    "something the reader already saw rather than a power introduced at the last",
    "moment. Unless an open-ended or cliffhanger ending is requested — in which case",
    "the rule can be left mid-invocation — carry that setup through to its payoff,",
    "and leave the emotional outcome (triumphant, tragic, bittersweet, or twisting)",
    "to the requested ending.",
  ].join(" "),
  "Sci-fi": [
    "Build the story on a single, clearly-defined novum — one change from our world",
    "— and structure it as an escalation: land the premise's first concrete",
    "consequence early, then turn on a second-order consequence that the first",
    "logically produces yet no one foresaw, forcing the characters to choose under",
    "the new rules. Keep the underlying rule self-consistent so that turn reads as",
    "inevitable in hindsight rather than arbitrary. Let the ending land exactly as",
    "the requested ending style dictates — Twist, Happy, Bittersweet, Cliffhanger,",
    "Tragic, and Open-ended all stand as chosen; do not tack on a resolution,",
    "epilogue, or forward-looking coda that softens or answers the intended final",
    "note.",
  ].join(" "),
  Adventure: [
    "Structure it around one concrete objective and the single hard rule that",
    "guards it — a guardian, a toll, a lock, the catch that puts the prize nearly",
    "out of reach — and plant that rule early so the reader feels the trap close",
    "before the crew reaches it. The climax must turn on that established",
    "constraint, not on luck or a rescue from nowhere; whatever is gained or lost",
    "has to be paid for in kind, honoring the requested ending for whether they",
    "make it. Unless an open, ambiguous, or cliffhanger ending is requested, close",
    "with a '---' divider and a short '## The Catch' (2-4 sentences): the true cost",
    "of what they won or lost, and one lingering complication that opens the next",
    "leg.",
  ].join(" "),
  "Fairy tale": [
    "Build the tale on one binding rule — a bargain, a prophecy, a wish, or a",
    "forbidden thing — and set its exact terms down plainly near the opening, the",
    "price either named or pointedly withheld. Make the whole story that rule",
    "coming due, converging on a single reckoning that turns on the terms exactly",
    "as first spoken — honored, broken, or outwitted from inside their own logic,",
    "but never quietly rewritten to make the ending easy. Defer to the chosen",
    "ending style for how it lands: paid gladly for a happy close, exacted in full",
    "for a tragic or bittersweet one, outwitted for a twist. Unless an open-ended",
    "or cliffhanger ending is requested — in which case bring the tale to the very",
    "brink of the reckoning and stop, with the terms still unsettled.",
  ].join(" "),
  Cyberpunk: [
    "Structure it as a 'run': the protagonist takes a job, score, or deal from the",
    "named corp or fixer, and plant a hidden catch inside it — a buried clause, a",
    "silent tracker, a second buyer, a payload that isn't what it was sold as. Let",
    "the personal, invasive tech (the eye, the wire, the implant) be the thing that",
    "surfaces the catch, and let the requested ending style decide the outcome.",
    "Unless an open, ambiguous, or cliffhanger ending is requested, resolve who",
    "ends up owning whom — then after the story add a '---' divider and a short",
    "GM-facing section '## The Job' (2-4 short lines): the gig hook, the party",
    "really pulling the strings, and one complication, so the piece drops into a",
    "tabletop run.",
  ].join(" "),
};

// Renders a genre's craft directives + optional structural payoff into a prompt
// block. Returns "" when the genre has no guidance (e.g. "Any"), so callers can
// append unconditionally.
function genreGuidance(genre: string): string {
  const craft = GENRE_CRAFT[genre];
  const structure = GENRE_STRUCTURE[genre];
  return [
    craft &&
      `Craft notes for a strong ${genre.toLowerCase()} story:\n${craft
        .map((c) => `- ${c}`)
        .join("\n")}`,
    structure,
  ]
    .filter(Boolean)
    .join("\n\n");
}

const SYSTEM = [
  "You are a skilled fiction writer. Write ONE original short story for the reader.",
  "Output GitHub-flavored Markdown:",
  "# <evocative title>",
  "Then the prose in short paragraphs. Optionally use a divider (---) between beats.",
  "Craft: a clear arc (hook, turn, resolution), concrete sensory detail, a distinct",
  "voice, and real characters with wants. Avoid cliché openings ('Once upon a time'),",
  "adjective soup, and generic filler.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Mature themes (violence, intrigue, the macabre) are",
  "fine. Never produce real-world harmful instructions or any sexual content",
  "involving minors.",
].join("\n");

const CONTINUE_SYSTEM = [
  "You are a skilled fiction writer continuing an existing story.",
  "Write ONLY the next part — do not repeat or summarize what came before, and do",
  "not restate the title. Continue seamlessly in the same voice, tense, and POV.",
  "Write about 200-350 words that advance the plot with a fresh beat (a",
  "complication, reversal, or revelation). Output Markdown prose in short",
  "paragraphs with NO heading. Do not wrap up the whole story unless it is clearly",
  "reaching its natural end.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Never produce real-world harmful instructions or any",
  "sexual content involving minors.",
].join("\n");

const REWRITE_SYSTEM = [
  "You are a skilled fiction writer revising an existing story. Rewrite it per the",
  "reader's instructions, keeping the same premise, characters, and plot beats.",
  "Match the target length given below. Output GitHub-flavored Markdown: keep a",
  "'# <title>' heading (you may adjust the title to fit), then the prose in short",
  "paragraphs. Genuinely re-voice it — change word choice, mood, imagery, and",
  "rhythm to match the new tone, point of view, and length; do not just copy the",
  "original.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Never produce real-world harmful instructions or any",
  "sexual content involving minors.",
].join("\n");

const OUTLINE_SYSTEM = [
  "You are a fiction author planning a serialized story. Produce ONLY a chapter",
  "outline — no prose. Output a numbered Markdown list, one line per chapter:",
  "`N. <evocative chapter title> — <one-sentence beat>`. Give the story a clear",
  "arc across the chapters (setup, rising complications, climax, resolution).",
  "No preamble, no closing notes — just the numbered list.",
].join("\n");

const CHAPTER_SYSTEM = [
  "You are a skilled fiction writer composing ONE chapter of a longer story.",
  "Write about 400-600 words for THIS chapter only. Begin with a Markdown",
  "heading '## <chapter title>'. Continue the established voice, tense, and POV.",
  "Do NOT summarize previous chapters or restate the outline; advance the story.",
  "End on a beat that pulls the reader into the next chapter.",
  "",
  "Rules: original work only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. No sexual content involving minors.",
].join("\n");

export function buildStoryPrompt(i: StoryInput): {
  system: string;
  user: string;
} {
  // Outline mode: plan the chapters of a long-form story.
  if (i.mode === "outline") {
    const count = i.chapters || "6";
    const fields = [
      i.idea && `Premise / idea: ${i.idea}`,
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Tone: ${i.tone}`,
    ]
      .filter(Boolean)
      .join("\n");
    const craft = GENRE_CRAFT[i.genre];
    const craftBlock = craft
      ? `\n\nKeep these craft notes in mind:\n${craft.map((c) => `- ${c}`).join("\n")}`
      : "";
    const user = `Outline ${count} chapters for an original story.${fields ? `\n${fields}` : " Surprise me with a strong premise."}${craftBlock}`;
    return { system: OUTLINE_SYSTEM, user };
  }

  // Chapter mode: write one chapter, grounded in the outline + story so far.
  if (i.mode === "chapter") {
    const user = [
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Tone: ${i.tone}`,
      i.pov && `Point of view: ${i.pov}`,
      i.outline && `Full outline:\n${i.outline.slice(0, 3000)}`,
      i.continueFrom?.trim() &&
        `Story so far (for continuity — do not repeat it):\n${i.continueFrom.trim().slice(0, 4000)}`,
      `\nWrite this chapter now: ${i.chapter || "the next chapter"}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    return { system: CHAPTER_SYSTEM, user };
  }

  // Rewrite mode: re-voice a finished story with a new tone / POV / length.
  if (i.rewriteFrom && i.rewriteFrom.trim()) {
    const length = LENGTH_GUIDE[i.length] ?? LENGTH_GUIDE.Short;
    const ctx = [
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Rewrite in this tone: ${i.tone}`,
      i.pov && `Point of view: ${i.pov}`,
      `Target length: ${length}.`,
      i.rewriteInstruction && `Also apply this change: ${i.rewriteInstruction}`,
    ]
      .filter(Boolean)
      .join("\n");
    const user = [
      "Rewrite the following story per the instructions below, keeping the same",
      "core premise, characters, and structure unless an instruction says otherwise.",
      ctx && `\n${ctx}`,
      "\n\nStory to rewrite:\n",
      i.rewriteFrom.trim().slice(0, 6000),
    ]
      .filter(Boolean)
      .join("");
    return { system: REWRITE_SYSTEM, user };
  }

  // Continuation mode: extend an existing story rather than starting a new one.
  if (i.continueFrom && i.continueFrom.trim()) {
    const ctx = [
      i.genre && `Genre: ${i.genre}`,
      i.tone && `Tone: ${i.tone}`,
      i.idea && `Where to take it next: ${i.idea}`,
    ]
      .filter(Boolean)
      .join("\n");
    const user = [
      "Story so far:\n",
      i.continueFrom.trim().slice(0, 6000),
      "\n\nContinue the story from exactly where it stops.",
      ctx && `\n${ctx}`,
    ]
      .filter(Boolean)
      .join("");
    return { system: CONTINUE_SYSTEM, user };
  }

  const length = LENGTH_GUIDE[i.length] ?? LENGTH_GUIDE.Short;
  const fields = [
    i.idea && `Premise / idea: ${i.idea}`,
    i.genre && `Genre: ${i.genre}`,
    i.tone && `Tone: ${i.tone}`,
    i.pov && `Point of view: ${i.pov}`,
    i.characters && `Characters to feature: ${i.characters}`,
    i.setting && `Setting: ${i.setting}`,
    i.endingStyle && `Ending style: ${i.endingStyle}`,
    i.useCase &&
      `Use case: ${i.useCase} — write it so it is directly usable for this at the table`,
    `Target length: ${length}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const brief = i.idea
    ? `Write ${length} from this brief:\n${fields}`
    : `Write ${length}. Surprise me with an original, characterful premise.\n${fields}`;
  const guidance = genreGuidance(i.genre);
  const user = guidance ? `${brief}\n\n${guidance}` : brief;

  return { system: SYSTEM, user };
}
