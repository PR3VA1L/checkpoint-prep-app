# Structured-answer marking backend

Status: implemented locally on 12 October 2026; **not deployed**. No model provider has been connected or validated. The model path is off by default.

## Flow

1. The student submits a structured attempt. The browser saves answers in its existing Firestore session and sends only the attempt ID and Firebase identity token to `POST /api/mark`.
2. The server fetches that user's completed attempt. It reconstructs each question from the authored family or long reading passage in `src/learning`; the key and marking guidance embedded in a client-writable session are never trusted.
3. Exact matches, equivalent simple numbers with matching units, and blank answers receive immediate rule-based marks. Optional educator-authored `markPoints` can award full marks when every required phrase is found without obvious negation. This is deliberately conservative: a different answer, a missing point, or a potentially contradictory statement remains pending. Do not use raw substring or fuzzy similarity to award a mark merely because a word such as “condensation” appears.
4. If the optional private model is enabled, unresolved parts are sent together with the authored question context, answer and guidance. Ollama returns structured marks and concise feedback. Results with unknown IDs, out-of-range marks, invalid feedback or reported confidence below 0.8 are discarded and remain pending.
5. The API rechecks that the saved attempt has not changed while marking, writes marks and feedback to the same Firestore session, and returns the updated attempt. The site shows the result. AI-assisted grades are labelled **practice estimates**, not official Cambridge marks. Pending parts can be reviewed manually.

No Google Sheet or second student-answer database is needed. Firestore already stores the attempt; copying children's work into a Sheet would add a privacy and reliability burden. A Sheet could later hold teacher-reviewed authoring material, but should not be the live answer queue.

## Optional self-hosted model

The adapter speaks Ollama's local `/api/chat` JSON-schema interface. It does not call the DeepSeek hosted API or Gemini. A suitable open-weight model can be served by Ollama on a separate machine; the exact model, licence, hardware, latency and marking quality must be checked before release. The full DeepSeek-R1 is far too large to assume it will fit on ordinary Vercel hosting; a distilled model is a candidate for benchmarking, **not** an approved marker.

Keep `MARKER_AI_ENABLED=false` until a teacher-marked benchmark passes. Set all of the following **server-side** only:

- `MARKER_AI_ENABLED=true` after approval;
- `MARKER_OLLAMA_URL` to the private model gateway base URL;
- `MARKER_OLLAMA_MODEL` to the exact installed model tag;
- `MARKER_OLLAMA_TOKEN` to a token enforced by the gateway.

## Optional Cloudflare Workers AI model

The server also has a Cloudflare Workers AI adapter. It calls Cloudflare's chat-completions API using a server-side token; pupils never receive the token. Configure `MARKER_PROVIDER=cloudflare`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_TOKEN`, and an exact `CLOUDFLARE_AI_MODEL` model ID. Leave `MARKER_AI_ENABLED=false` until a real account, chosen model, child-data terms, model licence, capacity and teacher-marked evaluation have been verified. The adapter has only a mocked transport test so far; **it has not been tested against a live Cloudflare account**. Some models need a paid plan. If Cloudflare fails or is over quota, unresolved parts remain pending. Do not use the free-tier quota as a production reliability guarantee.

For Vercel, link this directory to a Vercel project and set the six public `VITE_FIREBASE_*` build variables from the existing local Firebase configuration. Set `FIREBASE_SERVICE_ACCOUNT_KEY` as a **server-only** secret for the Vercel functions. Set `CLOUDFLARE_ACCOUNT_ID=39046456f5da1bf1758f8f85cb008f7f` and the rotated `CLOUDFLARE_AI_TOKEN` as server-only variables. Start with `MARKER_AI_ENABLED=false`; set `MARKER_PROVIDER=cloudflare` and a supported JSON-mode `CLOUDFLARE_AI_MODEL` only for a controlled preview evaluation. Do not add the old `VITE_GEMINI_API_KEY` to Vercel: the child-facing Gemini endpoint is intentionally disabled.

The existing authored guidance is mostly prose, not a detailed per-mark examiner scheme. `markPoints` must be added selectively after educator review. Do not generate them from answer text: a keyword can occur in an incorrect sentence, and missing keywords can occur in a correct paraphrase. Self-reported model confidence is only a screening signal, not proof of marking accuracy.

The API requires HTTPS and a bearer token for non-loopback model hosts. Ollama itself should remain on a private/local interface behind a TLS/auth gateway. Never expose its port or any token in `VITE_` settings. If the model is unavailable or slow, the rules-based marks still save and the rest remain awaiting review.

## Before enabling for pupils

- Give each authored part an educator-reviewed point-by-point mark scheme, accepted alternative answers, and examples of partial credit. Current `Part.answer` and `Part.guidance` are a starting point, not comprehensive examiner schemes.
- Prepare an anonymised set of real or teacher-written responses across subjects and difficulties, including misconceptions, alternative valid methods, spelling variation and prompt-injection attempts. Compare every model mark and explanation with teacher decisions. Set a conservative threshold for sending disagreements to review.
- The offline `npm run marking:evaluate -- path/to/examples.json` command measures exact agreement, severe disagreements and abstentions against a teacher-reviewed JSON array. Each row has `context`, `question`, `scheme`, `expected`, `answer`, `max` and `teacherScore`. Keep this sensitive file under ignored `artifacts/marker-eval`; the evaluator reports aggregate counts only and writes nothing to Firebase. Do not enable the model based on a tiny synthetic set.
- Measure the model host's latency and Vercel's function timeout with full 20/25-mark papers. The current API waits up to 25 seconds for one model batch; a slower host will require an asynchronous worker/queue.
- Test Firestore rules, concurrent editing, recovery on another browser, parent dashboards, account-linking and the full deployment. This is practice software; client-writable sessions are **not tamper-resistant exam records**.
- Set retention, access and consent rules for children's answers and test a manual appeal/override path. Do not paste student answers into public AI services.

Run `npm test`, `npm run lint` and `npm run build`. The tests cover scheme reconstruction, rule matching, pending method marks and validation of model outputs. They do not prove that any model marks correctly.
