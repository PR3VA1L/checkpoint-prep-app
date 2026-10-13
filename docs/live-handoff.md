# Checkpoint Prep: current state and safe live handoff

As of 12 October 2026, this checkout is **not published**. The substantial rebuild and the new Stage 6 challenge families are local, uncommitted changes. Do not assume the GitHub `main` branch includes them.

## Question bank and repetition

- 75 authored question families generate 11,364 distinct MCQ stems: 8,533 maths, 2,399 science, 432 English. These are parameterised variations, **not** 11,364 independent authored designs.
- There are six long English reading passages (three per paper) and 80 writing prompts. These are the shortest pools; when they run out, the app must report exhaustion rather than repeat a text.
- `src/learning/engine.ts` fingerprints the stem and diagram, excludes every ID in the signed-in user's `seen` collection, and postpones a wrong-answer family by 2–7 days. `src/learning/store.ts` reserves selected IDs in a Firestore transaction before starting an attempt. The no-repeat guarantee depends on the Firestore rules and signed-in identity working in production. Old practice history predating this bank may not be recoverable.
- Similar-looking templates can still recur with different numbers, names or contexts. More independently authored, teacher-reviewed families and passages remain desirable.

## Current AI boundary

- Question selection, generation, hints and explanations do not call AI. The questions and mark guidance are authored in `src/learning`.
- A structured-marking backend now exists: authenticated `/api/mark` rebuilds authored schemes server-side, rule-checks clear answers, and leaves ambiguous answers pending. A private Ollama model adapter is present but **disabled by default** and has not been benchmarked or deployed. Manual review remains available. The disabled transcription control was removed from the practice screen.
- If AI marking is later enabled, restrict it to structured responses. Use the server's trusted session and a versioned, server-owned mark scheme per part; do not accept a client-provided answer key or mark scheme. Return criterion-by-criterion evidence, awarded marks, uncertainty and a review flag, cap every award at the part maximum, and allow a parent/teacher override. Test alternative correct methods, equivalent wording, blank answers and adversarial text. Obtain a provider agreement and privacy assessment suitable for a child-directed service first. Do not re-enable the old browser-key Gemini flow.

## Server and deployment

- Firebase Authentication and Firestore are used. Firestore security rules are in `firestore.rules` and must be deployed before testing the new frontend against real accounts.
- No Firebase Cloud Function is required by the current architecture. `api/account.ts` is a **Vercel serverless function** needed for role repair and secure one-time parent invitations. It uses the server-only `FIREBASE_SERVICE_ACCOUNT_KEY` secret. The frontend's `VITE_FIREBASE_*` values are public Firebase web configuration, not admin credentials.
- `api/gemini.ts` returns 503 without calling an AI provider. It is not needed for normal practice.
- Deploy the Vercel frontend and account API together, and deploy Firestore rules to the matching Firebase project. Verify `/api/account` is a function, not rewritten to `index.html`; verify the account secret is present only server-side.
- The Firebase CLI on this machine currently fails before listing projects, and no Vercel project link/CLI is present. Deployment ownership/credentials must be verified by the user. Never paste a service account JSON or token into a chat, commit or `VITE_` variable.

## Minimum release sequence

1. Review the working-tree diff; preserve all local changes. Run `npm ci`, `npm test`, `npm run lint`, and `npm run build` from this repository.
2. Have a Cambridge Primary teacher check a representative sample of every family, with extra attention to Hard items and mark guidance. This is Cambridge-like practice, not an official Cambridge product.
3. Use a non-production Firebase project first. Validate role permissions, invite expiry and reuse, linked/unlinked parent reads, the same UID in Edge and Chrome, concurrent starts, result saves, and Firestore no-repeat reservations. Use Firebase emulator tests for access rules.
4. Set public Firebase web variables for the correct project and the service-account JSON as a server-only Vercel secret. Add the deployment domain to Firebase Authentication authorised domains. Deploy Firestore rules and the Vercel site/API as a matched release.
5. Smoke-test real student and parent accounts, then promote to production. Confirm data-retention/privacy policy and monitor database costs. Do not describe self-assessed or AI results as official Cambridge grades.

If you continue in Antigravity, open this exact repository path and this document; do **not** start from an older GitHub checkout. The self-hosted model path remains disabled until it has a secured host and passes explicit teacher-marked evaluation; see `docs/marking-backend.md`.
