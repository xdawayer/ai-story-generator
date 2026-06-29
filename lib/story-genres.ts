// Programmatic SEO surface: one rankable landing page per story genre, each a
// near-exact match for a "<genre> story generator" head term. All pages reuse
// the same streaming engine (StoryGenerator with a locked genre) and funnel into
// the campaign workspace. Add a genre here and a new page exists automatically
// (app/story-generators/[slug]/page.tsx reads this list via generateStaticParams).

export interface StoryGenre {
  slug: string; // short URL segment under /story-generators, e.g. "fantasy"
  genre: string; // value sent to the model (locks the genre select)
  label: string; // short human label
  h1: string;
  title: string; // <title>
  description: string; // meta description
  keywords: string[];
  lead: string; // hero subheading
  blurb: string; // one SEO paragraph for the body
  accent: string; // per-genre theme color (hex)
  illustration?: string; // optional hero background (falls back to gradient)
  // --- Optional per-genre body content (backward compatible). These power the
  // unique on-page sections so each genre page is substantial, not a template
  // with one swapped sentence. The hub agent only reads slug/h1/blurb/accent.
  subgenres?: string[]; // distinct flavors a reader can write in this genre
  examplePrompts?: string[]; // 3-4 vivid, genre-specific starting prompts
  tips?: string[]; // 3-4 craft tips for writing better stories in this genre
  faqs?: { q: string; a: string }[]; // extra genre-specific FAQ entries
}

export const STORY_GENRES: readonly StoryGenre[] = [
  {
    slug: "fantasy",
    genre: "Fantasy",
    label: "Fantasy",
    h1: "Fantasy Story Generator",
    title: "Fantasy Story Generator — Free, No Login",
    description:
      "Free fantasy story generator. Turn any idea into an original tale of magic, quests, and strange kingdoms in seconds — no sign-up. Then build it into a campaign.",
    keywords: [
      "fantasy story generator",
      "ai fantasy story generator",
      "free fantasy story generator",
      "fantasy short story generator",
    ],
    lead: "Conjure an original fantasy tale in seconds — magic, quests, and kingdoms that never were. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "Whether you need a folktale for a worldbuilding doc, a hook for a D&D session, or just a spark for your own novel, the fantasy story generator gives you an original arc with real characters — not generic filler.",
    accent: "#67d99a",
    illustration: "/illustrations/hero-fantasy.jpg",
    subgenres: [
      "High fantasy",
      "Dark fantasy",
      "Sword & sorcery",
      "Fairy-tale fantasy",
      "Mythic",
      "Cozy fantasy",
      "Grimdark",
    ],
    examplePrompts: [
      "A cartographer is hired to map a forest that redraws itself every night.",
      "The last dragon has slept so long that a city has grown across its back.",
      "A village pays its taxes in memories to a lord no one has ever seen.",
      "An apprentice mage can only cast spells she first sings — and she's losing her voice.",
    ],
    tips: [
      "Anchor the magic to a cost. A system with limits and prices feels real; magic that solves everything kills tension.",
      "Lead with a culture, not a map. One strange custom or law tells readers more about your world than a page of geography.",
      "Give the quest a personal stake. 'Save the kingdom' lands harder when it's also 'save my sister.'",
      "Pick one wonder and earn it. A single unforgettable image beats ten generic ones.",
    ],
    faqs: [
      {
        q: "Can it write high fantasy and dark fantasy?",
        a: "Yes. Set the tone to Heroic for sweeping high fantasy or Dark for grim, morally grey tales. The genre stays Fantasy; the tone steers the mood.",
      },
      {
        q: "Will it invent the magic system and world for me?",
        a: "It will sketch one that fits the story. Add a line about how magic works (or its cost) in your idea and it builds around your rules.",
      },
    ],
  },
  {
    slug: "sci-fi",
    genre: "Sci-fi",
    label: "Sci-Fi",
    h1: "Sci-Fi Story Generator",
    title: "Sci-Fi Story Generator — Free, No Login",
    description:
      "Free sci-fi story generator. Turn any idea into an original science fiction story — starships, AI, far futures — in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "sci-fi story generator",
      "science fiction story generator",
      "ai sci-fi story generator",
      "free sci fi story generator",
    ],
    lead: "Spin up an original science fiction story in seconds — starships, rogue AI, and far-future worlds. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "From hard sci-fi to space opera, the sci-fi story generator turns a premise into a tight story with a real arc — perfect for a sci-fi RPG session, a writing prompt, or a quick read.",
    accent: "#7cc7ff",
    illustration: "/illustrations/hero-sci-fi.jpg",
    subgenres: [
      "Hard SF",
      "Space opera",
      "Cyberpunk",
      "Dystopian",
      "First contact",
      "Post-apocalyptic",
      "Time travel",
    ],
    examplePrompts: [
      "A deep-space salvage crew finds their own ship, abandoned, drifting in the same orbit.",
      "Earth receives a reply to a message it never sent.",
      "A colony's AI quietly edits the settlers' memories to keep the peace.",
      "Faster-than-light travel works — but every jump erases one of your memories.",
    ],
    tips: [
      "Change one rule, then follow it honestly. The best SF picks a single 'what if' and chases its consequences instead of piling on gadgets.",
      "Ground the future in a human problem. Tech is the setting; the story is still about people.",
      "Show the tech through use, not exposition. Let a character flick the switch rather than explain the manual.",
      "Let the science cost something. A breakthrough with a price reads as real, not magic.",
    ],
    faqs: [
      {
        q: "Hard sci-fi or space opera?",
        a: "Both. Keep the idea grounded and the tone Suspenseful for hard SF, or set Heroic with a galaxy-spanning setting for sweeping space opera.",
      },
      {
        q: "Can it write near-future or dystopian stories?",
        a: "Yes. Describe the one thing that's changed about the world in your idea and it extrapolates a believable near future from it.",
      },
    ],
  },
  {
    slug: "horror",
    genre: "Horror",
    label: "Horror",
    h1: "Horror Story Generator",
    title: "Horror Story Generator — Free, No Login",
    description:
      "Free horror story generator. Turn any idea into an original scary story — dread, the uncanny, the macabre — in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "horror story generator",
      "scary story generator",
      "ai horror story generator",
      "free horror story generator",
    ],
    lead: "Generate an original horror story in seconds — dread, the uncanny, and the macabre. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "Need a creepypasta-style tale, a one-shot for a horror RPG, or a scare to read aloud? The horror story generator builds atmosphere and a real twist, not just gore.",
    accent: "#ff6b6b",
    illustration: "/illustrations/hero-horror.jpg",
    subgenres: [
      "Cosmic horror",
      "Psychological",
      "Haunted house",
      "Folk horror",
      "Body horror",
      "Creature feature",
      "Slasher",
    ],
    examplePrompts: [
      "Every night the house has one more room than it did the morning before.",
      "A grief counsellor realises all her clients are mourning the same person — who isn't dead.",
      "The village festival has rules. This year, an outsider breaks one.",
      "A man's reflection starts finishing chores he hasn't done yet.",
    ],
    tips: [
      "Withhold the monster. Dread lives in the not-yet-seen; reveal it too early and fear turns to spectacle.",
      "Make the ordinary wrong. A familiar place subtly off-kilter scares more than any creature.",
      "End on a turn, not a scream. The best horror lingers — leave one thing unresolved.",
      "Give the victim something to lose. We only fear for people we've come to care about.",
    ],
    faqs: [
      {
        q: "Can it write scary stories without gore?",
        a: "Yes. Set the tone to Suspenseful for psychological dread and atmosphere over gore — horror leans on what's implied.",
      },
      {
        q: "Is the output safe to read aloud or share?",
        a: "It aims for unsettling, not gratuitous. It avoids graphic cruelty and real-world tragedy; always skim before reading to a group.",
      },
    ],
  },
  {
    slug: "mystery",
    genre: "Mystery",
    label: "Mystery",
    h1: "Mystery Story Generator",
    title: "Mystery Story Generator — Free, No Login",
    description:
      "Free mystery story generator. Turn any idea into an original whodunit — clues, suspects, a twist — in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "mystery story generator",
      "whodunit generator",
      "ai mystery story generator",
      "detective story generator",
    ],
    lead: "Craft an original mystery in seconds — clues, suspects, and a satisfying twist. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The mystery story generator plots a tight whodunit with motive and misdirection — a ready investigation scene for a tabletop session or a quick read.",
    accent: "#b69cff",
    illustration: "/illustrations/hero-mystery.jpg",
    subgenres: [
      "Whodunit",
      "Cozy mystery",
      "Noir",
      "Police procedural",
      "Locked-room",
      "Heist",
      "Spy thriller",
    ],
    examplePrompts: [
      "A detective is called to investigate her own disappearance, reported that morning.",
      "Every guest at the dinner party has a perfect alibi. One of them is lying.",
      "A locked-room death in a lighthouse with only one key — found in the victim's pocket.",
      "A small-town librarian notices the same book returned by three different dead people.",
    ],
    tips: [
      "Plant the solution in plain sight. Fair-play mysteries hide the answer in details, not in withheld facts.",
      "Give every suspect a motive. Misdirection works when each lie could plausibly be the truth.",
      "Track what the detective knows versus the reader. Tension is the gap between the two.",
      "Make the clue do double duty. The best clues feel like colour until the reveal recolours them.",
    ],
    faqs: [
      {
        q: "Will the mystery have a real solution?",
        a: "Yes. Set the ending style to Twist for a clean reveal, or leave it Open-ended for an ambiguous noir close.",
      },
      {
        q: "Can it build a case for a tabletop investigation?",
        a: "Absolutely — generate the crime, suspects, and clues, then pull the suspects out as NPCs and drop them into a campaign your tools remember.",
      },
    ],
  },
  {
    slug: "romance",
    genre: "Romance",
    label: "Romance",
    h1: "Romance Story Generator",
    title: "Romance Story Generator — Free, No Login",
    description:
      "Free romance story generator. Turn any idea into an original love story — tension, chemistry, a turning point — in seconds, no sign-up.",
    keywords: [
      "romance story generator",
      "love story generator",
      "ai romance story generator",
      "free romance story generator",
    ],
    lead: "Write an original romance in seconds — chemistry, tension, and a turning point that lands. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "From meet-cute to slow burn, the romance story generator gives you characters with real wants and a genuine emotional arc — a spark for your own writing or a quick read.",
    accent: "#ff9ec7",
    illustration: "/illustrations/hero-romance.jpg",
    subgenres: [
      "Slow burn",
      "Enemies to lovers",
      "Second chance",
      "Friends to lovers",
      "Forbidden romance",
      "Meet-cute",
      "Fake dating",
    ],
    examplePrompts: [
      "Two rival florists are forced to share a stall at the summer market.",
      "They broke up ten years ago. Tonight they're seated next to each other on a delayed flight.",
      "A letter meant for someone else arrives at the wrong address — and gets answered.",
      "Two night-shift workers keep leaving notes for each other they'll never meet in person.",
    ],
    tips: [
      "Build tension from a real obstacle, not just bad timing. A genuine reason to stay apart raises the stakes.",
      "Give both characters a want beyond the relationship. People fall for whole people.",
      "Earn the turning point. The moment it changes should cost one of them something.",
      "Let the dialogue carry the chemistry. What they don't say matters as much as what they do.",
    ],
    faqs: [
      {
        q: "Can I set the mood and ending?",
        a: "Yes. Tone steers the feel (Hopeful, Bittersweet, Comic) and the ending style sets a happy, open, or bittersweet close. Output stays tasteful.",
      },
      {
        q: "Does it write tropes like enemies-to-lovers?",
        a: "It does — name the trope in your idea (enemies to lovers, second chance, fake dating) and it shapes the arc around it.",
      },
    ],
  },
  {
    slug: "fairy-tale",
    genre: "Fairy tale",
    label: "Fairy Tale",
    h1: "Fairy Tale Generator",
    title: "Fairy Tale Generator — Free, No Login",
    description:
      "Free fairy tale generator. Turn any idea into an original fairy tale — wonder, a lesson, a touch of the strange — in seconds, no sign-up.",
    keywords: [
      "fairy tale generator",
      "ai fairy tale generator",
      "free fairy tale generator",
      "fairytale story generator",
    ],
    lead: "Spin an original fairy tale in seconds — wonder, a quiet lesson, and a touch of the strange. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The fairy tale generator writes original tales in the classic voice — great for bedtime stories, a creative prompt, or a whimsical campaign legend.",
    accent: "#ffd98e",
    illustration: "/illustrations/hero-fairy-tale.jpg",
    subgenres: [
      "Classic fairy tale",
      "Fractured fairy tale",
      "Origin myth",
      "Fable",
      "Bedtime tale",
      "Dark fairy tale",
    ],
    examplePrompts: [
      "A miller's daughter is promised she can spin moonlight into thread — for a price she can't yet name.",
      "The youngest of three siblings is the only one kind to the talking fox at the crossroads.",
      "A queen wishes for a child as quiet as snow, and gets exactly that.",
      "A boy trades his shadow for a single perfect day.",
    ],
    tips: [
      "Use the rule of three. Three trials, three gifts, three siblings — repetition is the genre's heartbeat.",
      "Let the moral live in the story, not a sermon. Show the cost of the wish; don't explain it.",
      "Keep the language simple and a little timeless. Fairy tales sound spoken aloud.",
      "Make the magic fair but strict. Bargains and rules give the tale its shape and its sting.",
    ],
    faqs: [
      {
        q: "Can it write modern or fractured fairy tales?",
        a: "Yes. Add your twist in the idea box (a fairy tale set in a subway, told from the villain's side) and keep the genre Fairy tale for the classic voice.",
      },
      {
        q: "Are the tales gentle enough for bedtime?",
        a: "Set the tone to Whimsical or Hopeful for a soft landing. For older readers, Dark gives a grimmer, original-Grimm feel.",
      },
    ],
  },
  {
    slug: "adventure",
    genre: "Adventure",
    label: "Adventure",
    h1: "Adventure Story Generator",
    title: "Adventure Story Generator — Free, No Login",
    description:
      "Free adventure story generator. Turn any idea into an original tale of danger, discovery, and high stakes in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "adventure story generator",
      "ai adventure story generator",
      "free adventure story generator",
      "action story generator",
    ],
    lead: "Spin up an original adventure in seconds — danger, discovery, and high stakes. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The adventure story generator builds a propulsive arc with a real goal and obstacles — a ready quest for a tabletop session, a writing prompt, or a quick thrill.",
    accent: "#f0b352",
    subgenres: [
      "Survival",
      "Treasure hunt",
      "Swashbuckler",
      "Exploration",
      "Heist",
      "Quest",
      "Lost world",
    ],
    examplePrompts: [
      "A treasure map is real, but the X marks a place that only exists at low tide for nine minutes.",
      "Two stranded climbers find a door built into the mountainside, locked from the inside.",
      "A courier must cross a desert that swallows anyone who stops moving.",
      "The expedition's guide vanishes the night before the summit — with the only compass.",
    ],
    tips: [
      "Keep raising the stakes. Each obstacle should be worse than the last, with no easy way back.",
      "Use a ticking clock. A deadline turns wandering into momentum.",
      "Make the setting an antagonist. The terrain, weather, or sea should fight the hero too.",
      "Give the hero one hard choice. Action is exciting; a real decision is unforgettable.",
    ],
    faqs: [
      {
        q: "Can it end on a cliffhanger so I can continue?",
        a: "Yes. Set the ending style to Cliffhanger and use Continue to push the expedition into its next leg.",
      },
      {
        q: "Is it good for a tabletop quest hook?",
        a: "Very. Generate the setup and the obstacle, then save it to a campaign and pull the cast out as NPCs your tools remember.",
      },
    ],
  },
  {
    slug: "cyberpunk",
    genre: "Cyberpunk",
    label: "Cyberpunk",
    h1: "Cyberpunk Story Generator",
    title: "Cyberpunk Story Generator — Free, No Login",
    description:
      "Free cyberpunk story generator. Turn any idea into an original neon-noir tale of megacorps, hackers, and chrome in seconds, no sign-up.",
    keywords: [
      "cyberpunk story generator",
      "ai cyberpunk story generator",
      "free cyberpunk story generator",
      "neon noir story generator",
    ],
    lead: "Generate an original cyberpunk story in seconds — neon, megacorps, chrome, and rain. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "From street-level runners to corp intrigue, the cyberpunk story generator nails the noir mood and a sharp twist — great for a cyberpunk RPG one-shot or a quick read.",
    accent: "#c77dff",
    subgenres: [
      "Street-level noir",
      "Corporate intrigue",
      "Hacker thriller",
      "Post-cyberpunk",
      "Biopunk",
      "Transhumanist",
    ],
    examplePrompts: [
      "A courier's new cybernetic eye keeps showing ads for a murder that hasn't happened yet.",
      "A hacker is hired to delete a person from every database — including their own memory of the job.",
      "The city's last human cop investigates a homicide the AI police have already closed.",
      "A street doc realises the implants she fits are slowly syncing their owners into one mind.",
    ],
    tips: [
      "Keep it street-level. Cyberpunk hits hardest from the gutter looking up at the towers, not the boardroom looking down.",
      "Make the tech personal and invasive. Chrome that changes who you are beats chrome that's just cool.",
      "Lean into the noir. Rain, neon, moral grey, and a deal that was always rigged.",
      "Name the megacorp. A faceless system gets scary once it has a logo and a slogan.",
    ],
    faqs: [
      {
        q: "Can it write corporate intrigue and street-level stories?",
        a: "Both. A lone runner or fixer for street noir; a leak, a deal, or a coup for corporate intrigue. Set the tone to Dark or Suspenseful to sharpen the edge.",
      },
    ],
  },
  {
    slug: "western",
    genre: "Western",
    label: "Western",
    h1: "Western Story Generator",
    title: "Western Story Generator — Free, No Login",
    description:
      "Free western story generator. Turn any idea into an original frontier tale of dust, grit, and justice in seconds, no sign-up.",
    keywords: [
      "western story generator",
      "ai western story generator",
      "free western story generator",
      "cowboy story generator",
    ],
    lead: "Write an original western in seconds — dust, grit, and frontier justice. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The western story generator delivers lean, atmospheric frontier tales with a real standoff or reckoning — perfect for a weird-west RPG or a quick read.",
    accent: "#e0a86b",
    subgenres: [
      "Classic western",
      "Revisionist western",
      "Weird west",
      "Spaghetti western",
      "Frontier noir",
      "Outlaw tale",
    ],
    examplePrompts: [
      "A retired gunslinger's past rides into town on the noon stage, asking for him by name.",
      "The only water for fifty miles sits on land a dying rancher refuses to sell.",
      "A sheriff discovers the man he hanged last spring is buying drinks at the saloon.",
      "Two rivals are forced to cross the badlands handcuffed together, sharing one horse.",
    ],
    tips: [
      "Let the landscape do the talking. Heat, dust, and distance set the mood better than dialogue.",
      "Build to a single reckoning. Most westerns turn on one confrontation everyone sees coming.",
      "Keep the dialogue lean. Characters who say little and mean a lot fit the frontier.",
      "Make justice cost something. The line between law and revenge is where the genre lives.",
    ],
    faqs: [
      {
        q: "Can it write a weird-west story with supernatural elements?",
        a: "Yes. Add a ghost, a curse, or a railroad that shouldn't exist in your idea and it blends frontier grit with the uncanny.",
      },
    ],
  },
] as const;

export function getStoryGenre(slug: string): StoryGenre | undefined {
  return STORY_GENRES.find((g) => g.slug === slug);
}

// Canonical path for a genre landing page, e.g. genrePath("fantasy") →
// "/story-generators/fantasy". Single source of truth for the genre URL shape.
export function genrePath(slug: string): string {
  return `/story-generators/${slug}`;
}
