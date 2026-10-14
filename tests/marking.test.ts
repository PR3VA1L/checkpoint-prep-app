import test from "node:test";
import assert from "node:assert/strict";
import { FAMILIES, fingerprint, selectQuestions } from "../src/learning/engine";
import { seeded } from "../src/learning/random";
import { READINGS, readingQuestion } from "../src/learning/english";
import type { Attempt, Question } from "../src/learning/types";
import { canonicalQuestion, ruleMark, prepareMarking, applyMarks } from "../api/_grading";
import { acceptModelMarks, markWithOllama, markWithCloudflare } from "../api/_modelMark";

function paper(question: Question, value: string): Attempt {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    schemaVersion: 2,
    subject: question.subject,
    type: "Structured questions",
    mode: "structured",
    paper: 1,
    difficulty: question.difficulty,
    topics: [question.topic],
    questions: [question],
    answers: {
      [`${question.id}:${question.parts[0].id}`]: {
        value,
        hint: false,
        score: 0,
        max: question.parts[0].marks,
        topic: question.topic,
        family: question.family,
      },
    },
    startedAt: 1,
    completedAt: 2,
    score: 0,
    total: question.parts.reduce((n, part) => n + part.marks, 0),
    grading: "awaiting-review",
    status: "completed",
    durationSeconds: 1,
  };
}

test("server rebuilds the actual authored scheme instead of trusting a client-edited key", () => {
  const family = FAMILIES.find((f) => f.subject === "math")!;
  const question = family.make(7, "Hard", 1);
  question.id = fingerprint(question);
  const expected = question.parts[0].answer;
  question.parts[0].answer = "student-supplied fake key";
  const canonical = canonicalQuestion(question, 1);
  assert.equal(canonical.parts[0].answer, expected);
  assert.notEqual(canonical.parts[0].answer, question.parts[0].answer);
  question.parts[0].text = "student-supplied fake question";
  assert.throws(() => canonicalQuestion(question, 1), /does not match/);
});

test("exact and equivalent numeric answers score immediately; different answers await method review", () => {
  const part = { id: "a", text: "How much is left?", answer: "1/2", guidance: "Half", marks: 2 };
  assert.equal(ruleMark(part, "0.5").score, 2);
  assert.equal(ruleMark(part, " 1 / 2 ").score, 2);
  assert.equal(ruleMark(part, "",).score, 0);
  assert.equal(ruleMark(part, "3/4").method, "pending");
  assert.equal(ruleMark(part, "0.5 cm").method, "pending");
  assert.equal(ruleMark({ ...part, text: "Write a fraction in its simplest form." }, "0.5").method, "pending");
});

test("reviewed marking points accept phrases but abstain on negation or missing points", () => {
  const part = {
    id: "a", text: "Explain the change.", answer: "Water vapour cools and forms liquid water.",
    guidance: "One mark for cooling; one for liquid water forming.", marks: 2,
    markPoints: [
      { alternatives: ["water vapour cools", "the gas cools"] },
      { alternatives: ["liquid water forms", "turns into liquid water"] },
    ],
  };
  assert.equal(ruleMark(part, "The water vapour cools and liquid water forms." ).method, "pending");
  assert.equal(ruleMark(part, "The water vapour does not cool and liquid water forms.").method, "pending");
  assert.equal(ruleMark(part, "The water vapour cools.").method, "pending");
});

test("an authored science alternative is marked without trusting a bare keyword", () => {
  const q = FAMILIES.find((f) => f.id === "evaporation")!.make(0, "Medium", 1);
  assert.equal(ruleMark(q.parts[0], "Evaporation happens at the surface below boiling point.").score, 1);
  assert.equal(ruleMark(q.parts[0], "Evaporation happens at the surface, not below boiling point.").method, "pending");
  assert.equal(ruleMark(q.parts[0], "Evaporation").method, "pending");
});

test("rock group names accept the equivalent answer with rock appended", () => {
  const rock = FAMILIES.find((f) => f.id === "rock-cycle")!;
  for (let variant = 0; variant < rock.variants; variant++) {
    const part = rock.make(variant, "Easy", 1).parts[0];
    assert.equal(ruleMark(part, `${part.answer} rock`).score, 1);
  }
});

test("optional Cloudflare marker uses a server-side token and validates marks", async () => {
  const prior = {
    enabled: process.env.MARKER_AI_ENABLED, provider: process.env.MARKER_PROVIDER,
    account: process.env.CLOUDFLARE_ACCOUNT_ID, token: process.env.CLOUDFLARE_AI_TOKEN,
    model: process.env.CLOUDFLARE_AI_MODEL, fetch: globalThis.fetch,
  };
  Object.assign(process.env, {
    MARKER_AI_ENABLED: "true", MARKER_PROVIDER: "cloudflare",
    CLOUDFLARE_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
    CLOUDFLARE_AI_TOKEN: "private-test-token",
    CLOUDFLARE_AI_MODEL: "@cf/meta/llama-3.1-8b-instruct",
  });
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "https://api.cloudflare.com/client/v4/accounts/0123456789abcdef0123456789abcdef/ai/v1/chat/completions");
    assert.equal((init?.headers as Record<string, string> | undefined)?.Authorization, "Bearer private-test-token");
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ results: [
      { key: "one", confidence: 0.9, feedback: "The answer gives the required idea.", criteria: [{ id: "p1", awarded: true, evidence: "Response", feedback: "Required idea present." }] },
    ] }) } }] }), { status: 200 });
  };
  try {
    const marks = await markWithCloudflare([{ key: "one", context: "", question: "Why?", scheme: "One idea.", expected: "Idea", answer: "Response", max: 1, criteria: [{ id: "p1", description: "Required idea" }] }]);
    assert.equal(marks.one.score, 1);
  } finally {
    globalThis.fetch = prior.fetch;
    for (const [key, value] of [["MARKER_AI_ENABLED", prior.enabled], ["MARKER_PROVIDER", prior.provider], ["CLOUDFLARE_ACCOUNT_ID", prior.account], ["CLOUDFLARE_AI_TOKEN", prior.token], ["CLOUDFLARE_AI_MODEL", prior.model]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("a submitted paper receives safe partial marking and preserves pending answers", () => {
  const family = FAMILIES.find((f) => f.subject === "science")!;
  const q = family.make(1, "Hard", 1);
  q.id = fingerprint(q);
  const attempt = paper(q, q.parts[0].answer);
  const { results, jobs } = prepareMarking(attempt);
  assert.equal(jobs.length, 0);
  const marked = applyMarks(attempt, results);
  assert.equal(marked.grading, "automatic");
  assert.equal(marked.score, q.parts[0].marks);
  assert.equal(marked.answers[`${q.id}:${q.parts[1].id}`].score, 0);
  attempt.answers[`${q.id}:${q.parts[0].id}`].value = "A different explanation with working";
  const pending = prepareMarking(attempt);
  assert.equal(pending.jobs.length, 1);
  assert.equal(applyMarks(attempt, pending.results).grading, "awaiting-review");
});

test("reading questions are also reconstructed from the authored passage", () => {
  const reading = READINGS.find((item) => item.paper === 1)!;
  const q = readingQuestion(reading, "Hard");
  const canonical = canonicalQuestion(q, 1);
  assert.equal(canonical.parts.length, q.parts.length);
  const { jobs } = prepareMarking(paper(q, "A supported but differently worded answer"));
  assert.ok(jobs.length > 0);
  assert.ok(jobs[0].context.includes(reading.paragraphs[0]));
});

test("model marks outside the scheme are rejected, but a cautious valid decision is retained", () => {
  const jobs = [{ key: "one", context: "", question: "Q", scheme: "S", expected: "A", answer: "B", max: 2, criteria: [{ id: "m", description: "Method" }, { id: "a", description: "Answer" }] }];
  const marks = acceptModelMarks(jobs, { results: [
    { key: "one", score: 3, confidence: 1, feedback: "Not valid because it exceeds the maximum." },
    { key: "one", score: 3, confidence: -0.1, feedback: "The score cannot exceed the maximum." },
    { key: "other", score: 1, confidence: 1, feedback: "Not a real question key." },
  ] });
  assert.deepEqual(marks, {});
  const cautious = acceptModelMarks(jobs, { results: [
    { key: "one", confidence: 0.5, feedback: "The first point is supported, but the second point is missing.", criteria: [
      { id: "m", awarded: true, evidence: "B.", feedback: "The method point is shown." },
      { id: "a", awarded: false, evidence: "", feedback: "The final answer point is missing." },
    ] },
  ] });
  assert.equal(cautious.one.score, 1);
  const valid = acceptModelMarks(jobs, { results: [
    { key: "one", score: 99, confidence: 0.92, feedback: "One method mark is supported by the shown working.", criteria: [
      { id: "m", awarded: true, evidence: "B", feedback: "Valid method." },
      { id: "a", awarded: false, evidence: "", feedback: "Answer not correct." },
    ] },
  ] });
  assert.equal(valid.one.score, 1);
  assert.equal(valid.one.method, "model");
});

test("a bounded model total is retained with a light-confidence fallback if detail rows are omitted", () => {
  const jobs = [{ key: "one", context: "", question: "Q", scheme: "S", expected: "A", answer: "Working shown", max: 2, criteria: [{ id: "m", description: "Method" }, { id: "a", description: "Answer" }] }];
  const marks = acceptModelMarks(jobs, { results: [
    { key: "one", score: 1, confidence: 0.96, feedback: "The method is correct but the final answer is missing." },
  ] });
  assert.equal(marks.one.score, 1);
  assert.equal(marks.one.confidence, 0.7);
  assert.equal(marks.one.criteria?.[0].awarded, true);
});

test("complete maths and science half-papers can be marked from server-owned schemes", () => {
  for (const subject of ["math", "science"] as const)
    for (const paperNumber of [1, 2] as const) {
      const questions = selectQuestions(
        { subject, topics: [], difficulty: "Hard", count: 10, paper: paperNumber, mode: "structured" },
        [], [], "2026-10-12", seeded(70 + paperNumber),
      );
      const attempt = { ...paper(questions[0], ""), paper: paperNumber, questions };
      attempt.total = questions.flatMap((q) => q.parts).reduce((sum, part) => sum + part.marks, 0);
      attempt.answers = Object.fromEntries(questions.flatMap((q) => q.parts.map((part) => [
        `${q.id}:${part.id}`,
        { value: part.answer, hint: false, score: 0, max: part.marks, topic: q.topic, family: q.family },
      ])));
      const prepared = prepareMarking(attempt);
      assert.equal(prepared.jobs.length, 0, `${subject} paper ${paperNumber}`);
      const marked = applyMarks(attempt, prepared.results);
      assert.equal(marked.score, attempt.total);
      assert.equal(marked.grading, "automatic");
    }
});

test("optional private Ollama adapter sends only marking data and validates the response", async () => {
  const prior = {
    enabled: process.env.MARKER_AI_ENABLED,
    url: process.env.MARKER_OLLAMA_URL,
    model: process.env.MARKER_OLLAMA_MODEL,
    fetch: globalThis.fetch,
  };
  process.env.MARKER_AI_ENABLED = "true";
  process.env.MARKER_OLLAMA_URL = "http://127.0.0.1:11434";
  process.env.MARKER_OLLAMA_MODEL = "test-model";
  let requested = false;
  globalThis.fetch = async (input, init) => {
    requested = true;
    assert.equal(String(input), "http://127.0.0.1:11434/api/chat");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, "test-model");
    assert.equal(body.stream, false);
    assert.equal(body.messages.length, 2);
    return new Response(JSON.stringify({ message: { content: JSON.stringify({
      results: [{ key: "part", confidence: 0.91, feedback: "The answer earns one mark for a supported idea.", criteria: [
        { id: "m", awarded: true, evidence: "Student response", feedback: "Required idea present." },
        { id: "a", awarded: false, evidence: "", feedback: "Supporting evidence missing." },
      ] }],
    }) } }), { status: 200 });
  };
  try {
    const result = await markWithOllama([{ key: "part", context: "A passage", question: "Explain.", scheme: "One mark for a supported idea.", expected: "Idea", answer: "Student response", max: 2, criteria: [{ id: "m", description: "Idea" }, { id: "a", description: "Evidence" }] }]);
    assert.ok(requested);
    assert.equal(result.part.score, 1);
  } finally {
    globalThis.fetch = prior.fetch;
    for (const [key, value] of [["MARKER_AI_ENABLED", prior.enabled], ["MARKER_OLLAMA_URL", prior.url], ["MARKER_OLLAMA_MODEL", prior.model]]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
