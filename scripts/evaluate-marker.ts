import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { markWithModel, modelConfigured } from "../api/_modelMark";
import type { MarkingJob } from "../api/_grading";

type Example = Omit<MarkingJob, "key"> & { teacherScore: number };
const path = process.argv[2];
if (!path) throw new Error("Usage: npm run marking:evaluate -- path/to/teacher-reviewed-examples.json");
if (!modelConfigured()) throw new Error("Configure the private model and set MARKER_AI_ENABLED=true for this offline evaluation.");
const rows = JSON.parse(readFileSync(resolve(path), "utf8")) as Example[];
if (!Array.isArray(rows) || rows.length < 1 || rows.length > 1000)
  throw new Error("Expected an array of 1–1000 teacher-reviewed examples.");
let exact = 0, severe = 0, pending = 0, error = 0;
for (const [index, row] of rows.entries()) {
  if (
    typeof row.question !== "string" || typeof row.scheme !== "string" ||
    typeof row.expected !== "string" || typeof row.answer !== "string" ||
    typeof row.context !== "string" ||
    !Number.isInteger(row.max) || row.max < 1 || row.max > 4 || !Array.isArray(row.criteria) || row.criteria.length !== row.max ||
    !Number.isInteger(row.teacherScore) || row.teacherScore < 0 || row.teacherScore > row.max
  ) throw new Error(`Invalid example at index ${index}`);
  try {
    const result = await markWithModel([{ key: String(index), context: row.context, question: row.question, scheme: row.scheme, expected: row.expected, answer: row.answer, max: row.max, criteria: row.criteria }]);
    const score = result[String(index)]?.score;
    if (score === undefined) pending++;
    else {
      exact += Number(score === row.teacherScore);
      severe += Number(Math.abs(score - row.teacherScore) > 1);
    }
  } catch {
    error++;
  }
}
const graded = rows.length - pending - error;
console.log(JSON.stringify({ examples: rows.length, graded, exact, exactAgreement: graded ? exact / graded : 0, severeDisagreements: severe, pending, errors: error }, null, 2));
if (error || severe) process.exitCode = 1;
