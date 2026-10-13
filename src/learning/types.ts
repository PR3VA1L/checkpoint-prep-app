export type Subject = "english" | "math" | "science";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Diagram =
  | { kind: "bars"; labels: string[]; values: number[]; unit: string }
  | { kind: "triangle"; base: number; height: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "foodweb"; nodes: string[]; edges: { from: number; to: number }[] }
  | { kind: "forces"; left: number; right: number }
  | { kind: "circuit"; parallel: boolean; open: boolean }
  | { kind: "grid"; points: { x: number; y: number; label: string }[] };
export interface Part {
  id: string;
  text: string;
  marks: number;
  answer: string;
  guidance: string;
  exact?: string[];
  // Each point is worth one mark. Phrases are educator-authored alternatives,
  // never inferred from the model answer or the prose guidance.
  markPoints?: { alternatives: string[] }[];
  choices?: string[];
}
export interface Question {
  id: string;
  family: string;
  subject: Subject;
  topic: string;
  objective: string;
  difficulty: Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  context: string;
  parts: Part[];
  diagram?: Diagram;
  calculatorAllowed?: boolean;
}
export interface Family {
  id: string;
  subject: Subject;
  topic: string;
  objective: string;
  variants: number;
  make: (variant: number, difficulty: Difficulty, paper: 1 | 2) => Question;
}
export interface Selection {
  subject: Subject;
  topics: string[];
  difficulty: Difficulty | "Mixed";
  count: number;
  paper: 1 | 2;
  mode: "mcq" | "structured" | "writing";
}
export interface Seen {
  id: string;
  family: string;
  day: string;
}
export interface Review {
  family: string;
  due: string;
  lastDay: string;
  correct: number;
}
export interface Answer {
  value: string;
  hint: boolean;
  score: number;
  max: number;
  topic: string;
  family: string;
  reviewed?: boolean;
  feedback?: string;
  markingMethod?: "rules" | "model" | "manual" | "pending";
}
export interface Attempt {
  id: string;
  schemaVersion: 2;
  subject: Subject;
  type: string;
  mode: Selection["mode"];
  paper: 1 | 2;
  difficulty: Selection["difficulty"];
  topics: string[];
  questions: Question[];
  answers: Record<string, Answer>;
  startedAt: number;
  updatedAt?: number;
  completedAt?: number;
  deadline?: number;
  score: number;
  total: number;
  grading: "automatic" | "self-assessed" | "ai-assisted" | "awaiting-review";
  status: "active" | "completed";
  durationSeconds: number;
  activeTimeTracked?: boolean;
  reading?: { id: string; title: string; paragraphs: string[] };
  writingPrompt?: string;
  markingVersion?: string;
}
