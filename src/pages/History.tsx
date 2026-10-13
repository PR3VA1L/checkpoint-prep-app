import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAttempts } from "../learning/useAttempts";
import Activity from "../components/Activity";
export default function History() {
  const { user } = useAuth(),
    { data, loading, error } = useAttempts(user?.uid);
  const [filter, setFilter] = useState("all");
  return (
    <div className="page-stack">
      <header>
        <div className="eyebrow">YOUR LEARNING RECORD</div>
        <h1>My activity</h1>
        <p className="muted">
          Reopen answers, see explanations, or continue a saved session.
        </p>
      </header>
      <label htmlFor="history-filter">Subject</label>
      <select
        id="history-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All subjects</option>
        <option value="english">English</option>
        <option value="math">Mathematics</option>
        <option value="science">Science</option>
      </select>
      {loading && <p role="status">Loading activity…</p>}
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      <section className="panel">
        <Activity
          attempts={data.filter(
            (a) => filter === "all" || a.subject === filter,
          )}
        />
        <p className="helper">
          Latest 200 saved sessions. Older legacy sessions may contain only a
          summary; their missing answers cannot be reconstructed.
        </p>
      </section>
    </div>
  );
}
