import type { Attempt, Answer } from "./types";
import { WRITING_RUBRIC } from "./curriculum";
export function reviewedResult(
  attempt: Attempt,
  answers: Record<string, Answer>,
): Pick<Attempt, "score" | "grading"> {
  const keys =
    attempt.mode === "writing"
      ? WRITING_RUBRIC.map((r) => "rubric-" + r.id)
      : attempt.questions.flatMap((q) => q.parts.map((p) => q.id + ":" + p.id));
  const complete = keys.every((k) => answers[k]?.reviewed);
  let score = keys.reduce((n, k) => n + (answers[k]?.score || 0), 0);
  if (attempt.mode === "writing") {
    const words = (answers.essay?.value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (words <= 20) score = 0;
    else if (words <= 60) score = Math.min(7, score);
  }
  return { score, grading: complete ? "self-assessed" : "awaiting-review" };
}
