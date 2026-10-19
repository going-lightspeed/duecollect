import OpenAI from "openai";

/**
 * Local AI — NVIDIA Cosmos3 served by vLLM (OpenAI-compatible API).
 *
 * Start the server from the cosmos-framework repo (see .env.example), then
 * DueCollect talks to http://localhost:8000/v1. Any other OpenAI-compatible
 * local server (Ollama, LM Studio, llama.cpp) works too — just change the
 * LOCAL_AI_* variables.
 */
export function localAiSettings() {
  return {
    baseUrl: (process.env.LOCAL_AI_BASE_URL || "http://localhost:8000/v1").replace(
      /\/$/,
      "",
    ),
    model: process.env.LOCAL_AI_MODEL || "nvidia/Cosmos3-Nano",
    apiKey: process.env.LOCAL_AI_API_KEY || "local",
    timeoutMs: Number(process.env.LOCAL_AI_TIMEOUT_MS || 120_000),
  };
}

function client() {
  const s = localAiSettings();
  return new OpenAI({
    apiKey: s.apiKey,
    baseURL: s.baseUrl,
    timeout: s.timeoutMs,
    maxRetries: 0,
  });
}

export type AiImage = { mimeType: string; base64: string };

export async function localChat(opts: {
  system: string;
  user: string;
  images?: AiImage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const s = localAiSettings();
  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
  for (const img of opts.images ?? []) {
    content.push({
      type: "image_url",
      image_url: { url: `data:${img.mimeType};base64,${img.base64}` },
    });
  }
  content.push({ type: "text", text: opts.user });

  const res = await client().chat.completions.create({
    model: s.model,
    max_tokens: opts.maxTokens ?? 400,
    temperature: opts.temperature ?? 0.3,
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content },
    ],
  });
  return res.choices[0]?.message?.content?.trim() ?? "";
}

/** Pull the first JSON object out of a model reply (models often add prose). */
export function extractJson<T>(raw: string): T | null {
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]) as T;
  } catch {
    return null;
  }
}

/** Quick reachability check for the admin panel. */
export async function localAiHealth(): Promise<{
  reachable: boolean;
  error?: string;
}> {
  const s = localAiSettings();
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${s.baseUrl}/models`, {
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${s.apiKey}` },
    });
    clearTimeout(t);
    return res.ok
      ? { reachable: true }
      : { reachable: false, error: `HTTP ${res.status}` };
  } catch (err) {
    return {
      reachable: false,
      error: err instanceof Error ? err.message : "unreachable",
    };
  }
}
