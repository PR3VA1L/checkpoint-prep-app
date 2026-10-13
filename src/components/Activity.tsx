import { Link } from "react-router-dom";
import type { Attempt } from "../learning/types";
import { subjectName } from "../learning/curriculum";
export default function Activity({
  attempts,
  readOnly = false,
}: {
  attempts: Attempt[];
  readOnly?: boolean;
}) {
  return (
    <div className="activity-list">
      {attempts.length === 0 && (
        <p className="muted">
          No completed activity in this view yet. Start a practice session to
          build your record.
        </p>
      )}
      {attempts.map((a) => (
        <article className="activity-row" key={a.id}>
          <div>
            <span className={`subject-dot ${a.subject}`} />
            <strong>{subjectName(a.subject) || a.subject}</strong>
            <p>
              {a.type} {a.paper ? `· Paper ${a.paper}` : ""}
            </p>
            <small>
              {a.completedAt
                ? new Date(a.completedAt).toLocaleString()
                : "In progress"}
            </small>
          </div>
          <div>
            <strong>
              {a.status === "active"
                ? "In progress"
                : a.grading === "awaiting-review"
                  ? "Awaiting review"
                  : `${a.score} / ${a.total}`}
            </strong>
            <p className="muted">
              {a.grading === "self-assessed"
                ? "Self-assessed"
                : a.grading === "ai-assisted"
                  ? "AI-assisted estimate"
                  : a.mode === "mcq"
                    ? "Automatically checked"
                    : "Practice"}
            </p>
            {!readOnly && a.schemaVersion === 2 && (
              <Link
                to={`/practice/${a.mode === "mcq" ? "mcq" : "structured"}/${a.subject}?attempt=${a.id}`}
              >
                {a.status === "active" ? "Resume" : "Review answers"} →
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
