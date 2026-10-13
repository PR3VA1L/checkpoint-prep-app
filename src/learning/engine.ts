import type {
  Question,
  Selection,
  Seen,
  Review,
  Attempt,
  Answer,
} from "./types";
import { MATH_FAMILIES } from "./math.js";
import { SCIENCE_FAMILIES } from "./science.js";
import {
  ENGLISH_FAMILIES,
  READINGS,
  readingQuestion,
  writingTask,
} from "./english.js";
import { shuffle, futureDay } from "./random.js";
import { EXTENSION_FAMILIES } from "./extension.js";
import { CHALLENGE_FAMILIES } from "./challenge.js";
import { ENGLISH_EXTRA_FAMILIES } from "./englishExtra.js";
import { SCIENCE_EXTRA_FAMILIES } from "./scienceExtra.js";
export const FAMILIES = [
  ...MATH_FAMILIES,
  ...SCIENCE_FAMILIES,
  ...ENGLISH_FAMILIES,
  ...EXTENSION_FAMILIES,
  ...CHALLENGE_FAMILIES,
  ...ENGLISH_EXTRA_FAMILIES,
  ...SCIENCE_EXTRA_FAMILIES,
];
export function fingerprint(q: Question) {
  // Changing distractors, answer order or difficulty labels cannot make a seen
  // stem fresh. Structured questions share this identity with their MCQ form.
  const text = JSON.stringify([
    q.subject,
    q.stem.replace(/\s+/g, " ").trim(),
    q.diagram?.kind === "foodweb"
      ? { ...q.diagram, edges: q.diagram.edges.map(({ from, to }) => [from, to]) }
      : q.diagram?.kind === "grid"
        ? { ...q.diagram, points: q.diagram.points.map(({ x, y, label }) => [x, y, label]) }
        : q.diagram || null,
  ]);
  let a = 2166136261,
    b = 5381;
  for (const c of text) {
    a = Math.imul(a ^ c.charCodeAt(0), 16777619);
    b = Math.imul(b, 33) ^ c.charCodeAt(0);
  }
  return `q-${(a >>> 0).toString(36)}-${(b >>> 0).toString(36)}`;
}
export function shuffleOptions(q: Question, random = Math.random): Question {
  if (!q.options.length) return q;
  const answer = q.options[q.correctIndex];
  const options = shuffle(q.options, random);
  return { ...q, options, correctIndex: options.indexOf(answer) };
}
export function selectQuestions(
  config: Selection,
  seen: Seen[],
  reviews: Review[],
  today: string,
  random = Math.random,
): Question[] {
  const excluded = new Set(seen.map((s) => s.id));
  const blocked = new Set(
    reviews
      .filter((r) => r.correct === 0 && (r.lastDay === today || r.due > today))
      .map((r) => r.family),
  );
  const due = new Set(
    reviews
      .filter((r) => r.due <= today && r.lastDay !== today)
      .map((r) => r.family),
  );
  const level = () =>
    config.difficulty === "Mixed"
      ? (["Easy", "Medium", "Hard"] as const)[Math.floor(random() * 3)]
      : config.difficulty;
  if (config.mode === "writing")
    return shuffle(
      Array.from({ length: 40 }, (_, i) =>
        writingTask(config.paper, i, level()),
      ),
      random,
    )
      .filter((q) => !excluded.has(q.id) && !blocked.has(q.family))
      .sort((a, b) => Number(due.has(b.family)) - Number(due.has(a.family)))
      .slice(0, 1);
  if (config.subject === "english" && config.mode === "structured")
    return shuffle(
      READINGS.filter((r) => r.paper === config.paper),
      random,
    )
      .map((r) => readingQuestion(r, level()))
      .filter((q) => !excluded.has(q.id) && !blocked.has(q.family))
      .slice(0, 1);
  const families = shuffle(
    FAMILIES.filter(
      (f) =>
        f.subject === config.subject &&
        (!config.topics.length || config.topics.includes(f.topic)) &&
        !blocked.has(f.id),
    ),
    random,
  );
  families.sort((a, b) => Number(due.has(b.id)) - Number(due.has(a.id)));
  const pools = families.map((f) => ({
    f,
    variants: shuffle(
      Array.from({ length: f.variants }, (_, i) =>
        (config.difficulty === "Mixed"
          ? (["Easy", "Medium", "Hard"] as const)
          : [config.difficulty]
        ).map((difficulty) => ({ variant: i, difficulty })),
      ).flat(),
      random,
    ),
  }));
  const selected: Question[] = [];
  const topics = new Set<string>();
  // First pass covers every selected topic; subsequent passes balance families.
  pools.sort(
    (a, b) =>
      config.topics.indexOf(a.f.topic) - config.topics.indexOf(b.f.topic),
  );
  const passes = config.mode === "mcq" ? 1 : config.count;
  for (let pass = 0; pass < passes && selected.length < config.count; pass++) {
    const ordered = shuffle(pools, random);
    while (ordered.length) {
      // Re-evaluate after each pick; sorting once can consume the session with
      // several families from the same topic before later topics get a turn.
      ordered.sort(
        (a, b) =>
          (config.difficulty === "Hard" && !selected.some((q) => q.family.startsWith("challenge-"))
            ? Number(b.f.id.startsWith("challenge-")) - Number(a.f.id.startsWith("challenge-"))
            : 0) ||
          Number(topics.has(a.f.topic)) - Number(topics.has(b.f.topic)) ||
          Number(due.has(b.f.id)) - Number(due.has(a.f.id)),
      );
      const pool = ordered.shift()!;
      while (pool.variants.length) {
        const { variant, difficulty } = pool.variants.pop()!;
        const questionPaper = config.mode === "mcq" && config.subject === "math"
          ? (selected.length % 2 === 0 ? 1 : 2)
          : config.paper;
        const q = pool.f.make(variant, difficulty, questionPaper);
        if (config.mode === "mcq" && config.subject === "math")
          q.calculatorAllowed = questionPaper === 2;
        q.id = fingerprint(q);
        if (excluded.has(q.id)) continue;
        excluded.add(q.id);
        selected.push(shuffleOptions(q, random));
        topics.add(q.topic);
        break;
      }
      if (selected.length >= config.count) break;
    }
  }
  return shuffle(selected, random);
}
export function nextReview(
  family: string,
  correct: boolean,
  today: string,
  previous?: Review,
  random = Math.random,
): Review {
  const streak = correct ? (previous?.correct || 0) + 1 : 0;
  return {
    family,
    lastDay: today,
    correct: streak,
    due: futureDay(
      today,
      correct ? Math.min(30, 3 + streak * 3) : 2 + Math.floor(random() * 6),
    ),
  };
}
export function scoreAnswers(answers: Record<string, Answer>) {
  return Object.values(answers).reduce(
    (r, a) => ({ score: r.score + a.score, total: r.total + a.max }),
    { score: 0, total: 0 },
  );
}
export function summarise(attempts: Attempt[]) {
  const done = attempts.filter((a) => a.status === "completed");
  const graded = done.filter((a) => a.grading !== "awaiting-review");
  const topics: Record<
    string,
    { score: number; total: number; count: number }
  > = {};
  for (const a of graded) {
    // A capped writing score must not become an uncapped 100% in topic reports.
    if (a.mode === "writing") {
      const key = "english:language",
        row = topics[key] || { score: 0, total: 0, count: 0 };
      row.score += a.score;
      row.total += a.total;
      row.count++;
      topics[key] = row;
      continue;
    }
    for (const item of Object.values(a.answers || {})) {
      if (!item.max) continue;
      const key = `${a.subject}:${item.topic}`;
      const row = topics[key] || { score: 0, total: 0, count: 0 };
      row.score += item.score;
      row.total += item.max;
      row.count++;
      topics[key] = row;
    }
  }
  return {
    sessions: done.length,
    questions: done
      .filter((a) => a.mode === "mcq")
      .reduce(
        (n, a) =>
          n +
          Object.values(a.answers || {}).filter((v) => v.value !== "").length,
        0,
      ),
    structured: done.filter((a) => a.mode !== "mcq").length,
    pending: done.filter((a) => a.grading === "awaiting-review").length,
    score: graded.reduce((n, a) => n + a.score, 0),
    total: graded.reduce((n, a) => n + a.total, 0),
    topics,
  };
}
