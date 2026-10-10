import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const qbPath = path.join(__dirname, '..', 'src', 'data', 'questionBank.ts');
const mbPath = path.join(__dirname, '..', 'src', 'data', 'mockExamBank.ts');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseJSONSafely(text) {
    let t = text.trim();
    if (t.startsWith('```json')) t = t.slice(7);
    if (t.startsWith('```')) t = t.slice(3);
    if (t.endsWith('```')) t = t.slice(0, -3);
    try {
        return JSON.parse(t.trim());
    } catch (e) {
        console.error("Failed to parse JSON");
        return null;
    }
}

// ----------------------------------------------------
// MCQ GENERATION
// ----------------------------------------------------
async function generateMCQ(subject, difficulty, count = 25) {
    const topics = subject === 'English' 
        ? ['Grammar', 'Punctuation', 'Vocabulary in Context', 'Purpose and Audience', 'Literary Devices', 'Spelling']
        : subject === 'Math'
        ? ['Number and Calculation', 'Fractions, Decimals and Percentages', 'Geometry', 'Measure', 'Handling Data']
        : ['Biology', 'Chemistry', 'Physics', 'Scientific Enquiry'];

    const prompt = `You are a Cambridge Primary Checkpoint Examiner for Year 6 (11-year-olds).
Generate exactly ${count} highly rigorous multiple-choice questions for ${subject}.
Difficulty: ${difficulty}. If "Hard", they must be exceptionally tricky, testing deep multi-step thinking, edge-cases, and common misconceptions. Distractors must be highly plausible.
Distribute the questions evenly across these topics: ${topics.join(', ')}.

Strict constraints:
1. Four options exactly.
2. Shuffle the correct index randomly between 0 and 3.
3. Use exact Cambridge UK terminology (e.g., 'working out', 'marks', 'litre', 'metre').
4. The explanation must clearly explain WHY the correct answer is right and why distractors might trick a student.

Output strictly JSON as an array of objects matching:
[
  { 
    "subject": "${subject.toLowerCase()}", 
    "topic": "string (from allowed topics)", 
    "difficulty": "${difficulty}", 
    "question": "string", 
    "options": ["string", "string", "string", "string"], 
    "correctIndex": number (0-3), 
    "explanation": "string" 
  }
]
Output ONLY raw JSON array. DO NOT wrap in markdown \`\`\`json.`;

    const result = await model.generateContent(prompt);
    return parseJSONSafely(result.response.text()) || [];
}

// ----------------------------------------------------
// STRUCTURED QUESTIONS (EXAMS) GENERATION
// ----------------------------------------------------
async function generateStructuredPaper(subject, paperType, difficulty) {
    let prompt = "";
    if (subject === 'English') {
        prompt = `You are a Cambridge Primary Checkpoint English Examiner (Year 6).
Generate a structured ${paperType === 'Paper 1' ? 'Non-fiction (Comprehension)' : 'Fiction (Comprehension)'} section and a Writing section.
The comprehension MUST have a passage (200-250 words) and 5 structured questions assessing literal retrieval, inference, and vocabulary in context.
Difficulty: ${difficulty}.
The writing must have a prompt suitable for ${paperType === 'Paper 1' ? 'an article/report/letter' : 'a story/narrative'}.

Output strictly JSON matching:
{
  "difficulty": "${difficulty}",
  "paper": "${paperType}",
  "comprehension": {
    "title": "string",
    "passage": "string",
    "questions": [ { "id": 1, "text": "string", "marks": number, "expectedAnswer": "string", "type": "short-answer" } ]
  },
  "writing": {
    "instructions": "string",
    "totalMarks": 25
  }
}`;
    } else if (subject === 'Math') {
        prompt = `You are a Cambridge Primary Checkpoint Math Examiner (Year 6).
Generate a structured half-paper (${paperType}). It must contain 10 structured questions covering Number, Geometry, Measure, and Handling Data.
Difficulty: ${difficulty}.
CRITICAL: Do NOT provide a "passage" or "scenario" paragraph for Math. The "passage" field MUST be null.

Output strictly JSON matching:
{
  "difficulty": "${difficulty}",
  "paper": "${paperType}",
  "comprehension": {
    "title": "Math Paper",
    "passage": null,
    "questions": [ { "id": 1, "text": "string (include the full question text here, use \\n for line breaks)", "marks": number, "expectedAnswer": "string" } ]
  },
  "writing": { "instructions": null }
}`;
    } else if (subject === 'Science') {
        prompt = `You are a Cambridge Primary Checkpoint Science Examiner (Year 6).
Generate a structured half-paper (${paperType}). It must contain 8 structured questions covering Biology, Chemistry, and Physics.
Difficulty: ${difficulty}.
CRITICAL: Do NOT provide a "passage" or general paragraph for Science. The "passage" field MUST be null. Put any scenario text directly into the specific question's "text" field, using \\n for line breaks.

Output strictly JSON matching:
{
  "difficulty": "${difficulty}",
  "paper": "${paperType}",
  "comprehension": {
    "title": "Science Paper",
    "passage": null,
    "questions": [ { "id": 1, "text": "string (include full multi-part scenario here, use \\n for line breaks)", "marks": number, "expectedAnswer": "string" } ]
  },
  "writing": { "instructions": null }
}`;
    }

    prompt += `\nOutput ONLY raw JSON. DO NOT wrap in markdown \`\`\`json.`;

    const result = await model.generateContent(prompt);
    return parseJSONSafely(result.response.text()) || null;
}

async function run() {
    console.log("Starting Cambridge Generation... Target: 300 MCQs and 10 Exams per subject");

    // GENERATE MCQS
    let allNewQs = [];
    for (const subj of ['English', 'Math', 'Science']) {
        for (const diff of ['Easy', 'Medium', 'Hard']) {
            // 4 loops of 25 = 100 per difficulty = 300 per subject
            for (let i = 0; i < 4; i++) {
                console.log(`Generating MCQ: ${subj} - ${diff} (Batch ${i+1}/4)...`);
                try {
                    const qs = await generateMCQ(subj, diff, 25);
                    if (Array.isArray(qs)) {
                        allNewQs = allNewQs.concat(qs);
                        console.log(`+ Got ${qs.length} questions. Total: ${allNewQs.length}`);
                    }
                } catch (e) {
                    console.error(`Failed ${subj} ${diff}`, e);
                }
                await sleep(3000);
            }
        }
    }

    const qbContent = `export interface BankQuestion {
  id?: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Generated cleanly by scripts/generate-cambridge.js
// Total Questions: ${allNewQs.length}
export const QUESTION_BANK: BankQuestion[] = ${JSON.stringify(allNewQs, null, 2)};
`;
    fs.writeFileSync(qbPath, qbContent);
    console.log("Overwritten questionBank.ts with 900+ questions.");

    // GENERATE EXAMS
    let exams = { english: [], math: [], science: [] };
    for (const subj of ['English', 'Math', 'Science']) {
        for (const diff of ['Easy', 'Medium', 'Hard']) {
            for (let i=0; i<2; i++) {
                const paper = i === 0 ? 'Paper 1' : 'Paper 2';
                console.log(`Generating Exam: ${subj} ${paper} ${diff}...`);
                try {
                    const exam = await generateStructuredPaper(subj, paper, diff);
                    if (exam) {
                        exams[subj.toLowerCase()].push(exam);
                        console.log(`+ Generated ${subj} exam`);
                    }
                } catch (e) {
                    console.error(`Failed ${subj} exam`, e);
                }
                await sleep(3000);
            }
        }
    }

    const mbContent = `// Generated cleanly by scripts/generate-cambridge.js
export const MOCK_EXAM_BANK: Record<string, any[]> = ${JSON.stringify(exams, null, 2)};
`;
    fs.writeFileSync(mbPath, mbContent);
    console.log("Overwritten mockExamBank.ts with structured exams.");
}

run().catch(console.error);
