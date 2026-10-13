import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { ArrowUpRight, BookOpen, ListChecks, Target } from "lucide-react";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useAttempts } from "../learning/useAttempts";
import { useClock } from "../learning/useClock";
import { summarise } from "../learning/engine";
import { TOPICS, subjectName } from "../learning/curriculum";
import { dayKey, futureDay } from "../learning/random";
import type { Subject, Review } from "../learning/types";
import Activity from "../components/Activity";
import { accountAction } from "../lib/account";
import { levelFor, LEVEL_TITLES, subjectProgress } from "../learning/levels";
export default function Dashboard() {
  const { user, profile } = useAuth(),
    { data, loading, error } = useAttempts(user?.uid);
  const [subject, setSubject] = useState<Subject | "all">("all"),
    [parentNames, setParentNames] = useState<Record<string, string>>({}),
    [reviews, setReviews] = useState<Review[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const now = useClock();
  const zone =
      profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    today = dayKey(new Date(now), zone);
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      collection(db, "users", user.uid, "reviews"),
      (s) => setReviews(s.docs.map((d) => d.data() as Review)),
      () => setMessage("Review schedule could not be loaded."),
    );
  }, [user]);
  useEffect(() => {
    if (!profile?.linkedParents?.length) return;
    let live = true;
    void accountAction({ action: "links" }).then((result) => {
      if (live) setParentNames(Object.fromEntries((result.links || []).map((link: {id: string; name: string}) => [link.id, link.name])));
    }).catch(() => setMessage("Linked parent names could not be loaded."));
    return () => { live = false; };
  }, [profile?.linkedParents]);
  const filtered = subject === "all" ? data : data.filter((a) => a.subject === subject),
    practiceSubject = subject === "all" ? data[0]?.subject || "english" : subject,
    stats = summarise(filtered),
    allStats = summarise(data),
    due = reviews.filter(
      (r) => r.due <= today && r.lastDay !== today && r.correct === 0,
    ).length;
  const days = Array.from({ length: 7 }, (_, i) => futureDay(today, i - 6));
  const chart = days.map((day) => {
    const a = filtered.filter(
      (a) =>
        a.completedAt &&
        dayKey(new Date(a.completedAt), zone) === day &&
        a.status === "completed" &&
        a.grading !== "awaiting-review",
    );
    const score = a.reduce((n, s) => n + s.score, 0),
      total = a.reduce((n, s) => n + s.total, 0);
    return { day, score: total ? Math.round((score / total) * 100) : null };
  });
  async function action(body: Record<string, string>) {
    setBusy(true);
    setMessage("");
    try {
      const r = await accountAction(body);
      if (r.code)
        setMessage(
          `Invitation ${r.code} is valid for 24 hours and one use. Only share it with the parent you want to grant access.`,
        );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-stack">
      <header className="dashboard-heading">
        <div>
          <div className="eyebrow">A LITTLE PRACTICE. A LOT OF PROGRESS.</div>
          <h1>
            Hello,{" "}
            {profile?.displayName ||
              user?.displayName?.split(" ")[0] ||
              "learner"}
            .
          </h1>
          <p className="muted">
            {loading
              ? "Loading your activity…"
              : due
                ? `${due} ${due === 1 ? "skill is" : "skills are"} ready for a fresh review variation.`
                : "Choose a subject and take your next step."}
          </p>
        </div>
        <span className="badge live">Live account activity</span>
      </header>
      {(error || message) && (
        <p className="notice" role="status">
          {error || message}
        </p>
      )}
      <nav className="subject-tabs" aria-label="Dashboard subject">
        {(["all", "english", "math", "science"] as const).map((s) => (
          <button
            aria-pressed={subject === s}
            key={s}
            onClick={() => setSubject(s)}
          >
            {s === "all" ? "All subjects" : subjectName(s)}
          </button>
        ))}
      </nav>
      <section className="hero-panel">
        <div>
          <div className="eyebrow">TODAY’S NEXT STEP</div>
          <h2>
            Make room for
            <br />a new discovery.
          </h2>
          <p>
            Try a fresh {subjectName(practiceSubject)} question. Mistakes become a later
            review—not today’s repetition.
          </p>
          <Link className="button" to={`/practice/mcq/${practiceSubject}`}>
            Start quick practice <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-sheet">
            <span>THINK IT THROUGH</span>
            <div>?</div>
            <i>Notice. Reason. Explain.</i>
          </div>
          <div className="art-orbit" />
        </div>
      </section>
      <section className="stats-grid" aria-label="Recent activity">
        <div className="stat">
          <strong>{loading ? "—" : `${Math.floor(filtered.reduce((sum, a) => sum + (a.durationSeconds || 0), 0) / 60)}m`}</strong>
          <span>Active question time</span>
        </div>
        <div className="stat">
          <BookOpen />
          <strong>{loading ? "—" : stats.questions}</strong>
          <span>MCQs answered</span>
        </div>
        <div className="stat">
          <ListChecks />
          <strong>{loading ? "—" : stats.structured}</strong>
          <span>Structured / writing {stats.structured === 1 ? "session" : "sessions"}</span>
        </div>
        <div className="stat">
          <Target />
          <strong>
            {loading
              ? "—"
              : stats.total
                ? `${Math.round((stats.score / stats.total) * 100)}%`
                : "—"}
          </strong>
          <span>Marked practice accuracy</span>
        </div>
        <div className="stat">
          <strong>{loading ? "—" : stats.pending}</strong>
          <span>Sessions awaiting review</span>
        </div>
      </section>
      <section className="panel">
        <h2>Your levels</h2>
        <p className="muted">Levels grow through marked practice and accuracy. Unmarked work does not count yet.</p>
        {(["english", "math", "science"] as const).map((name) => {
          const row = subjectProgress(allStats.topics, name);
          const level = levelFor(row);
          return <div className="focus-row" key={name}><span>{subjectName(name)}</span><strong>Level {level} · {LEVEL_TITLES[level - 1]} <small>({row.count} responses)</small></strong></div>;
        })}
        <details><summary>Topic levels</summary>
          {Object.entries(allStats.topics).map(([key, row]) => {
            const [name, topic] = key.split(":") as [Subject, string];
            const level = levelFor(row);
            return <div className="focus-row" key={key}><span>{subjectName(name)} · {TOPICS[name]?.[topic] || topic}</span><strong>Level {level} · {LEVEL_TITLES[level - 1]}</strong></div>;
          })}
        </details>
      </section>
      <div className="two-columns">
        <section className="panel">
          <div className="section-title">
            <h2>Practice with a purpose</h2>
            <span className="badge">{subjectName(practiceSubject)}</span>
          </div>
          <p>
            Choose Paper 1 or Paper 2, your topics and your level. Show your
            working and compare it with clear marking guidance.
          </p>
          <Link
            className="button secondary"
            to={`/practice/structured/${practiceSubject}`}
          >
            Build structured practice →
          </Link>
          <h3 className="spaced">Your next focus</h3>
          {Object.entries(stats.topics)
            .filter(([, r]) => r.count >= 3)
            .sort((a, b) => a[1].score / a[1].total - b[1].score / b[1].total)
            .slice(0, 3)
            .map(([key, r]) => (
              <div className="focus-row" key={key}>
                <span>
                  {TOPICS[key.split(":")[0] as Subject][key.split(":")[1]] || key.split(":")[1]}
                </span>
                <strong>
                  {Math.round((r.score / r.total) * 100)}%{" "}
                  <small>({r.count} responses)</small>
                </strong>
              </div>
            ))}
          {!Object.values(stats.topics).some((r) => r.count >= 3) && (
            <p className="muted">
              Complete a few questions before we suggest a focus. No scores are
              invented.
            </p>
          )}
        </section>
        <section className="panel">
          <h2>Last seven days</h2>
          <p className="muted">
            Marked practice only · gaps mean no marked work
          </p>
          <div
            className="trend"
            role="img"
            aria-label={chart
              .map(
                (d) =>
                  `${d.day}: ${d.score === null ? "no marked work" : d.score + " percent"}`,
              )
              .join("; ")}
          >
            {chart.map((d) => (
              <div className="trend-column" key={d.day}>
                <span>{d.score === null ? "—" : `${d.score}%`}</span>
                <div
                  style={{
                    height: `${d.score === null ? 3 : Math.max(3, d.score)}%`,
                  }}
                />
                <small>
                  {new Date(d.day + "T12:00:00").toLocaleDateString(undefined, {
                    weekday: "short",
                  })}
                </small>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="section-title">
          <h2>Recent activity</h2>
          <Link to="/history">See all →</Link>
        </div>
        <Activity attempts={filtered.slice(0, 5)} />
        <p className="helper">
          Summaries use the latest 200 saved sessions. Self-assessed scores are
          practice estimates.
        </p>
      </section>
      <section className="panel">
        <h2>Family access</h2>
        <p>
          Generate a one-use invitation for your parent. Sharing it grants
          access to your saved practice; you can remove access below.
        </p>
        <div className="button-row">
          <button
            disabled={busy}
            onClick={() => void action({ action: "invite" })}
          >
            Create parent invitation
          </button>
          {profile?.linkingCode && <code>{profile.linkingCode}</code>}
        </div>
        {profile?.linkedParents?.map((id) => (
          <div className="focus-row" key={id}>
            <span>{parentNames[id] || "Linked parent"}</span>
            <button
              className="secondary"
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    "Remove this parent’s access to your practice?",
                  )
                )
                  void action({ action: "unlink", parentId: id });
              }}
            >
              Remove access
            </button>
          </div>
        ))}
        <details>
          <summary>My account has the wrong role</summary>
          <p>
            Signed in as {user?.email}. Changing the role does not delete
            practice history or grant access to another student.
          </p>
          <button
            className="secondary"
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  "Use this account as a parent? Your practice history will be kept.",
                )
              )
                void action({ action: "role", role: "parent" });
            }}
          >
            Use this account as a parent
          </button>
        </details>
      </section>
    </div>
  );
}
