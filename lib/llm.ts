// DeepSeek (OpenAI-compatible) client + streaming helper.
// DeepSeek exposes an OpenAI-compatible endpoint, so we use the base `OpenAI`
// client pointed at DeepSeek's baseURL. Single-provider by design (no Azure,
// no Anthropic). Model defaults to `deepseek-chat` (DeepSeek-V3) — a fast,
// non-reasoning chat model well suited to streaming prose. Avoid
// `deepseek-reasoner` here: it emits reasoning tokens and is slower/costlier.
import OpenAI from "openai";

const REQUEST_TIMEOUT_MS = 60_000;
const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";

function env(name: string): string {
  // Strip escaped newlines, whitespace, and surrounding quotes — some .env files
  // store values like DEEPSEEK_API_KEY="sk-…" with literal quotes.
  return (
    process.env[name]
      ?.replace(/\\n/g, "")
      .trim()
      .replace(/^["']|["']$/g, "") ?? ""
  );
}

function model(): string {
  return env("DEEPSEEK_MODEL") || DEFAULT_MODEL;
}

export function isLlmConfigured(): boolean {
  return Boolean(env("DEEPSEEK_API_KEY"));
}

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: env("DEEPSEEK_API_KEY"),
      baseURL: env("DEEPSEEK_BASE_URL") || DEFAULT_BASE_URL,
      timeout: REQUEST_TIMEOUT_MS,
    });
  }
  return client;
}

export interface StreamParams {
  system: string;
  prompt: string;
  maxTokens: number;
}

// Yields text deltas as the model streams. Throws if DeepSeek is misconfigured or errors.
export async function* streamCompletion({
  system,
  prompt,
  maxTokens,
}: StreamParams): AsyncGenerator<string> {
  const stream = await getClient().chat.completions.create({
    model: model(),
    max_tokens: maxTokens,
    stream: true,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

// Non-streaming completion for short, server-only outputs (e.g. campaign recaps
// rendered after a save). Throws if DeepSeek is misconfigured or errors.
export async function completion({
  system,
  prompt,
  maxTokens,
}: StreamParams): Promise<string> {
  const res = await getClient().chat.completions.create({
    model: model(),
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });
  return res.choices[0]?.message?.content?.trim() ?? "";
}
