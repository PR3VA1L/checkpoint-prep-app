import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FAMILIES, fingerprint } from "../src/learning/engine";
import {
  READINGS,
  readingQuestion,
  writingTask,
} from "../src/learning/english";
// Offline authoring export. No AI calls, database writes, credentials or network.
const folder = resolve(process.argv[2] || "artifacts/content-review");
mkdirSync(folder, { recursive: true });
const questions = new Map();
for (const f of FAMILIES)
  for (const d of ["Easy", "Medium", "Hard"] as const)
    for (const p of [1, 2] as const)
      for (let v = 0; v < f.variants; v++) {
        const q = f.make(v, d, p);
        q.id = fingerprint(q);
        if (!questions.has(q.id)) questions.set(q.id, q);
      }
writeFileSync(
  resolve(folder, "authored-questions.jsonl"),
  [...questions.values()].map((q) => JSON.stringify(q)).join("\n") + "\n",
);
writeFileSync(
  resolve(folder, "reading-and-writing.json"),
  JSON.stringify(
    {
      readings: READINGS.map((r) => ({
        text: r,
        questions: readingQuestion(r, "Hard"),
      })),
      writing: ([1, 2] as const).flatMap((p) =>
        Array.from({ length: 40 }, (_, i) => writingTask(p, i, "Hard")),
      ),
    },
    null,
    2,
  ),
);
console.log(
  `Exported ${questions.size} distinct MCQ stems, ${READINGS.length} reading texts and 80 writing prompts to ${folder}. Variants are not independent pedagogical designs; teacher review is required.`,
);
