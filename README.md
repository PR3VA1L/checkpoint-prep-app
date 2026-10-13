# Checkpoint Prep

Independent Cambridge Primary Checkpoint-style practice for English, mathematics and science. React/TypeScript, Firebase authentication and Firestore, with server-side account linking.

## Development

Use Node 24, run `npm ci`, and supply the public Firebase configuration shown in `.env.example`. Server credentials must remain server-only. Run `npm run dev` for the frontend; account linking also needs the serverless API environment.

```sh
npm test
npm run lint
npm run build
npm run content:export
```

The content export is offline and does not write to Firebase. Do not run the retained legacy question-generation or seed scripts.

Read [release notes and deployment gates](docs/rebuild-release-notes.md) and [research basis](docs/research-basis.md) before releasing. Deploy the frontend, account API and Firestore rules together to staging first. This is practice software, not an official Cambridge product or a certified examination system.

Structured answers now have a [server-side automatic-marking pipeline](docs/marking-backend.md). Exact/equivalent answers can be marked without AI; ambiguous answers remain awaiting review. A private, self-hosted Ollama adapter exists but is **disabled by default** until a model host and teacher-marked evaluation are ready. Gemini and image transcription remain disabled. Self/parent/teacher review is still available.
