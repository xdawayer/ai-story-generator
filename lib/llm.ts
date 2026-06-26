// Azure OpenAI (GPT) client + streaming helper.
// Auth/client construction copied from gengrowth-agents/src/lib/ai/client-providers.ts
// (the Azure path), trimmed to a single-provider streaming caller for this app.
// Provider is intentionally Azure-only for now (no Anthropic).
import { AzureOpenAI } from "openai";

const REQUEST_TIMEOUT_MS = 60_000;

function env(name: string): string {
  return process.env[name]?.replace(/\\n/g, "").trim() ?? "";
}

export function isLlmConfigured(): boolean {
  return Boolean(
    env("AZURE_OPENAI_API_KEY") &&
      env("AZURE_OPENAI_ENDPOINT") &&
      env("AZURE_OPENAI_DEPLOYMENT"),
  );
}

let client: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!client) {
    client = new AzureOpenAI({
      apiKey: env("AZURE_OPENAI_API_KEY"),
      endpoint: env("AZURE_OPENAI_ENDPOINT"),
      apiVersion: env("OPENAI_API_VERSION") || "2025-03-01-preview",
      deployment: env("AZURE_OPENAI_DEPLOYMENT"),
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

// Yields text deltas as the model streams. Throws if Azure is misconfigured or errors.
export async function* streamCompletion({
  system,
  prompt,
  maxTokens,
}: StreamParams): AsyncGenerator<string> {
  const deployment = env("AZURE_OPENAI_DEPLOYMENT");
  const stream = await getClient().chat.completions.create({
    model: deployment, // Azure uses the deployment name as the model id
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
