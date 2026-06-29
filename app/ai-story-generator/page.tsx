import type { Metadata } from "next";
import Link from "next/link";
import { StoryGenerator } from "./story-generator";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";

// SEO flagship for the head term "ai story generator". Server component so it can
// export real per-page metadata + JSON-LD; the streaming tool lives in the
// client component ./story-generator.tsx.
export const metadata: Metadata = {
  title: "Free AI Story Generator – Write Original Stories Online",
  description:
    "Create original short stories from any prompt. Choose genre, tone, length, and point of view, then copy, continue, or download your AI-generated story for free.",
  keywords: [
    "ai story generator",
    "free ai story generator",
    "short story generator",
    "ai story writer",
    "story idea generator",
    "story generator from prompt",
  ],
  alternates: { canonical: "/ai-story-generator" },
  openGraph: {
    title: "Free AI Story Generator – Write Original Stories Online",
    description:
      "Turn any prompt into an original short story — choose genre, tone, length, and POV. Free, no sign-up.",
    type: "website",
  },
};

const CREATES = [
  {
    h: "Short stories",
    p: "A complete tale with a real arc — hook, turn, and resolution — in about 400–700 words.",
  },
  {
    h: "Flash fiction",
    p: "A tight, punchy piece of 150–250 words built around a single image or twist.",
  },
  {
    h: "Scene starters",
    p: "One vivid scene you can open a chapter, a session, or a writing sprint with.",
  },
  {
    h: "RPG campaign openings",
    p: "A cold open that drops your players into a world already in motion, with a hook to chase.",
  },
  {
    h: "Character-driven stories",
    p: "Name a character and a want, and get a story that turns on their choices, not coincidence.",
  },
  {
    h: "Bedtime stories",
    p: "Gentle, whimsical tales with a soft landing — set the tone to Whimsical or Hopeful.",
  },
  {
    h: "Horror, fantasy, sci-fi, mystery, romance, adventure",
    p: "Lock any genre and the voice, pacing, and tropes shift to match — dread, wonder, or heat.",
  },
];

const PROMPTS = [
  "A lonely lighthouse keeper discovers a signal from another century.",
  "A goblin merchant sells memories instead of goods.",
  "A detective investigates a murder where the victim is still alive.",
  "A spaceship wakes its crew because the stars have disappeared.",
];

// Static, hand-written sample outputs — never a live model call on page load.
// Each ~180–220 words, original fiction tied to the example prompts above.
const OUTPUTS = [
  {
    meta: "Prompt: a lonely lighthouse keeper discovers a signal from another century",
    title: "The Hundred-Year Light",
    body: [
      "Halloran had kept the light for nineteen winters and had never once heard it answer back. So when the lamp stuttered — three long, two short, a pattern no storm makes — he set down his tea and listened the way a man listens for his own name.",
      "It came again at midnight. And again the next. He copied the flashes into the margin of the logbook, beneath an entry he did not remember writing, in handwriting that was unmistakably his own. The date above it read 1899.",
      "He told himself it was the cold getting into the wiring. He told himself a great many things. But on the seventh night he flashed the pattern back, and across the black water something enormous and patient turned to face the shore.",
      "In the morning the sea had gone glassy and still. On the rocks below lay a single brass key, salt-bright, warm to the touch. Halloran did not know yet which door it opened. He only knew that for the first time in nineteen winters, the light no longer felt like a thing he tended — but a thing that had been waiting for him to be ready.",
    ],
  },
  {
    meta: "Prompt: a goblin merchant sells memories instead of goods",
    title: "What the Goblin Keeps",
    body: [
      "Pell's cart had no wares on it, which was how you knew it was Pell's cart. Just rows of little corked bottles, each one holding a curl of grey light, each one labelled in a hand too small to read without leaning close — and Pell charged you a memory for leaning close.",
      "\"First taste is free,\" she said, and uncorked one under a farmer's nose. His eyes went soft. For three heartbeats he was eight years old and his mother was alive and the bread was just out of the oven. Then it was gone, and he was weeping in a market square, and Pell was holding out her green little hand.",
      "\"You can have it back,\" she said kindly. \"Costs you the day your wife said yes. Fair trade — that one's worth more.\"",
      "The farmer paid. They always paid. Pell corked the new memory, slid it into the empty space on the cart, and trundled on toward the next town, her wagon a little heavier, her customers a little lighter, the world full of people who could no longer quite remember what they had lost.",
    ],
  },
  {
    meta: "Prompt: a detective investigates a murder where the victim is still alive",
    title: "Still Breathing",
    body: [
      "The victim met Inspector Vos at the door of her own apartment, very much alive, and apologised for the inconvenience.",
      "\"They told me I was killed last Tuesday,\" Marguerite Loll said, pouring two coffees with steady hands. \"Stabbed, apparently. The report is quite detailed. I've read it four times.\"",
      "Vos read it once. It was his own report, in his own file, signed and dated — for a murder that had not happened, of a woman who was sliding a saucer toward him across the table. The photographs were real. The blood was real. The body in them wore Marguerite's face.",
      "\"Someone has gone to enormous trouble,\" she said, \"to make the city certain I'm dead. I'd very much like to know why before they decide to make it true.\"",
      "Outside, a car that had been parked across the street for an hour finally switched on its engine. Vos watched it pull away and felt the case turn over in his chest like a key in a lock — because a frame this perfect wasn't built to convict someone. It was built to make a real death look like old news.",
    ],
  },
];

const TIPS = [
  {
    h: "Add a clear character",
    p: "Give the story someone to follow — a name, a job, a want. \"A tired midwife\" beats \"a person.\"",
  },
  {
    h: "Define the conflict",
    p: "Say what's at stake or what's in the way. Stories run on tension, not description.",
  },
  {
    h: "Choose a tone",
    p: "Whimsical, dark, melancholic, suspenseful — tone steers word choice and pacing more than genre does.",
  },
  {
    h: "Mention the ending style",
    p: "Want a gut-punch? Ask for a twist or a bittersweet close. Open the Optional details to set it.",
  },
  {
    h: "Add constraints",
    p: "Limits spark creativity. Try \"first person,\" \"unreliable narrator,\" \"no dialogue,\" or \"one location.\"",
  },
];

const FAQS = [
  {
    q: "Is the AI story generator free?",
    a: "Yes. Generating a story is free and needs no account. You can copy or download the result instantly. Saving stories and characters into a persistent campaign is the optional next step.",
  },
  {
    q: "Do I need to sign up or log in?",
    a: "No. You can generate, copy, and download stories without an account. You only sign up if you want to save stories, extract characters as NPCs, and build a campaign.",
  },
  {
    q: "Who owns the stories I generate?",
    a: "You do. Output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises and living authors' named characters, but always review before publishing.",
  },
  {
    q: "Can I use the stories commercially?",
    a: "Yes — you can use the output in your own commercial work. Review and edit it first to make sure it's original and fits your needs.",
  },
  {
    q: "How long are the stories?",
    a: "Choose Flash (≈150–250 words), a single Scene (≈300–500 words), or a Short story (≈400–700 words). Use Continue to extend any story beat by beat for as long as you like.",
  },
  {
    q: "Can I use it for Dungeons & Dragons and other tabletop RPGs?",
    a: "Absolutely. Generate a campaign opening or a character-driven tale, then pull its characters out as NPCs and save them to a campaign your other tools remember.",
  },
  {
    q: "How does saving work and what about privacy?",
    a: "Create a free account (email or Google) to save your stories and characters. We collect as little as possible and don't sell your data — see the privacy policy for details.",
  },
];

export default function AiStoryGeneratorPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Free AI Story Generator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <section
        className="hero-band"
        style={{
          background: [
            "linear-gradient(90deg, var(--bg) 8%, rgba(15,16,32,0.62) 48%, rgba(15,16,32,0.2) 100%)",
            "linear-gradient(0deg, var(--bg) 1%, transparent 55%)",
            "url(/illustrations/hero-home.jpg) right center / cover no-repeat",
          ].join(", "),
        }}
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free AI Story Generator · no login
          </div>
          <h1>Free AI Story Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Turn a prompt into an original short story with custom genre, tone,
            length, and point of view. Use it for creative writing, D&amp;D
            sessions, bedtime stories, school prompts, worldbuilding, or quick
            fiction drafts.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28 }}>
        <StoryGenerator />
      </section>

      <div className="wrap">
        {/* What it can create */}
        <section className="section">
          <h2>What this AI story generator can create</h2>
          <p className="lead">
            One prompt box, many shapes of story — set the genre, tone, length,
            and POV to steer it.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {CREATES.map((c) => (
              <div key={c.h} className="card" style={{ cursor: "default" }}>
                <h3 style={{ margin: "0 0 6px" }}>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example prompts */}
        <section className="section">
          <h2>Example story prompts</h2>
          <p className="lead">
            Stuck on a premise? Paste one of these into the prompt box above —
            then change the genre or tone and run it again for a different take.
          </p>
          <ul className="hero-bullets" style={{ marginTop: 16, maxWidth: 760 }}>
            {PROMPTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Example outputs */}
        <section className="section">
          <h2>Example outputs</h2>
          <p className="lead">
            Real, unedited-style samples of what the generator produces from a
            single line of prompt.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {OUTPUTS.map((o) => (
              <article
                key={o.title}
                className="card"
                style={{ cursor: "default" }}
              >
                <p className="example-meta">{o.meta}</p>
                <h3 style={{ margin: "8px 0 8px" }}>{o.title}</h3>
                {o.body.map((para, i) => (
                  <p
                    key={i}
                    className="lead"
                    style={{ margin: "0 0 10px", fontSize: 15 }}
                  >
                    {para}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>

        {/* How to get better stories */}
        <section className="section">
          <h2>How to get better stories</h2>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {TIPS.map((t) => (
              <div key={t.h} className="card" style={{ cursor: "default" }}>
                <h3 style={{ margin: "0 0 6px" }}>{t.h}</h3>
                <p>{t.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story genres */}
        <section className="section">
          <h2>Story genres</h2>
          <p className="lead">
            Want a page tuned to one genre? Each has its own generator with
            matched tone and tropes:
          </p>
          <div className="chips">
            {STORY_GENRES.map((g) => (
              <Link key={g.slug} className="chip" href={genrePath(g.slug)}>
                {g.h1}
              </Link>
            ))}
          </div>
        </section>

        {/* From story to campaign */}
        <section className="section">
          <h2>From story to campaign</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            This is where the AI story generator goes further than the rest:
            generate a story, extract its characters as ready-to-run{" "}
            <Link href="/rpg-tools/npc-generator">NPCs</Link>, save them into a{" "}
            <Link href="/campaigns">campaign</Link>, and keep building the same
            world session after session. Your stories stop being throwaway
            output and become the memory of a living setting — with factions,
            locations, and plot threads your tools remember.
          </p>
          <p className="lead" style={{ marginTop: 14, fontSize: 14 }}>
            Going long-form? Try the{" "}
            <Link href="/long-story-generator">Long Story Generator</Link> to
            write chapter by chapter, or browse all{" "}
            <Link href="/rpg-tools">RPG tools</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="section" style={{ paddingBottom: 16 }}>
          <h2>Frequently asked questions</h2>
          {FAQS.map((f) => (
            <div key={f.q} style={{ marginTop: 18, maxWidth: 820 }}>
              <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
              <p className="lead" style={{ margin: 0 }}>
                {f.a}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
