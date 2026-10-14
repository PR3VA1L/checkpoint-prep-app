import { useState, useEffect, useMemo } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useAttempts } from "../learning/useAttempts";
import { summarise } from "../learning/engine";
import { accountAction } from "../lib/account";
import Activity from "../components/Activity";
import {useClock} from "../learning/useClock";
import {dayKey,futureDay} from "../learning/random";
export default function ParentDashboard() {
  const { profile, user } = useAuth();
  const [selected, setSelected] = useState(""),
    [code, setCode] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [names, setNames] = useState<Record<string, string>>({});
  const children = useMemo(()=>profile?.linkedStudents || [],[profile?.linkedStudents]);
  const child = children.includes(selected) ? selected : children[0];
  const { data, loading, error } = useAttempts(child);
  const [days, setDays] = useState(7);
  const now=useClock();
  const [zones,setZones]=useState<Record<string,string>>({});
  const zone=zones[child]||profile?.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone;
  const start=futureDay(dayKey(new Date(now),zone),1-days);
  const recent = data.filter(
      (a) => dayKey(new Date(a.completedAt || a.startedAt),zone) >= start,
    ),
    stats = summarise(recent);
  useEffect(() => {
    const stops = children.map((id) => onSnapshot(doc(db, "users", id), (snapshot) => {
      setNames((old) => ({ ...old, [id]: snapshot.data()?.displayName || "Student" }));
      setZones((old) => ({ ...old, [id]: snapshot.data()?.timezone || "UTC" }));
    }, () => setNames((old) => ({ ...old, [id]: "Student (please reconnect)" }))));
    return () => stops.forEach((stop) => stop());
  }, [children]);
  async function action(body: Record<string, string>) {
    setBusy(true);
    setMessage("");
    try {
      await accountAction(body);
      setCode("");
      setMessage("Account updated.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-stack">
      <header>
        <div className="eyebrow">FAMILY SPACE</div>
        <h1>A clearer view of their progress.</h1>
        <p className="muted">
          Signed in as {user?.email} · Parent account · live updates
        </p>
      </header>
      {(message || error) && (
        <p className="notice" role="alert">
          {message || error}
        </p>
      )}
      <section className="panel">
        <h2>Connect a student</h2>
        <form className="button-row" onSubmit={(event) => { event.preventDefault(); const name = String(new FormData(event.currentTarget).get("displayName") || "").trim(); void action({ action: "name", name }); }}>
          <label htmlFor="parent-display-name">Your name (shown to linked students)</label>
          <input id="parent-display-name" name="displayName" key={profile?.displayName} defaultValue={profile?.displayName || ""} maxLength={80} minLength={2} required />
          <button disabled={busy}>Save name</button>
        </form>
        <p>
          Any trusted parent, guardian or relative can connect, regardless of surname. Ask the student to create a new invitation in their dashboard. Older
          six-character codes and unverified legacy links must be replaced.
        </p>
        <form
          className="button-row"
          onSubmit={(e) => {
            e.preventDefault();
            void action({ action: "redeem", code });
          }}
        >
          <label htmlFor="invite">One-use invitation code</label>
          <input
            id="invite"
            value={code}
            maxLength={12}
            autoComplete="off"
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="12-character code"
          />
          <button disabled={busy || code.length !== 12}>Connect student</button>
        </form>
      </section>
      {children.length > 0 && (
        <>
          <div className="button-row">
            <label htmlFor="child">Student</label>
            <select
              id="child"
              value={child}
              onChange={(e) => setSelected(e.target.value)}
            >
              {children.map((id) => (
                <option key={id} value={id}>
                  {names[id] || "Loading student name…"}
                </option>
              ))}
            </select>
            <label htmlFor="period">Period</label>
            <select
              id="period"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value="1">Today</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
            <button
              className="secondary"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Remove your access to this student?"))
                  void action({ action: "unlink", studentId: child });
              }}
            >
              Unlink
            </button>
          </div>
          {loading ? (
            <p role="status">Loading this student’s activity…</p>
          ) : (
            !error && (
              <>
                <div className="stats-grid">
                  <div className="stat">
                    <strong>{Math.floor(recent.reduce((sum, a) => sum + (a.activeTimeTracked ? a.durationSeconds || 0 : 0), 0) / 60)}m</strong>
                    <span>Active question time</span>
                  </div>
                  <div className="stat">
                    <strong>{stats.questions}</strong>
                    <span>MCQs answered</span>
                  </div>
                  <div className="stat">
                    <strong>{stats.structured}</strong>
                    <span>Structured / writing sessions</span>
                  </div>
                  <div className="stat">
                    <strong>{stats.pending}</strong>
                    <span>Ready to review together</span>
                  </div>
                </div>
                <section className="panel">
                  <h2>Learn from their work</h2>
                  <p>
                    Ask them to explain one answer in their own words. Marked
                    scores may include clearly labelled self-assessments; they
                    are not certified exam results.
                  </p>
                  <Activity attempts={recent} readOnly />
                  {recent
                    .filter((a) => a.status === "completed" && a.mode !== "mcq")
                    .slice(0, 5)
                    .map((a) => (
                      <details key={a.id}>
                        <summary>Read submitted answers · {a.type}</summary>
                        {a.questions?.map((q) => (
                          <div key={q.id}>
                            <h3>{q.context}</h3>
                            {q.parts.map((p) => (
                              <div key={p.id}>
                                <p>
                                  ({p.id}) {p.text}
                                </p>
                                <p className="submission">
                                  {a.answers[`${q.id}:${p.id}`]?.value ||
                                    "No answer"}
                                </p>
                                <p className="muted">Guidance: {p.answer}</p>
                              </div>
                            ))}
                          </div>
                        ))}
                        {a.mode === "writing" && (
                          <p className="submission">{a.answers.essay?.value}</p>
                        )}
                      </details>
                    ))}
                </section>
              </>
            )
          )}
        </>
      )}
      <details className="panel">
        <summary>Account role and sign-in help</summary>
        <p>
          Use the same Google account or email sign-in in every browser. A
          browser change must not create a new profile. If the account is
          actually a student's, you can change its navigation role here without
          deleting its work.
        </p>
        <button
          className="secondary"
          disabled={busy}
          onClick={() => {
            if (window.confirm("Use this account as a student?"))
              void action({ action: "role", role: "student" });
          }}
        >
          Use as student
        </button>
      </details>
    </div>
  );
}
