---
name: generate-cambridge-bank
description: Generates a balanced bank of Cambridge Checkpoint questions for MCQs and Structured practice.
---

# Workflow: Generating Cambridge Checkpoint Questions

1. Run `node scripts/generate-cambridge.js` to batch-generate questions.
2. The script must query `gemini-3.5-flash` using prompts adhering to the `cambridge-standards.md` rule.
3. Ensure the script generates both MCQ and Structured Exam variants.
4. If the user specifies 300 questions, chunk the generations (e.g., 10 loops of 30) to avoid API timeout.
