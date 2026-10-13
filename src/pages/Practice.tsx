import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { Attempt, Selection, Answer, Subject } from "../learning/types";
import {
  TOPICS,
  subjectName,
  isSubject,
  paperPolicy,
  WRITING_RUBRIC,
} from "../learning/curriculum";
import {
  startAttempt,
  loadDraft,
  saveDraft,
  persistAttempt,
  recordOutcome,
} from "../learning/store";
import { scoreAnswers } from "../learning/engine";
import { reviewedResult } from "../learning/marking";
import { requestAutomaticMark } from "../lib/markingApi";
import QuestionDiagram from "../components/QuestionDiagram";
import FloatingCalculator from "../components/FloatingCalculator";

export default function Practice({
  mode = "mcq",
}: {
  mode?: "mcq" | "structured";
}) {
  const { subject: raw } = useParams();
  if (!isSubject(raw))
    return <Navigate to={`/practice/${mode}/english`} replace />;
  return <PracticeSubject key={`${raw}-${mode}`} subject={raw} mode={mode} />;
}
function PracticeSubject({
  subject,
  mode,
}: {
  subject: Subject;
  mode: "mcq" | "structured";
}) {
  const { user, profile } = useAuth(),
    location = useLocation();
  const uid = user!.uid,
    zone =
      profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [config, setConfig] = useState<Selection>({
    subject,
    topics: [],
    difficulty: "Mixed",
    count: 10,
    paper: 1,
    mode,
  });
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [timed, setTimed] = useState(false),
    [attempt, setAttempt] = useState<Attempt | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [note, setNote] = useState(""),
    [index, setIndex] = useState(0),
    [selected, setSelected] = useState(""),
    [hint, setHint] = useState(false),
    [now, setNow] = useState(() => Date.now()),
    [cloudSaved, setCloudSaved] = useState(false);
  const current = useRef<Attempt | null>(null),
    lock = useRef(false),
    heading = useRef<HTMLHeadingElement>(null);
  const active=attempt?.status==='active',deadline=attempt?.deadline;
  function update(a: Attempt) {
    a = { ...a, updatedAt: Date.now() };
    current.current = a;
    setAttempt(a);
    setCloudSaved(false);
    if (!saveDraft(uid, a))
      setError(
        "Local draft storage is full or unavailable. Keep this tab open and save your work before leaving.",
      );
    return a;
  }
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("attempt");
    if (!id) return;
    let live = true;
    void getDoc(doc(db, "users", uid, "sessions", id))
      .then((s) => {
        if (live && s.exists()) {
          let a = s.data() as Attempt;
          if (a.schemaVersion === 2 && a.subject === subject) {
            const local = loadDraft(uid, subject, a.mode);
            if (
              local?.id === a.id &&
              (local.updatedAt || 0) > (a.updatedAt || 0)
            )
              a = local;
            else setCloudSaved(true);
            current.current = a;
            setAttempt(a);
          }
        }
      })
      .catch(() => {
        if (live)
          setError("Could not load that saved attempt. Please try again.");
      });
    return () => {
      live = false;
    };
  }, [location.search, subject, uid]);
  useEffect(() => {
    if (!active) return;
    const fn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [active]);
  useEffect(() => {
    heading.current?.focus();
  }, [index, attempt?.status]);
  async function begin() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const draft = loadDraft(uid, subject, config.mode);
      if (draft) {
        const remote = await getDoc(
          doc(db, "users", uid, "sessions", draft.id),
        );
        const cloud = remote.exists() ? (remote.data() as Attempt) : null;
        const recovered =
          cloud &&
          ((cloud.updatedAt || 0) > (draft.updatedAt || 0) ||
            (cloud.status === "completed" && draft.status === "active"))
            ? cloud
            : draft;
        current.current = recovered;
        setAttempt(recovered);
        setCloudSaved(recovered === cloud);
        setNote(
          recovered.status === "completed"
            ? "Recovered your result. Retry save if it has not synced."
            : "Resumed your saved draft.",
        );
        return;
      }
      const a = await startAttempt(
        uid,
        { ...config, count: config.mode === "mcq" ? config.count : 10 },
        timed,
        zone,
      );
      update(a);
      setCloudSaved(true);
      if (config.mode === "mcq" && a.questions.length < config.count)
        setNote(
          `This session has ${a.questions.length} fresh question families. We have not padded it with repeats or changed your topics.`,
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start practice.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function syncOutcomes(a: Attempt, only = a.questions) {
    if (a.mode === "mcq")
      for (const q of only) {
        const answer = a.answers[q.id];
        if (answer)
          await recordOutcome(
            uid,
            q,
            answer.score === answer.max && !answer.hint,
            zone,
            a.id,
          );
      }
    if (
      a.status === "completed" &&
      a.mode !== "mcq" &&
      a.grading !== "awaiting-review"
    )
      for (const q of a.questions) {
        const items = Object.values(a.answers).filter(
          (v) => v.family === q.family && v.max > 0,
        );
        if (items.length)
          await recordOutcome(
            uid,
            q,
            a.mode === "writing"
              ? a.score === a.total
              : items.every((v) => v.score === v.max),
            zone,
            a.id,
          );
      }
  }
  async function sync(a: Attempt, only = a.questions) {
    await syncOutcomes(a, only);
    await persistAttempt(uid, a);
    setCloudSaved(true);
  }
  async function check() {
    const a = current.current;
    if (!a || selected === "" || lock.current) return;
    const q = a.questions[index];
    if (a.answers[q.id]) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const answer: Answer = {
      value: selected,
      hint,
      score: Number(Number(selected) === q.correctIndex),
      max: 1,
      topic: q.topic,
      family: q.family,
    };
    const answers = { ...a.answers, [q.id]: answer };
    const next = { ...a, answers, score: scoreAnswers(answers).score };
    const saved = update(next);
    try {
      await sync(saved, [q]);
    } catch {
      setError(
        "Your answer is saved on this device but has not synced. Retry saving before you leave.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function finish() {
    const a = current.current;
    if (!a || a.status === "completed" || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const answers = { ...a.answers };
    if (a.mode === "mcq")
      for (const q of a.questions)
        if (!answers[q.id])
          answers[q.id] = {
            value: "",
            hint: false,
            score: 0,
            max: 1,
            topic: q.topic,
            family: q.family,
          };
    const next: Attempt = {
      ...a,
      answers,
      status: "completed",
      completedAt: Date.now(),
      durationSeconds: Math.max(
        0,
        Math.round(
          (Math.min(Date.now(), a.deadline || Date.now()) - a.startedAt) / 1000,
        ),
      ),
      score: scoreAnswers(answers).score,
      grading: a.mode === "mcq" ? "automatic" : "awaiting-review",
    };
    const saved = update(next);
    try {
      await sync(saved);
      if (saved.mode === "structured") {
        try {
          await automaticMark(saved.id);
        } catch (e) {
          setNote(e instanceof Error ? e.message : "Automatic marking is unavailable. Your paper is saved for review.");
        }
      }
    } catch {
      setError(
        "Result not synced yet. Your result remains in this tab. Use Retry save; do not start another session until it succeeds.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function automaticMark(attemptId: string) {
    const result = await requestAutomaticMark(attemptId);
    current.current = result.attempt;
    setAttempt(result.attempt);
    setCloudSaved(true);
    if (result.pending)
      setNote(
        `${result.pending} answer part${result.pending === 1 ? "" : "s"} still need${result.pending === 1 ? "s" : ""} review. ${result.modelUnavailable ? "The private marker could not be reached. " : !result.modelAvailable ? "The private model is not configured yet. " : ""}The checked marks and your answers are saved.`,
      );
    else
      setNote(
        result.attempt.grading === "ai-assisted"
          ? "Your paper has an AI-assisted practice estimate. A parent or teacher can review it."
          : "Your paper has been checked against the authored answers. A parent or teacher can review it.",
      );
    if (result.attempt.grading !== "awaiting-review") {
      // The marking endpoint has already committed this paper. Only update the
      // review schedule; rewriting the whole paper risks a stale-clock conflict.
      try {
        await syncOutcomes(result.attempt);
      } catch {
        setNote("Your marked paper is saved, but the review schedule could not update. The score is unaffected.");
      }
    }
  }
  async function retryAutomaticMark() {
    const a = current.current;
    if (!a || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await automaticMark(a.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Automatic marking is unavailable.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const expire=useEffectEvent(()=>void finish());
  useEffect(()=>{
    if(!deadline||!active)return;
    const timer=window.setInterval(()=>{const time=Date.now();setNow(time);if(time>=deadline&&!lock.current)expire();},1000);
    return()=>clearInterval(timer);
  },[deadline,active]);
  function setAnswer(
    key: string,
    value: string,
    max: number,
    topic: string,
    family: string,
  ) {
    const a = current.current;
    if (!a || a.status !== "active") return;
    update({
      ...a,
      answers: {
        ...a.answers,
        [key]: { value, hint: false, score: 0, max, topic, family },
      },
    });
  }
  async function mark(
    key: string,
    score: number,
    max: number,
    topic: string,
    family: string,
  ) {
    const a = current.current;
    if (!a || !Number.isInteger(score) || score < 0 || score > max) return;
    const old = a.answers[key] || {
      value: "",
      hint: false,
      score: 0,
      max,
      topic,
      family,
    };
    const answers = { ...a.answers, [key]: { ...old, score, reviewed: true, markingMethod: "manual" as const, feedback: "Marked using the displayed guidance during manual review." } };
    update({ ...a, answers, ...reviewedResult(a, answers) });
  }
  async function retrySave() {
    const a = current.current;
    if (!a || lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await sync(a);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Still unable to save.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const subjectLinks = (
    <nav className="subject-tabs" aria-label="Subject">
      {(["english", "math", "science"] as const).map((s) => (
        <Link
          key={s}
          aria-current={s === subject ? "page" : undefined}
          to={`/practice/${mode}/${s}`}
        >
          {subjectName(s)}
        </Link>
      ))}
    </nav>
  );
  if (!attempt)
    return (
      <div className="page-stack">
        <header>
          <div className="eyebrow">YOUR NEXT CHALLENGE</div>
          <h1>{mode === "mcq" ? "Quick practice" : "Structured questions"}</h1>
          <p className="muted">
            Fresh questions. Clear explanations. Progress that stays with you.
          </p>
        </header>
        {subjectLinks}
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
        <section className="panel setup-grid">
          <div>
            <h2>Build your session</h2>
            <p className="muted">
              {mode === "mcq"
                ? "Question order and answer positions are shuffled. Wrong answers return as a different variant on a later day."
                : "Original Cambridge-style practice, not an official Cambridge paper."}
            </p>
            {mode === "structured" && (
              <>
                <label htmlFor="paper">Paper</label>
                <select
                  id="paper"
                  value={config.paper}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      paper: Number(e.target.value) as 1 | 2,
                    })
                  }
                >
                  <option value="1">
                    Paper 1
                    {subject === "english"
                      ? " · Non-fiction"
                      : subject === "math"
                        ? " · No calculator"
                        : ""}
                  </option>
                  <option value="2">
                    Paper 2
                    {subject === "english"
                      ? " · Fiction"
                      : subject === "math"
                        ? " · Calculator allowed"
                        : ""}
                  </option>
                </select>
                {subject === "english" && (
                  <>
                    <label htmlFor="section">Section</label>
                    <select
                      id="section"
                      value={config.mode}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          mode: e.target.value as Selection["mode"],
                        })
                      }
                    >
                      <option value="structured">
                        Comprehension · 25 marks
                      </option>
                      <option value="writing">Writing · 25 marks</option>
                    </select>
                  </>
                )}
              </>
            )}
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={config.difficulty}
              onChange={(e) =>
                setConfig({
                  ...config,
                  difficulty: e.target.value as Selection["difficulty"],
                })
              }
            >
              {["Mixed", "Easy", "Medium", "Hard"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <p className="helper">
              Hard adds connected steps, evidence and reasoning—not older-year
              content or unnecessarily difficult words.
            </p>
            {mode === "mcq" && (
              <>
                <label htmlFor="count">Maximum questions</label>
                <select
                  id="count"
                  value={config.count}
                  onChange={(e) =>
                    setConfig({ ...config, count: Number(e.target.value) })
                  }
                >
                  {[5, 10, 15].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </>
            )}
            <label className="check">
              <input
                type="checkbox"
                checked={timed}
                onChange={(e) => setTimed(e.target.checked)}
              />
              Timed practice
            </label>
            <button disabled={busy} onClick={begin}>
              {busy
                ? "Preparing…"
                : loadDraft(uid, subject, config.mode)
                  ? "Resume saved draft"
                  : "Start fresh practice"}
            </button>
          </div>
          <div>
            <h2>
              {mode === "structured" && subject === "english"
                ? "About this section"
                : "Choose your topics"}
            </h2>
            {mode === "structured" && subject === "english" ? (
              <>
                <p>
                  Paper 1 uses non-fiction; Paper 2 uses fiction. Reading
                  questions include evidence, vocabulary, language effects and
                  text structure.
                </p>
                <p>
                  Writing uses five criteria totalling 25 marks. Mark guides are
                  available after submission. Self-assessment is clearly
                  labelled; it is not an official examiner result.
                </p>
              </>
            ) : (
              <>
                <p className="muted">
                  Leave all unselected for a balanced mix. Your topic choices
                  are never silently dropped.
                </p>
                <div className="topic-grid">
                  {Object.entries(TOPICS[subject]).map(([id, label]) => (
                    <label className="check topic" key={id}>
                      <input
                        type="checkbox"
                        checked={config.topics.includes(id)}
                        onChange={() =>
                          setConfig({
                            ...config,
                            topics: config.topics.includes(id)
                              ? config.topics.filter((t) => t !== id)
                              : [...config.topics, id],
                          })
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </>
            )}
            {mode === "structured" && subject !== "english" && (
              <div className="notice">
                20 marks · half-paper practice ·{" "}
                {paperPolicy(subject, config.paper).seconds / 60} minutes if
                timed ·{" "}
                {paperPolicy(subject, config.paper).calculator
                  ? "calculator allowed"
                  : "no calculator"}
                . Each selected topic is included.
              </div>
            )}
            {mode === "structured" && (
              <p className="muted">
                Your written answers are saved to your account and checked against practice marking guidance after submission. Do not include names, addresses or other personal details in your answers. Automatic and AI-assisted marks are practice feedback, not official Cambridge results.
              </p>
            )}
          </div>
        </section>
      </div>
    );
  const completed = attempt.status === "completed",
    mcq = attempt.mode === "mcq",
    q = attempt.questions[index],
    answer = attempt.answers[q.id],
    remaining = attempt.deadline
      ? Math.max(0, Math.ceil((attempt.deadline - now) / 1000))
      : null;
  return (
    <div className="page-stack">
      <header className="session-header">
        <div>
          <div className="eyebrow">
            {subjectName(subject)} · {attempt.difficulty} ·{" "}
            {mcq ? "QUICK PRACTICE" : `PAPER ${attempt.paper}`}
          </div>
          <h1 ref={heading} tabIndex={-1}>
            {completed
              ? "Your practice review"
              : mcq
                ? `Question ${index + 1} of ${attempt.questions.length}`
                : attempt.mode === "writing"
                  ? "Writing"
                  : "Structured questions"}
          </h1>
        </div>
        <div>
          {!completed && remaining !== null && (
            <div className="timer" aria-label="Time remaining">
              {Math.floor(remaining / 60)}:
              {String(remaining % 60).padStart(2, "0")}
            </div>
          )}
          <span className="badge">
            {cloudSaved
              ? "Saved to your account"
              : completed
                ? "Save pending"
                : "Draft on this device"}
          </span>
        </div>
      </header>
      {!cloudSaved && (
        <div className="button-row">
          <button className="secondary" disabled={busy} onClick={retrySave}>
            Save progress to account
          </button>
          <span className="helper">
            You can retry a pending save without starting a new attempt.
          </span>
        </div>
      )}
      {error && (
        <div role="alert" className="notice error">
          {error}
          <button disabled={busy} onClick={retrySave}>
            Retry save
          </button>
        </div>
      )}
      {note && (
        <p className="notice" role="status">
          {note}
        </p>
      )}
      {confirmFinish && !completed && (
        <section
          className="notice"
          role="alertdialog"
          aria-labelledby="submit-confirm"
        >
          <h2 id="submit-confirm">Submit this session?</h2>
          <p>
            You can review answers after submitting. Unanswered questions will
            stay marked as unanswered.
          </p>
          <div className="button-row">
            <button
              onClick={() => {
                setConfirmFinish(false);
                void finish();
              }}
            >
              Confirm submission
            </button>
            <button
              className="secondary"
              onClick={() => setConfirmFinish(false)}
            >
              Keep working
            </button>
          </div>
        </section>
      )}
      {completed ? (
        <>
          <section className="panel">
            <h2>
              {attempt.grading === "awaiting-review"
                ? "Ready for review"
                : `${attempt.score} / ${attempt.total}`}
            </h2>
            <p>
              {attempt.grading === "automatic"
                ? "Automatically checked answers."
                : attempt.grading === "ai-assisted"
                  ? "AI-assisted practice estimate against this paper’s marking guidance. A parent or teacher can review it; this is not an official Cambridge grade."
                : attempt.grading === "self-assessed"
                  ? "Self-assessed practice score. This is not a verified examiner grade."
                  : "Your answers have been kept. Use the marking guidance below with a parent or teacher; unmarked work is not counted as zero in your dashboard."}
            </p>
            {attempt.grading === "awaiting-review" && attempt.markingVersion && (
              <p className="feedback">
                {attempt.score} mark{attempt.score === 1 ? "" : "s"} awarded so far. Some parts still need review; this is not a final score.
              </p>
            )}
            {!mcq && (
              <p>
                Give credit for equivalent correct wording. Do not award a mark
                just because a keyword appears in an incorrect explanation.
              </p>
            )}
          </section>
          {attempt.mode === "writing" ? (
            <section className="panel">
              <h2>Your writing</h2>
              <p>{attempt.writingPrompt}</p>
              <p className="submission">
                {attempt.answers.essay?.value || "No answer submitted."}
              </p>
              <p className="notice">
                For this practice rubric: 20 words or fewer earns 0; 21–60 words
                is capped at 7 overall. Discuss the work with a parent or
                teacher.
              </p>
              {WRITING_RUBRIC.map((r) => (
                <label key={r.id}>
                  {r.name} · {r.help}
                  <select
                    aria-label={`Marks for ${r.name}`}
                    value={attempt.answers[`rubric-${r.id}`]?.score ?? ""}
                    onChange={(e) =>
                      void mark(
                        `rubric-${r.id}`,
                        Number(e.target.value),
                        r.max,
                        "language",
                        attempt.questions[0].family,
                      )
                    }
                  >
                    <option value="" disabled>
                      Not reviewed
                    </option>
                    {Array.from({ length: r.max + 1 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} / {r.max}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </section>
          ) : (
            attempt.questions.map((question, i) => (
              <section className="panel" key={question.id}>
                <h2>
                  {i + 1}.{" "}
                  {mcq
                    ? question.stem
                    : question.parts[0]?.text.startsWith(question.context)
                      ? "Question"
                      : question.context}
                </h2>
                {question.diagram && (
                  <QuestionDiagram diagram={question.diagram} />
                )}
                {mcq ? (
                  <>
                    <p>
                      Your answer:{" "}
                      {attempt.answers[question.id]?.value !== "" &&
                      attempt.answers[question.id]?.value !== undefined
                        ? question.options[
                            Number(attempt.answers[question.id].value)
                          ]
                        : "Not answered"}
                    </p>
                    <p className="feedback">
                      Correct answer: {question.options[question.correctIndex]}
                    </p>
                    <p>{question.explanation}</p>
                    {attempt.answers[question.id]?.hint && (
                      <span className="badge">Completed with a hint</span>
                    )}
                  </>
                ) : (
                  question.parts.map((p) => {
                    const key = `${question.id}:${p.id}`;
                    return (
                      <div className="review-part" key={key}>
                        <h3>
                          ({p.id}) {p.text} [{p.marks}]
                        </h3>
                        <p className="submission">
                          {attempt.answers[key]?.value ||
                            "No answer submitted."}
                        </p>
                        {attempt.answers[key]?.feedback && (
                          <p className="feedback">{attempt.answers[key].feedback}</p>
                        )}
                        <details>
                          <summary>Answer and marking guidance</summary>
                          <p>{p.answer}</p>
                          <p className="muted">{p.guidance}</p>
                        </details>
                        <label>
                          Marks awarded
                          <select
                            disabled={busy}
                            aria-label={`Marks for question ${i + 1} part ${p.id}`}
                            value={
                              attempt.answers[key]?.reviewed
                                ? attempt.answers[key].score
                                : ""
                            }
                            onChange={(e) =>
                              void mark(
                                key,
                                Number(e.target.value),
                                p.marks,
                                question.topic,
                                question.family,
                              )
                            }
                          >
                            <option value="" disabled>
                              Not reviewed
                            </option>
                            {Array.from({ length: p.marks + 1 }, (_, n) => (
                              <option key={n} value={n}>
                                {n} / {p.marks}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    );
                  })
                )}
              </section>
            ))
          )}
          <div className="button-row">
            {attempt.mode === "structured" &&
              attempt.grading === "awaiting-review" &&
              !Object.values(attempt.answers).some((a) => a.markingMethod === "manual") && (
                <button disabled={busy || !cloudSaved} onClick={() => void retryAutomaticMark()}>
                  Check answers automatically
                </button>
              )}
            {!mcq && (
              <button disabled={busy} onClick={retrySave}>
                Save reviewed marks
              </button>
            )}
            <Link className="button secondary" to="/history">
              View history
            </Link>
            <button
              disabled={!cloudSaved}
              onClick={() => {
                current.current = null;
                setAttempt(null);
                setIndex(0);
                setSelected("");
                setHint(false);
                setNote("");
              }}
            >
              New session
            </button>
          </div>
        </>
      ) : mcq ? (
        <>
          <section className="panel question-card">
            <span className="badge">
              {TOPICS[subject][q.topic]} · {q.objective}
            </span>
            <h2>{q.stem}</h2>
            {q.diagram && <QuestionDiagram diagram={q.diagram} />}
            <div className="options">
              {q.options.map((option, i) => (
                <button
                  className={`option ${(answer?.value ?? selected) === String(i) ? "selected" : ""}`}
                  aria-pressed={(answer?.value ?? selected) === String(i)}
                  disabled={!!answer || busy}
                  key={option}
                  onClick={() => setSelected(String(i))}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              ))}
            </div>
            {hint && <p className="notice">{q.hint}</p>}
            {answer && (
              <div className="feedback" role="status">
                <h3>
                  {answer.score
                    ? "Correct—well done."
                    : "Let’s work through it."}
                </h3>
                <p>{q.explanation}</p>
                {!answer.score && (
                  <p>
                    A different version of this skill will be scheduled 2–7 days
                    from now, not again today.
                  </p>
                )}
              </div>
            )}
            <div className="button-row">
              {!answer ? (
                <>
                  <button disabled={selected === "" || busy} onClick={check}>
                    Check answer
                  </button>
                  <button className="secondary" onClick={() => setHint(true)}>
                    Give me a hint
                  </button>
                </>
              ) : (
                <button
                  disabled={busy || !cloudSaved}
                  onClick={() => {
                    if (index === attempt.questions.length - 1) void finish();
                    else {
                      setIndex(index + 1);
                      setSelected("");
                      setHint(false);
                    }
                  }}
                >
                  {index === attempt.questions.length - 1
                    ? "Finish & save"
                    : "Next question"}
                </button>
              )}
              <button
                className="secondary"
                disabled={busy}
                onClick={() => {
                  setConfirmFinish(true);
                }}
              >
                Finish early
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          {attempt.reading && (
            <section className="panel reading">
              <div className="eyebrow">
                READING INSERT · ORIGINAL PRACTICE TEXT
              </div>
              <h2>{attempt.reading.title}</h2>
              {attempt.reading.paragraphs.map((p, i) => (
                <p key={i}>
                  <span className="paragraph-number">{i + 1}</span>
                  {p}
                </p>
              ))}
            </section>
          )}
          {attempt.mode === "writing" ? (
            <section className="panel">
              <h2>{attempt.writingPrompt}</h2>
              <p>
                Plan, write and check. Focus on a clear purpose, developed ideas
                and accurate language.
              </p>
              <label htmlFor="essay">Your writing</label>
              <textarea
                id="essay"
                rows={18}
                maxLength={12000}
                value={attempt.answers.essay?.value || ""}
                onChange={(e) =>
                  setAnswer("essay", e.target.value, 0, "language", q.family)
                }
              />
              <p className="muted">
                {
                  (attempt.answers.essay?.value || "")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length
                }{" "}
                words · draft saved on this device
              </p>
              <p className="muted">Type your answer; image transcription is not enabled.</p>
            </section>
          ) : (
            attempt.questions.map((question, i) => (
              <section className="panel structured-card" key={question.id}>
                <h2>
                  {question.parts[0]?.text.startsWith(question.context)
                    ? `Question ${i + 1}`
                    : `${i + 1}. ${question.context}`}
                </h2>
                {question.diagram && (
                  <QuestionDiagram diagram={question.diagram} />
                )}{" "}
                {question.parts.map((p) => {
                  const key = `${question.id}:${p.id}`;
                  return (
                    <div className="answer-part" key={key}>
                      <label htmlFor={key}>
                        <strong>({p.id})</strong> {p.text}{" "}
                        <span className="marks">[{p.marks}]</span>
                      </label>
                      <textarea
                        id={key}
                        rows={p.marks > 2 ? 4 : 2}
                        maxLength={6000}
                        value={attempt.answers[key]?.value || ""}
                        onChange={(e) =>
                          setAnswer(
                            key,
                            e.target.value,
                            p.marks,
                            question.topic,
                            question.family,
                          )
                        }
                        placeholder="Write your answer and any working here…"
                      />
                    </div>
                  );
                })}
              </section>
            ))
          )}
          <div className="sticky-actions">
            <button className="secondary" disabled={busy} onClick={retrySave}>
              Save draft to account
            </button>
            <button
              disabled={busy}
              onClick={() => {
                setConfirmFinish(true);
              }}
            >
              Submit for review
            </button>
          </div>
        </>
      )}
      {!completed &&
        ((mcq && subject !== "english") ||
          (!mcq && paperPolicy(subject, attempt.paper).calculator)) && (
          <FloatingCalculator />
        )}
    </div>
  );
}
