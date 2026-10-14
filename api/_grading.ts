import { FAMILIES, fingerprint } from "../src/learning/engine.js";
import { READINGS, readingQuestion } from "../src/learning/english.js";
import type { Attempt, Part, Question, Answer, MarkCriterion, CriterionResult } from "../src/learning/types";

export const MARK_SCHEME_VERSION = "checkpoint-criteria-v3";
export type MarkedPart = {
  score: number;
  feedback: string;
  method: "rules" | "model" | "pending";
  confidence: number;
  criteria?: CriterionResult[];
};
export type MarkingJob = {
  key: string;
  context: string;
  question: string;
  scheme: string;
  expected: string;
  answer: string;
  max: number;
  criteria?: MarkCriterion[];
};

// Reconstruct the authored question on the server. A Firestore session is
// client-writable, so never treat its embedded answer or guidance as a key.
export function canonicalQuestion(stored: Question, paper: 1 | 2): Question {
  let found: Question | undefined;
  if (stored.subject === "english" && stored.id.startsWith("v3-reading-")) {
    const reading = READINGS.find(
      (r) => r.id === stored.id.slice("v3-reading-".length) && r.paper === paper,
    );
    if (reading) found = readingQuestion(reading, stored.difficulty);
  } else {
    const family = FAMILIES.find(
      (f) =>
        f.id === stored.family &&
        f.subject === stored.subject &&
        f.topic === stored.topic,
    );
    if (family)
      for (let variant = 0; variant < family.variants; variant++) {
        const q = family.make(variant, stored.difficulty, paper);
        if (fingerprint(q) === stored.id) {
          found = { ...q, id: stored.id };
          break;
        }
      }
  }
  if (
    !found ||
    found.stem !== stored.stem ||
    found.objective !== stored.objective ||
    found.parts.length !== stored.parts?.length ||
    found.parts.some(
      (part, index) =>
        part.id !== stored.parts[index].id ||
        part.text !== stored.parts[index].text ||
        part.marks !== stored.parts[index].marks,
    )
  )
    throw new Error("This question does not match the reviewed marking bank.");
  return found;
}

const normalise = (value: string) =>
  value
    .normalize("NFKC")
    .toLowerCase()
    // Decimal points and coordinate separators are meaningful answer content.
    .replace(/[.!?]$/, "")
    .replace(/[!?;:'“”‘’]/g, "")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ")
    .trim();

function simpleNumber(value: string): { number: number; unit: string } | null {
  const match = value
    .trim()
    .toLowerCase()
    .match(/^(-?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*\d+)?)\s*([a-z%°²³]*)$/);
  if (!match) return null;
  const [top, bottom] = match[1].split("/");
  const number = bottom ? Number(top) / Number(bottom) : Number(top);
  return Number.isFinite(number) ? { number, unit: match[2] } : null;
}

function criteriaMark(part: Part, response: string): MarkedPart | null {
  if (!part.markPoints?.length || part.marks !== 1 || part.markPoints.length !== 1) return null;
  const words = ` ${normalise(response).replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `;
  // A phrase hit is evidence, not proof. Negation, uncertainty, or a correction
  // may reverse its meaning, so leave these responses for semantic review.
  if (/\b(no|not|never|isnt|doesnt|dont|cannot|cant|wrong|incorrect|but|however|maybe|perhaps)\b/.test(words)) return null;
  const allFound = part.markPoints.every((point) => point.alternatives.some((alternative) => {
    return normalise(response) === normalise(alternative);
  }));
  if (!allFound) return null;
  return {
    score: part.marks,
    feedback: "Your answer includes all the required marking points.",
    method: "rules",
    confidence: 0.9,
  };
}

export function ruleMark(part: Part, response: string): MarkedPart {
  if (!response.trim())
    return {
      score: 0,
      feedback: "No answer was submitted for this part.",
      method: "rules",
      confidence: 1,
    };
  const exact = [part.answer, ...(part.exact || [])];
  if (!part.semanticOnly && exact.some((x) => normalise(x) === normalise(response)))
    return {
      score: part.marks,
      feedback: "Your answer matches the marking guidance for this part.",
      method: "rules",
      confidence: 1,
    };
  const given = simpleNumber(response);
  const formSensitive = /fraction|simplest form|decimal places|nearest|round(?:ed)?|percentage|percent|coordinate|ratio/i.test(part.text);
  if (!part.semanticOnly && !formSensitive && given && exact.some((x) => {
    const target = simpleNumber(x);
    return target && target.unit === given.unit && Math.abs(target.number - given.number) < 1e-9;
  }))
    return {
      score: part.marks,
      feedback: "Your number is equivalent to the answer in the marking guidance.",
      method: "rules",
      confidence: 1,
    };
  const criteria = part.semanticOnly ? null : criteriaMark(part, response);
  if (criteria) return criteria;
  // A different answer may still earn a method/evidence mark. Never infer zero
  // from a failed string comparison.
  return {
    score: 0,
    feedback: "This needs checking against the marking guidance for equivalent wording or working.",
    method: "pending",
    confidence: 0,
  };
}

export function prepareMarking(attempt: Attempt) {
  if (attempt.schemaVersion !== 2 || attempt.mode !== "structured" || attempt.status !== "completed")
    throw new Error("Only submitted structured practice can be marked automatically.");
  if (!Array.isArray(attempt.questions) || attempt.questions.length < 1 || attempt.questions.length > 20)
    throw new Error("Invalid structured paper.");
  if (![1, 2].includes(attempt.paper) || new Set(attempt.questions.map((q) => q.id)).size !== attempt.questions.length ||
      attempt.questions.some((q) => q.subject !== attempt.subject)) throw new Error("Invalid structured paper identity.");
  const results: Record<string, MarkedPart> = {};
  const jobs: MarkingJob[] = [];
  for (const stored of attempt.questions) {
    const q = canonicalQuestion(stored, attempt.paper);
    const reading = q.id.startsWith("v3-reading-")
      ? READINGS.find((r) => r.id === q.id.slice("v3-reading-".length))
      : undefined;
    for (const part of q.parts) {
      const key = `${q.id}:${part.id}`;
      const answer = attempt.answers[key];
      const response = typeof answer?.value === "string" ? answer.value : "";
      if (response.length > 6000) throw new Error("An answer is too long to mark safely.");
      const result = ruleMark(part, response);
      if (result.method === "rules" && result.score > 0)
        result.feedback = `Correct. ${q.subject === "english" ? part.guidance : q.explanation}`.slice(0, 500);
      const criteria = part.criteria || (part.marks === 1
        ? [{ id: "point1", description: part.guidance + " Reference answer: " + part.answer }]
        : undefined);
      if (!criteria || criteria.length !== part.marks || new Set(criteria.map((c) => c.id)).size !== criteria.length)
        throw new Error("This question needs a complete point-by-point mark scheme.");
      if (result.method === "rules") result.criteria = criteria.map((criterion) => ({
        id: criterion.id, description: criterion.description,
        awarded: result.score === part.marks, evidence: response,
        feedback: result.score ? "Awarded under this question’s marking guidance." : "No answer was submitted.",
      }));
      results[key] = result;
      if (result.method === "pending")
        jobs.push({
          key,
          context: reading ? reading.paragraphs.join("\n\n") : q.context + (q.diagram ? "\nDiagram data: " + JSON.stringify(q.diagram) : ""),
          question: part.text,
          scheme: part.guidance,
          expected: part.answer,
          answer: response,
          max: part.marks,
          criteria,
        });
    }
  }
  return { results, jobs };
}

export function applyMarks(
  attempt: Attempt,
  results: Record<string, MarkedPart>,
): Attempt {
  const answers: Record<string, Answer> = { ...attempt.answers };
  let total = 0;
  let usedModel = false;
  let pending = false;
  for (const q of attempt.questions)
    for (const part of q.parts) {
      const key = `${q.id}:${part.id}`;
      const result = results[key];
      if (!result) throw new Error("Incomplete marking result.");
      const previous = answers[key];
      answers[key] = {
        value: previous?.value || "",
        hint: previous?.hint || false,
        score: result.score,
        max: part.marks,
        topic: q.topic,
        family: q.family,
        reviewed: result.method !== "pending",
        feedback: result.feedback,
        markingMethod: result.method,
        markingUncertain: result.method === "model" && result.confidence < 0.8,
        ...(result.criteria ? { criteria: result.criteria } : {}),
      };
      total += result.score;
      usedModel ||= result.method === "model";
      pending ||= result.method === "pending";
    }
  return {
    ...attempt,
    questions: attempt.questions.map((q) => canonicalQuestion(q, attempt.paper)),
    answers,
    score: total,
    total: attempt.questions.reduce((sum, q) => sum + q.parts.reduce((n, p) => n + p.marks, 0), 0),
    grading: pending ? "awaiting-review" : usedModel ? "ai-assisted" : "automatic",
    markingVersion: MARK_SCHEME_VERSION,
    updatedAt: Date.now(),
  };
}
