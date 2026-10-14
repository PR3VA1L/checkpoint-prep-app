import {
  collection,
  doc,
  getDocs,
  runTransaction,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Attempt, Selection, Seen, Review, Question } from "./types";
import { selectQuestions, nextReview } from "./engine";
import { dayKey } from "./random";
import { READINGS } from "./english";
import { paperPolicy } from "./curriculum";
const clean = <T>(value: T): T => JSON.parse(JSON.stringify(value));
export async function startAttempt(
  uid: string,
  config: Selection,
  timed: boolean,
  zone: string,
): Promise<Attempt> {
  const today = dayKey(new Date(), zone);
  for (let retry = 0; retry < 4; retry++) {
    const [seenSnap, reviewSnap] = await Promise.all([
      getDocs(collection(db, "users", uid, "seen")),
      getDocs(collection(db, "users", uid, "reviews")),
    ]);
    const seen = seenSnap.docs.map((d) => d.data() as Seen),
      reviews = reviewSnap.docs.map((d) => d.data() as Review);
    const questions = selectQuestions(config, seen, reviews, today);
    if (!questions.length)
      throw new Error(
        "No fresh questions match these settings today. Try another topic or return when a scheduled variation is due. Previously seen questions will not be recycled.",
      );
    if (
      config.mode === "structured" &&
      config.topics.some((t) => !questions.some((q) => q.topic === t))
    )
      throw new Error(
        "A selected topic has no fresh questions available today. Change the selected topics or return when its review is due. Your topic choices have not been silently removed.",
      );
    if (
      config.mode === "structured" &&
      config.subject !== "english" &&
      questions.length < config.count
    )
      throw new Error(
        `Only ${questions.length} distinct question types are fresh in these topics today; this session needs ${config.count}. Choose shorter focused practice, add more topics, or leave all topics unselected. Variations of the same question will not be used to fill it.`,
      );
    const id = crypto.randomUUID(),
      now = Date.now(),
      policy = paperPolicy(config.subject, config.paper);
    const total =
      config.mode === "writing"
        ? 25
        : config.mode === "mcq"
          ? questions.length
          : questions.reduce(
              (n, q) => n + q.parts.reduce((sum, p) => sum + p.marks, 0),
              0,
            );
    const a: Attempt = {
      id,
      schemaVersion: 2,
      subject: config.subject,
      type:
        config.mode === "mcq"
          ? "MCQ practice"
          : config.mode === "writing"
            ? "Writing"
            : "Structured questions",
      mode: config.mode,
      paper: config.paper,
      difficulty: config.difficulty,
      topics: [...new Set(questions.map((q) => q.topic))],
      questions,
      answers: {},
      startedAt: now,
      score: 0,
      total,
      grading: config.mode === "mcq" ? "automatic" : "awaiting-review",
      status: "active",
      durationSeconds: 0,
      activeTimeTracked: true,
      ...(timed
        ? {
            deadline:
              now +
              (config.mode === "mcq" ? questions.length * 60 : config.subject !== "english" ? policy.seconds * questions.length / 10 : policy.seconds) *
                1000,
          }
        : {}),
    };
    if (config.subject === "english" && config.mode === "structured") {
      const r = READINGS.find((r) => questions[0].id === `v3-reading-${r.id}`)!;
      a.reading = { id: r.id, title: r.title, paragraphs: r.paragraphs };
    }
    if (config.mode === "writing") a.writingPrompt = questions[0].context;
    try {
      await runTransaction(db, async (tx) => {
        const refs = questions.map((q) => doc(db, "users", uid, "seen", q.id));
        const snapshots = await Promise.all(refs.map((ref) => tx.get(ref)));
        const reviewRefs = [...new Set(questions.map((q) => q.family))].map(
          (f) => doc(db, "users", uid, "reviews", f),
        );
        const latest = await Promise.all(reviewRefs.map((ref) => tx.get(ref)));
        if (
          snapshots.some((s) => s.exists()) ||
          latest.some(
            (s) =>
              s.exists() &&
              s.data().correct === 0 &&
              (s.data().lastDay === today || s.data().due > today),
          )
        )
          throw new Error("selection-conflict");
        questions.forEach((q, i) =>
          tx.set(refs[i], {
            id: q.id,
            family: q.family,
            day: today,
            attemptId: id,
          }),
        );
        tx.set(doc(db, "users", uid, "sessions", id), {
          ...clean(a),
          timestamp: Timestamp.fromMillis(now),
        });
      });
      saveDraft(uid, a);
      return a;
    } catch (e) {
      if (!(e instanceof Error) || e.message !== "selection-conflict") throw e;
    }
  }
  throw new Error(
    "Another tab started a session at the same time. Please try again.",
  );
}
export async function recordOutcome(
  uid: string,
  q: Question,
  correct: boolean,
  zone: string,
  attemptId: string,
) {
  const ref = doc(db, "users", uid, "reviews", q.family),
    today = dayKey(new Date(), zone);
  const eventRef = doc(
    db,
    "users",
    uid,
    "review_events",
    attemptId + "-" + q.family,
  );
  await runTransaction(db, async (tx) => {
    const [old, event] = await Promise.all([tx.get(ref), tx.get(eventRef)]);
    if (event.exists() && event.data().correct === correct) return;
    const previousCorrect = event.exists()
      ? event.data().previousCorrect
      : old.data()?.correct || 0;
    tx.set(eventRef, { attemptId, family: q.family, correct, previousCorrect });
    // Editing an older script must not overwrite a newer attempt's schedule.
    if (event.exists() && old.data()?.lastAttempt !== attemptId) return;
    const previous = old.exists()
      ? ({ ...old.data(), correct: previousCorrect } as Review)
      : undefined;
    tx.set(ref, {
      ...nextReview(q.family, correct, today, previous),
      lastAttempt: attemptId,
    });
  });
}
export async function persistAttempt(uid: string, a: Attempt) {
  // Snapshot before the async transaction: the active-time clock may advance meanwhile.
  a = clean(a);
  const ref = doc(db, "users", uid, "sessions", a.id);
  await runTransaction(db, async (tx) => {
    const latest = await tx.get(ref);
    if (
      latest.exists() &&
      ((latest.data().updatedAt || 0) > (a.updatedAt || 0) ||
        (latest.data().status === "completed" && a.status === "active"))
    )
      throw new Error(
        "Newer work is saved in another tab. Reopen this attempt from History before continuing.",
      );
    tx.set(ref, {
      ...clean(a),
      timestamp: Timestamp.fromMillis(a.completedAt || a.startedAt),
    });
  });
  const local = loadDraft(uid, a.subject, a.mode);
  if (!local || (local.id === a.id && (local.updatedAt || 0) <= (a.updatedAt || 0))) {
    if (a.status === "completed") clearDraft(uid, a.subject, a.mode);
    else saveDraft(uid, a);
  }
}
const key = (uid: string, subject: string, mode: string) =>
  `checkpoint-v3:${uid}:${subject}:${mode}`;
export function saveDraft(uid: string, a: Attempt) {
  try {
    localStorage.setItem(key(uid, a.subject, a.mode), JSON.stringify(a));
    return true;
  } catch {
    return false;
  }
}
export function loadDraft(
  uid: string,
  subject: string,
  mode: string,
): Attempt | null {
  try {
    const value = JSON.parse(
      localStorage.getItem(key(uid, subject, mode)) || "null",
    );
    return value?.schemaVersion === 2 &&
      value.subject === subject &&
      value.mode === mode &&
      Array.isArray(value.questions) &&
      value.questions.length > 0
      ? value
      : null;
  } catch {
    return null;
  }
}
export function clearDraft(uid: string, subject: string, mode: string) {
  try {
    localStorage.removeItem(key(uid, subject, mode));
  } catch {
    /* Cloud save succeeded even when device storage is blocked. */
  }
}
export function subscribeAttempts(
  uid: string,
  callback: (a: Attempt[]) => void,
  error: (e: Error) => void,
) {
  return onSnapshot(
    query(
      collection(db, "users", uid, "sessions"),
      orderBy("timestamp", "desc"),
      limit(200),
    ),
    (snap) =>
      callback(
        snap.docs.map((d) => {
          const v = d.data();
          return {
            ...v,
            id: d.id,
            completedAt: v.completedAt || (v.status !== "active" ? v.timestamp?.toMillis?.() : undefined),
            status: v.status || "completed",
            grading:
              v.grading ||
              (typeof v.score === "number" ? "automatic" : "awaiting-review"),
            mode:
              v.mode ||
              (v.type === "Practice" || v.type === "Mock Exam"
                ? "mcq"
                : "structured"),
            answers: v.answers || {},
            questions: v.questions || [],
            schemaVersion: v.schemaVersion || 1,
          } as Attempt;
        }),
      ),
    error,
  );
}
