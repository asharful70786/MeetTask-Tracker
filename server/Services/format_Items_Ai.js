import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

/**
 * Strict action-item extractor.
 * Input: raw meeting transcript text
 * Output: Array of action items (clean + validated)
 *
 * Each item:
 * {
 *   task: string,
 *   owner: string | null,
 *   dueDate: string | null,   // ISO date (YYYY-MM-DD) preferred, else null
 *   done: boolean
 * }
 */

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---- helpers ----
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizeDueDate(v) {
  // We accept YYYY-MM-DD only. Anything else becomes null (keep it strict).
  if (!isNonEmptyString(v)) return null;
  const s = v.trim();

  // basic ISO date check
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  return null;
}

function normalizeItem(item) {
  const task = isNonEmptyString(item?.task) ? item.task.trim() : null;
  if (!task) return null;

  const owner = isNonEmptyString(item?.owner) ? item.owner.trim() : null;

  const dueDate = normalizeDueDate(item?.dueDate);

  const done =
    typeof item?.done === "boolean" ? item.done : false;

  return { task, owner, dueDate, done };
}

function normalizeList(items) {
  if (!Array.isArray(items)) return [];
  const cleaned = [];
  for (const it of items) {
    const norm = normalizeItem(it);
    if (norm) cleaned.push(norm);
  }
  return cleaned;
}

// ---- main service ----
export default async function format_Items_Ai(transcript) {
  if (!isNonEmptyString(transcript)) {
    return [];
  }

  const system = `
You extract meeting action items from a transcript.

Return ONLY valid JSON.
No markdown. No explanations. No code fences.

Output must be a JSON array. Each element must be an object with EXACT keys:
- task (string, required)
- owner (string or null)
- dueDate (string in YYYY-MM-DD or null)
- done (boolean)

Rules:
- Only include real tasks (something someone must do).
- If owner is not mentioned, use null.
- If due date is not clearly stated, use null.
- done should default to false unless transcript clearly says it is already completed.
- Keep tasks concise but specific.
`;

  const user = `Transcript:\n${transcript}`;

  const resp = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" }, // We will wrap array inside object to stay safe
    messages: [
      { role: "system", content: system.trim() },
      {
        role: "user",
        content: `Return JSON in this shape:
{
  "items": [ ...actionItems ]
}

${user}`,
      },
    ],
  });

  const content = resp?.choices?.[0]?.message?.content;
  if (!content) return [];

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    // If model fails JSON, we fail safely
    return [];
  }

  const items = normalizeList(parsed?.items);
  return items;
}
