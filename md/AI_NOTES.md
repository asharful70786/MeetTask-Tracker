# AI_NOTES.md

## Where AI Was Used

AI was used primarily for transcript processing and action item extraction.

Specifically:

* Converting raw meeting transcripts into structured action items
* Extracting task descriptions
* Detecting task owners (if mentioned)
* Detecting due dates (if mentioned)
* Returning structured JSON output for database storage

Custom system and user prompts were written to ensure consistent structured output.

---

## LLM Details

* Provider: OpenAI
* Model: gpt-4o-mini

### Why gpt-4o-mini?

* Good balance between cost and performance
* Fast response time
* Reliable structured JSON output
* Suitable for MVP-level production usage

The goal was to maintain efficiency while keeping API costs reasonable.

---

## Validation & Manual Checks

The LLM output was manually tested multiple times to verify:

* Correct JSON structure
* Proper task extraction
* Correct owner detection
* Proper due date detection
* Clean handling when owner or due date is not found

If owner or due date is not detected, the system assigns "Not Found" to maintain structural consistency.

---

## Edge Cases Tested

The following scenarios were tested manually:

* Empty transcript submission
* Messy or unstructured transcript
* Transcript with no action items
* Transcript without owner mention
* Transcript without due date mention

Both frontend and backend include validation to prevent invalid input.

---

## Safeguards Implemented

* Regex-based input validation
* Strict JSON-only LLM output enforcement
* Try/catch blocks in all controllers
* Error handling for parsing failures
* Backend `/status` endpoint includes:

  * Backend health check
  * MongoDB connection check
  * LLM API connectivity check

---

## What Was Verified Manually 

* Prompt behavior and response consistency
* JSON structure reliability
* Database integration
* CRUD operations on extracted tasks
* Full transcript → LLM → Database → UI flow

I strongly believe in workflow, data flow, validation, and clean system logic first. All architecture decisions and the end-to-end data movement are designed and implemented by me. If we follow that rule, it gives us huge leverage.