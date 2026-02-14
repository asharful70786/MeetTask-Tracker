# PROMPTS_USED.md

This file contains the prompts used during development.
(Only prompts — no model responses, no API keys.)

---

## 1) Action Item Extraction Prompt (System)

```text
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
```

---

## 2) Action Item Extraction Prompt (User)

```text
Return JSON in this shape:
{
  "items": [ ...actionItems ]
}

Transcript:
<TRANSCRIPT_FROM_FRONTEND>
```

---

## 3) Prompt Enforcement Notes (Implementation-Level)

The following rules were enforced in code (not just in prompts):

* Strict JSON parsing (`JSON.parse`) with safe failure
* Normalization/validation of extracted items:

  * `task` must be non-empty string
  * `owner` must be string or null
  * `dueDate` must match `YYYY-MM-DD` else null
  * `done` defaults to false if not explicitly provided

---

## 4) Development Prompts Used (ChatGPT Assistance)

AI assistance was used mainly for frontend UI implementation and refining the LLM prompt structure.

### Frontend UI Development

Used ChatGPT to:

* Convert my described UI requirements into React components
* Implement Task list UI, modal interactions, filters, and animations
* Translate backend response shape into frontend rendering logic

In these cases, I provided:

* The expected backend JSON structure
* The feature requirements
* My intended architecture and data flow

The AI generated component scaffolding on top of my structure and decisions.

### LLM Prompt Structuring

Used AI to refine:

* System prompt wording
* Strict JSON output instructions
* Response shape enforcement

Core backend architecture, routing, status endpoint design, data normalization, and workflow logic were implemented directly by me.

---

## 5) Test Prompts / Sample Transcripts

Sample messy transcripts used for testing are stored separately (e.g., `md/sample_test.md`).
This file intentionally does not include full transcripts to keep it short and focused on prompts.
