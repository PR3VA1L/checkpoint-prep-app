# Checkpoint Prep rebuild — 9 October 2026

**12 October update:** A server-side structured-answer marker has been added since this snapshot. It checks unambiguous answers against reconstructed authored schemes and leaves others pending. A private Ollama adapter exists but is disabled pending hosting and teacher-marked evaluation. See [marking-backend.md](marking-backend.md); the historical notes below describe the 9 October state.

## Implemented

- Authored, objective-tagged question families replace the old runtime bank/fallback generator. Difficulty changes reasoning demand; settings and answer positions are shuffled.
- Stable content fingerprints exclude exact seen stems, including changes of difficulty labels, distractors and answer order. Firestore transactions reserve questions at session creation.
- Incorrect or hint-assisted skills wait 2–7 days before another variant is eligible, using the profile time zone. No exhausted-bank fallback silently recycles questions. Narrow MCQ sessions can be shorter; a structured session refuses to silently drop selected topics.
- Structured practice: Paper 1/2, difficulty, math/science topic selection and 20-mark half papers. Maths Paper 1 has no onscreen calculator; Paper 2 does. English offers fiction/non-fiction comprehension or writing, each 25 marks.
- React-rendered original diagrams: bar charts, coordinates, shapes, force arrows, food webs and circuits. Text alternatives, chart tables and no executable generated SVG/HTML.
- English writing: five criteria totalling 25, and short-response score caps. Partly marked scripts remain awaiting review. Self-assessment is explicitly labelled, not presented as an examiner grade.
- Account roles are read from Firestore, never defaulted to student on a new browser. First-time onboarding asks for a role; existing mistakes have an explicit role-repair action.
- Server-created, random, one-use, 24-hour parent invitations. Only server-created relationship documents authorize child reads. Browser-editable link arrays no longer grant permission.
- Live student/parent session subscriptions, saved-answer review, actual trends and per-topic results. Unmarked work is excluded from accuracy. Dashboards state their latest-200-session scope.
- Local draft/result recovery, explicit retry saving, persistent deadlines, safer calculator parser, responsive navigation and light/dark styles.
- Legacy daily AI generation is replaced by validation-only CI. The runtime does not import the old bank. Legacy sources remain for comparison; do not execute their seed/generation scripts.

## AI — a deliberate restriction, not a working feature

Core hints and explanations are authored and work without AI. The unsafe free-form proxy is removed. AI handwriting transcription and grading are currently unavailable; the endpoint makes no provider calls. Typed answers and self/parent/teacher marking remain available.

The public Gemini API terms inspected on 9 October 2026 prohibit clients directed at or likely accessed by under-18s. A proxy, paid key or parental consent does not itself override that restriction. Select an appropriately contracted child-suitable service and review data handling before adding another adapter. Never restore the VITE_GEMINI_API_KEY fallback.

## Run locally

Use Node 24 and the committed lockfile:

```sh
npm ci
npm test
npm run lint
npm run build
npm run content:export
```

The export writes offline review material under artifacts/content-review. It does not call AI or touch Firebase. A plain Vite dev server does not provide /api/account; use a staging deployment or a suitable local serverless setup for linking.

## Required release gates

1. Cambridge Primary teacher review of question correctness, objective mapping, mark guides and calibrated difficulty. Intended alignment is not certification.
2. A non-production Firebase project configured with public web settings and server-only FIREBASE_SERVICE_ACCOUNT_KEY.
3. Firebase emulator tests of owner/stranger/linked/unlinked access, invitation enumeration, profile-role protection, relationship writes, immutable seen IDs and session validation. Java was unavailable in PATH here, so emulator execution is not claimed.
4. Deploy API, rules and frontend together in staging; do not ship this frontend against the old rules.
5. Edge/Chrome checks with the same real Firebase UID; onboarding, role repair, invite expiry/reuse, unlink and revoked access. No family account was accessed or modified during this work.
6. Actual Firebase tests of offline/save retry, concurrent starts/edits, timer expiry and parent live updates. Mock-browser verification is not a substitute for authorization testing.
7. Data-retention/privacy review, rate-limit TTL cleanup and Firebase read-cost monitoring. Seen-history reads currently grow with usage.
8. Publish only after these gates. No deployment, git push, production migration or paid AI call is part of this local rebuild.

## Remaining boundaries

- Finite bank: numerical/name variants are not thousands of independently designed questions. New-bank no-repeat is enforced; incomplete legacy history cannot reconstruct everything previously seen.
- Six original long reading passages (three per paper) and 80 writing prompts form a starting collection, not a year of comprehension. Add reviewed passages; never disguise exhaustion by replaying them.
- Some families remain too straightforward for a demanding Hard label; difficulty calibration and distractor review are still required.
- Math/science currently use 10 two-mark groups. Actual papers have a richer mixture of marks and response forms. Drawing/plotting, matching and fill-in tables need further development.
- English comprehension now includes eight passage-specific short questions plus vocabulary, inference and language-effect tasks per passage. More independently authored texts and richer acceptable-answer examples remain needed.
- Client-scored/self-assessed practice is not tamper-resistant examination software.
- A timestamp guard rejects older overwrites, but simultaneous answer editing is not a full multi-device merge system. Use one editing tab per attempt.
- History beyond 200 sessions, bulk export, server-side longitudinal summaries, account-data deletion/export, retention automation and comprehensive screen-reader review remain work.
- Existing parent links must be re-invited: old arrays were not trustworthy authorization.
