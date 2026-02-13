Meeting Title: Sprint Planning – Action Items Tracker
Date: 12 Feb, 2026
Participants: Ashraful (Lead Dev), Riya (Frontend), Karan (Backend), Mehul (QA), Sana (PM)

[00:00] Sana: Okay guys, quick sync. Agenda today: finalize extraction flow, status endpoint, and UI for action items.

[00:02] Ashraful: Yeah. First thing – backend /api/transcripts route is mostly ready but we still need validation. Karan, can you add Joi validation before Friday (16 Feb)?

Karan: Yes, I’ll handle that. Deadline 16th Feb EOD.

[00:05] Riya: On the UI side, I’ve created the paste box and submit button. But we still need the recent transcripts component separated from Dashboard.

Sana: Right. Riya, please extract RecentTranscripts into a separate component and connect it to /api/transcripts/recent by tomorrow.

Riya: Tomorrow meaning 13 Feb?

Sana: Yes, 13 Feb before 6 PM.

[00:10] Mehul: Testing point – we need sample messy transcripts to test edge cases like missing owners and vague deadlines.

Ashraful: Good point. Mehul, prepare at least 5 test transcripts and upload them to the shared drive by Monday (17 Feb).

Mehul: Noted.

[00:15] Discussion about LLM health check

Karan: The /status endpoint currently only checks server uptime. We still need DB ping and OpenAI test call.

Ashraful: Agreed. Karan, add MongoDB connection check and a lightweight OpenAI test completion call. Let’s target 15 Feb.

Karan: Okay, 15 Feb EOD.

[00:20] Sana: Also, we forgot about editing tasks. Users must be able to:

Edit task text

Assign owner

Add/change due date

Mark done/undone

Delete task

Riya, can you handle edit + delete in UI?

Riya: Yes, I’ll complete edit & delete by Sunday (16 Feb).

[00:25] Random discussion

Ashraful: Someone needs to update README.md and add .env.example properly.

Sana: I’ll take that. I’ll finish documentation updates by 18 Feb.

[00:28] Mehul: What about basic tests?

Ashraful: Right. I’ll write minimal backend tests for transcript creation and status endpoint. Target date: 19 Feb.

[00:30] Open issues:

Owner field optional? → Yes.

Due date optional? → Yes.

JSON-only LLM response enforced? → Karan to double-check prompt formatting today.

Add AI_NOTES.md and PROMPTS_USED.md → Ashraful to create both by 18 Feb.

[00:35] Side note

Riya mentioned maybe redesigning the action item card layout next week (no fixed deadline yet).

[00:37] Final recap (quick verbal):

Karan → Joi validation (16 Feb)

Riya → Separate RecentTranscripts + connect API (13 Feb), Edit/Delete UI (16 Feb)

Mehul → 5 messy transcripts for QA (17 Feb)

Karan → Improve /status with DB + LLM check (15 Feb)

Sana → Documentation updates (18 Feb)

Ashraful → Backend tests (19 Feb)

Ashraful → Create AI_NOTES.md & PROMPTS_USED.md (18 Feb)

Karan → Verify JSON-only prompt formatting (today)