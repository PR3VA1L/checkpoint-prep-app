import test from "node:test";
import assert from "node:assert/strict";
import {
  FAMILIES,
  fingerprint,
  selectQuestions,
  nextReview,
  shuffleOptions,
  summarise,
} from "../src/learning/engine";
import { seeded, dayKey, futureDay } from "../src/learning/random";
import {
  TOPICS,
  paperPolicy,
  WRITING_RUBRIC,
} from "../src/learning/curriculum";
import {
  READINGS,
  readingQuestion,
  writingTask,
} from "../src/learning/english";
import { reviewedResult } from "../src/learning/marking";
import { calculate } from "../src/learning/calculator";
import type {
  Attempt,
  Selection,
  Seen,
  Subject,
  Answer,
} from "../src/learning/types";
const config = (
  subject: Subject,
  extra: Partial<Selection> = {},
): Selection => ({
  subject,
  difficulty: "Mixed",
  mode: "mcq",
  paper: 1,
  topics: [],
  count: 10,
  ...extra,
});
test("every authored variant: four unique options, valid key, exact two-mark structured total and no empty/unsafe content", () => {
  let count = 0;
  const unique: Record<string, Set<string>> = {
    math: new Set(),
    science: new Set(),
    english: new Set(),
  };
  for (const f of FAMILIES)
    for (const level of ["Easy", "Medium", "Hard"] as const)
      for (const paper of [1, 2] as const)
        for (let v = 0; v < f.variants; v++) {
          const q = f.make(v, level, paper);
          assert.equal(q.options.length, 4, f.id);
          assert.equal(new Set(q.options).size, 4, f.id);
          assert.ok(q.options[q.correctIndex]);
          assert.ok(q.explanation.length > 10, f.id);
          assert.ok(q.stem.length > 10, f.id);
          assert.ok(TOPICS[q.subject][q.topic], f.id);
          assert.ok(q.objective.startsWith("6"));
          if (q.subject !== "english")
            assert.equal(
              q.parts.reduce((n, p) => n + p.marks, 0),
              2,
              f.id,
            );
          assert.ok(
            !/undefined|NaN|<script|javascript:/.test(JSON.stringify(q)),
            f.id,
          );
          unique[q.subject].add(fingerprint(q));
          count++;
        }
  console.log(
    "Validated variants:",
    count,
    "Distinct stems:",
    Object.fromEntries(Object.entries(unique).map(([s, ids]) => [s, ids.size])),
  );
  for (const subject of ["math", "science", "english"] as const)
    assert.ok(unique[subject].size >= 500, `${subject} needs 500 distinct MCQ stems`);
});
test("structured bank meets the subject minimums", () => {
  const totals: Record<string, number> = {};
  for (const subject of ["math", "science"] as const) {
    const prompts = new Set<string>();
    for (const f of FAMILIES.filter((item) => item.subject === subject))
      for (let v = 0; v < f.variants; v++) {
        const q = f.make(v, "Medium", 1);
        if (q.parts.length >= 2) prompts.add(fingerprint(q));
      }
    assert.ok(prompts.size >= 50, `${subject} needs 50 structured question groups`);
    totals[subject] = prompts.size;
  }
  const readingParts = new Set(
    READINGS.flatMap((reading) =>
      readingQuestion(reading, "Medium").parts.map((part) => `${reading.id}:${part.id}`),
    ),
  );
  assert.ok(readingParts.size >= 20, "English needs 20 passage-based structured questions");
  totals.english = readingParts.size;
  console.log("Structured question groups/parts:", totals);
});
test("at least thirty successive broad-topic sessions contain no repeated question", () => {
  for (const subject of ["math", "science", "english"] as const) {
    const seen: Seen[] = [];
    for (let run = 0; run < 30; run++) {
      const selected = selectQuestions(
        config(subject),
        seen,
        [],
        "2026-10-09",
        seeded(run + 7),
      );
      for (const q of selected) {
        assert.ok(!seen.some((s) => s.id === q.id));
        seen.push({ id: q.id, family: q.family, day: "2026-10-09" });
      }
    }
    assert.ok(seen.length > 100, subject);
  }
});
test("Hard sessions include a Stage 6 challenge item without repeating its stem", () => {
  for (const subject of ["math", "science", "english"] as const) {
    const seen: Seen[] = [];
    for (let run = 0; run < 3; run++) {
      const selected = selectQuestions(
        config(subject, { difficulty: "Hard" }),
        seen,
        [],
        "2026-10-09",
        seeded(run + 201),
      );
      assert.ok(selected.some((q) => q.family.startsWith("challenge-")), subject);
      assert.ok(selected.every((q) => q.difficulty === "Hard"));
      for (const q of selected) {
        assert.ok(!seen.some((item) => item.id === q.id));
        seen.push({ id: q.id, family: q.family, day: "2026-10-09" });
      }
    }
  }
});
test("failed skills never return today or before their randomly scheduled later day", () => {
  const f = FAMILIES[0],
    q = f.make(0, "Hard", 1);
  const review = nextReview(f.id, false, "2026-10-09", undefined, () => 0);
  assert.equal(review.due, "2026-10-11");
  for (const date of ["2026-10-09", "2026-10-10"])
    assert.ok(
      selectQuestions(config("math"), [], [review], date, seeded(4)).every(
        (q) => q.family !== f.id,
      ),
    );
  const selected = selectQuestions(
    config("math"),
    [{ id: fingerprint(q), family: f.id, day: "2026-10-09" }],
    [review],
    "2026-10-11",
    seeded(4),
  );
  assert.ok(selected.some((q) => q.family === f.id));
  assert.ok(selected.every((item) => item.id !== fingerprint(q)));
  assert.equal(
    nextReview(f.id, false, "2026-10-09", undefined, () => 0.999).due,
    "2026-10-16",
  );
});
test("selection obeys topics and difficulty; complete balanced half-papers are 20 marks", () => {
  for (const subject of ["math", "science"] as const)
    for (const paper of [1, 2] as const) {
      const selected = selectQuestions(
        config(subject, { mode: "structured", paper, difficulty: "Hard" }),
        [],
        [],
        "2026-10-09",
        seeded(25),
      );
      assert.equal(selected.length, 10);
      assert.equal(
        selected.flatMap((q) => q.parts).reduce((n, p) => n + p.marks, 0),
        20,
      );
      assert.deepEqual(
        new Set(selected.map((q) => q.topic)),
        new Set(Object.keys(TOPICS[subject])),
      );
      assert.ok(selected.every((q) => q.difficulty === "Hard"));
      const topic = Object.keys(TOPICS[subject])[0];
      assert.ok(
        selectQuestions(
          config(subject, { topics: [topic] }),
          [],
          [],
          "2026-10-09",
        ).every((q) => q.topic === topic),
      );
    }
});
test("MCQ answers are remapped after shuffling and question identity ignores distractors", () => {
  const q = FAMILIES[0].make(2, "Hard", 1),
    positions = new Set<number>();
  for (let i = 1; i < 40; i++) {
    const shuffled = shuffleOptions(q, seeded(i));
    assert.equal(
      shuffled.options[shuffled.correctIndex],
      q.options[q.correctIndex],
    );
    assert.equal(fingerprint(q), fingerprint(shuffled));
    positions.add(shuffled.correctIndex);
  }
  assert.equal(positions.size, 4);
  assert.equal(
    fingerprint(q),
    fingerprint({ ...q, options: ["a", "b", "c", "d"] }),
  );
});
test("reading and writing have 25 marks; passage identity survives difficulty changes", () => {
  for (const r of READINGS) {
    assert.equal(
      readingQuestion(r, "Hard").parts.reduce((n, p) => n + p.marks, 0),
      25,
    );
    assert.equal(readingQuestion(r, "Easy").id, readingQuestion(r, "Hard").id);
    assert.ok(r.paragraphs.join(" ").split(/\s+/).length > 250);
  }
  assert.equal(
    WRITING_RUBRIC.reduce((n, r) => n + r.max, 0),
    25,
  );
  for (const paper of [1, 2] as const) {
    const ids = new Set(
      Array.from({ length: 40 }, (_, i) => writingTask(paper, i, "Hard").id),
    );
    assert.equal(ids.size, 40);
  }
});
test("a partially marked script remains awaiting review and short writing is capped", () => {
  const a = {
    mode: "writing",
    questions: [],
    answers: {},
  } as unknown as Attempt;
  const answers: Record<string, Answer> = {
    essay: {
      value: Array(30).fill("word").join(" "),
      max: 0,
      score: 0,
      hint: false,
      topic: "language",
      family: "writing",
    },
  };
  for (const r of WRITING_RUBRIC)
    answers["rubric-" + r.id] = {
      value: "",
      score: r.max,
      max: r.max,
      hint: false,
      topic: "language",
      family: "writing",
      reviewed: true,
    };
  assert.equal(reviewedResult(a, answers).score, 7);
  assert.equal(reviewedResult(a, answers).grading, "self-assessed");
  answers.essay.value = "short text";
  assert.equal(reviewedResult(a, answers).score, 0);
  answers["rubric-" + WRITING_RUBRIC[0].id].reviewed = false;
  assert.equal(reviewedResult(a, answers).grading, "awaiting-review");
});
test("policy and calendar boundaries", () => {
  assert.equal(paperPolicy("math", 1).calculator, false);
  assert.equal(paperPolicy("math", 2).calculator, true);
  assert.equal(paperPolicy("math", 1).seconds, 1350);
  assert.equal(paperPolicy("science", 1).seconds, 1050);
  assert.equal(paperPolicy("english", 1).seconds, 1800);
  assert.equal(
    dayKey(new Date("2026-10-09T23:00:00Z"), "Africa/Johannesburg"),
    "2026-10-10",
  );
  assert.equal(futureDay("2026-12-31", 2), "2027-01-02");
});
test("unmarked and active work is not represented as zero accuracy; skipped MCQs are not counted as answered", () => {
  const common = {
    answers: {},
    questions: [],
    subject: "math",
    mode: "mcq",
    total: 10,
    score: 0,
  } as unknown as Attempt;
  assert.equal(
    summarise([{ ...common, status: "completed", grading: "awaiting-review" }])
      .total,
    0,
  );
  assert.equal(
    summarise([{ ...common, status: "active", grading: "automatic" }]).sessions,
    0,
  );
});
test("calculator follows precedence, handles signs, brackets and safe failures", () => {
  assert.equal(calculate("2+3×4"), 14);
  assert.equal(calculate("(2+3)*4"), 20);
  assert.equal(calculate("-2--3"), 1);
  assert.equal(calculate("0.1+0.2"), 0.3);
  for (const value of ["1/0", "2..3", "2(3)", "alert(1)", "(2+3", "2+"])
    assert.throws(() => calculate(value));
});
test("capped writing uses its actual score in topic summaries", () => {
  const a = {
    subject: "english",
    mode: "writing",
    status: "completed",
    grading: "self-assessed",
    score: 7,
    total: 25,
    answers: { rubric: { score: 25, max: 25, topic: "language" } },
    questions: [],
  } as unknown as Attempt;
  const stats = summarise([a]);
  assert.equal(stats.topics["english:language"].score, 7);
  assert.equal(stats.topics["english:language"].total, 25);
});
test("reading and writing mistakes also respect future-day family review", () => {
  const reading = readingQuestion(READINGS[0], "Hard"),
    review = nextReview(
      reading.family,
      false,
      "2026-10-09",
      undefined,
      () => 0,
    );
  assert.equal(
    selectQuestions(
      config("english", { mode: "structured" }),
      [],
      [review],
      "2026-10-09",
    ).length,
    0,
  );
  const next = selectQuestions(
    config("english", { mode: "structured" }),
    [{ id: reading.id, family: reading.family, day: "2026-10-09" }],
    [review],
    "2026-10-11",
  );
  assert.equal(next.length, 1);
  assert.notEqual(next[0].id, reading.id);
  const writing = writingTask(1, 0, "Hard"),
    wr = nextReview(writing.family, false, "2026-10-09", undefined, () => 0);
  for (let i = 0; i < 20; i++)
    assert.ok(
      selectQuestions(
        config("english", { mode: "writing" }),
        [],
        [wr],
        "2026-10-09",
        seeded(i),
      ).every((q) => q.family !== writing.family),
    );
});
