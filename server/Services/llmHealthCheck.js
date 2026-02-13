import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function withTimeout(promise, ms = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { ctrl, wrapped: promise.finally(() => clearTimeout(t)) };
}

export async function llmHealthCheck() {
  const start = Date.now();

  // if key missing, fail fast
  if (!process.env.OPENAI_API_KEY) {
    return { ok: false, ms: 0, error: "OPENAI_API_KEY missing" };
  }

  const req = client.responses.create(
    {
      model: process.env.OPENAI_HEALTH_MODEL || "gpt-4.1-mini",
      input: "Reply with exactly: ok",
      max_output_tokens: 16,
    },
 
  );



  const r = await req; // simplest version

  const text = (r.output_text || "").trim().toLowerCase();
  const ok = text.includes("ok");

  return { ok, ms: Date.now() - start, model: process.env.OPENAI_HEALTH_MODEL || "gpt-4.1-mini" };
}
