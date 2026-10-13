import type { Subject } from "./types";
export const SUBJECTS: Subject[] = ["english", "math", "science"];
export const subjectName = (subject: Subject) =>
  ({ english: "English", math: "Mathematics", science: "Science" })[subject];
export const isSubject = (value: unknown): value is Subject =>
  SUBJECTS.includes(value as Subject);
export const TOPICS: Record<Subject, Record<string, string>> = {
  math: {
    number: "Number & calculations",
    fractions: "Fractions & percentages",
    decimals: "Decimals & place value",
    ratio: "Ratio & proportion",
    sequences: "Sequences",
    geometry: "Geometry & measure",
    coordinates: "Coordinates & transformations",
    statistics: "Statistics & probability",
  },
  science: {
    body: "Human body & health",
    ecosystems: "Food webs & ecosystems",
    materials: "Materials & changes",
    forces: "Forces",
    light: "Light",
    electricity: "Electricity",
    earth: "Rocks & soils",
    space: "Earth & space",
    enquiry: "Scientific enquiry",
  },
  english: {
    inference: "Reading & inference",
    vocabulary: "Vocabulary in context",
    language: "Writer’s language & effects",
    grammar: "Grammar & sentences",
    punctuation: "Punctuation",
    spelling: "Spelling & word structure",
  },
};
export const WRITING_RUBRIC = [
  {
    id: "content",
    name: "Creation of texts",
    max: 5,
    help: "Develop relevant ideas for the task and reader.",
  },
  {
    id: "vocabulary",
    name: "Vocabulary and language",
    max: 3,
    help: "Choose precise words that suit the purpose; difficult words alone do not earn marks.",
  },
  {
    id: "structure",
    name: "Structure of texts",
    max: 7,
    help: "Organise and connect ideas in clear paragraphs.",
  },
  {
    id: "grammar",
    name: "Grammar and punctuation",
    max: 7,
    help: "Use accurate sentences and punctuation, varying sentences for effect.",
  },
  {
    id: "spelling",
    name: "Word structure (spelling)",
    max: 3,
    help: "Spell familiar and more ambitious words accurately.",
  },
];
export function paperPolicy(subject: Subject, paper: 1 | 2, full = false) {
  const minutes = subject === "english" ? 60 : subject === "math" ? 45 : 35;
  return {
    label:
      subject === "english"
        ? paper === 1
          ? "Non-fiction"
          : "Fiction"
        : `Paper ${paper}`,
    calculator: subject === "science" || (subject === "math" && paper === 2),
    marks: subject === "english" ? (full ? 50 : 25) : full ? 40 : 20,
    seconds: (minutes * 60) / (full ? 1 : 2),
  };
}
