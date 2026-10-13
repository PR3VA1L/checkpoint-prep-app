export interface ProgressRow { count: number; score: number; total: number }
export const LEVEL_TITLES = ["Explorer", "Learner", "Problem Solver", "Skilled Thinker", "Proficient"] as const;
export function levelFor(row: ProgressRow): number {
  const accuracy = row.total ? row.score / row.total : 0;
  if (row.count >= 50 && accuracy >= 0.85) return 5;
  if (row.count >= 30 && accuracy >= 0.8) return 4;
  if (row.count >= 15 && accuracy >= 0.7) return 3;
  if (row.count >= 5 && accuracy >= 0.6) return 2;
  return 1;
}
export function subjectProgress(topics: Record<string, ProgressRow>, subject: string): ProgressRow {
  return Object.entries(topics).filter(([key]) => key.startsWith(`${subject}:`)).reduce(
    (result, [, row]) => ({ count: result.count + row.count, score: result.score + row.score, total: result.total + row.total }),
    { count: 0, score: 0, total: 0 },
  );
}
