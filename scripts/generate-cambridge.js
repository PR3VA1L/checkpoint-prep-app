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
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); // Using 3.5 Flash because the user API key is in the future!

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
        console.error("Failed to parse JSON", e);
        return null;
    }
}

// ----------------------------------------------------
// MCQ GENERATION
// ----------------------------------------------------
async function generateMCQ(subject, topics, difficulty, count = 10) {
    const prompt = `You are a Cambridge Primary Checkpoint Examiner for Year 6 (11-year-olds).
Generate exactly ${count} highly rigorous multiple-choice questions for ${subject}.
Difficulty: ${difficulty} (Tricky, requires multi-step reasoning or identifying common misconceptions. Do NOT just use larger numbers).
Allowed Topics: ${topics.join(', ')}. Ensure diversity across these topics.

Strict constraints:
1. Four options exactly, completely distinct. No "All of the above" or "None of the above".
2. Shuffle the correct index randomly between 0 and 3.
3. Use exact Cambridge UK terminology (e.g., 'working out', 'marks', 'litre', 'metre', 'full stop', 'inverted commas').
4. The explanation must clearly explain WHY the correct answer is right and why distractors might trick a student, using child-friendly but formal language.

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
async function generateStructuredPaper(subject, paperType) {
    let prompt = "";
    if (subject === 'English') {
        prompt = `You are a Cambridge Primary Checkpoint English Examiner (Year 6).
Generate a structured ${paperType === 'Paper 1' ? 'Non-fiction (Comprehension)' : 'Fiction (Comprehension)'} section and a Writing section.
The comprehension MUST have a passage (200-250 words) and 5 structured questions assessing literal retrieval, inference, and vocabulary in context.
The writing must have a prompt suitable for ${paperType === 'Paper 1' ? 'an article/report/letter' : 'a story/narrative'}, marked out of 25 using the 5-category rubric (Creation of ideas, Vocabulary/Spelling, Grammar/Punctuation, Structure, Formatting).

Output strictly JSON matching:
{
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
        const isCalc = paperType === 'Paper 2' ? 'Calculator Allowed' : 'No Calculator';
        prompt = `You are a Cambridge Primary Checkpoint Math Examiner (Year 6).
Generate a structured half-paper (${paperType} - ${isCalc}). It must contain 10 structured questions covering Number, Geometry, Measure, and Handling Data.
Difficulty must reflect official Cambridge checkpoints (multi-step word problems, reasoning, not just basic arithmetic).
For ${paperType}, ensure the questions fit the tool rule: ${isCalc}.

Output strictly JSON matching:
{
  "paper": "${paperType}",
  "questions": [ 
     { "id": 1, "topic": "string", "text": "string", "marks": number, "expectedAnswer": "string", "type": "structured", "workingOutRequired": boolean }
  ]
}`;
    } else if (subject === 'Science') {
        prompt = `You are a Cambridge Primary Checkpoint Science Examiner (Year 6).
Generate a structured half-paper (${paperType}). It must contain 8 structured questions covering Biology, Chemistry, and Physics (e.g., forces, circuits, states of matter, plants, human body).
Questions should often include tables of data, experiment setups, or scientific models and require students to identify variables, read data, or explain phenomena.

Output strictly JSON matching:
{
  "paper": "${paperType}",
  "questions": [ 
     { "id": 1, "topic": "string", "text": "string", "marks": number, "expectedAnswer": "string", "type": "structured" }
  ]
}`;
    }

    prompt += `\nOutput ONLY raw JSON. DO NOT wrap in markdown \`\`\`json.`;

    const result = await model.generateContent(prompt);
    return parseJSONSafely(result.response.text()) || null;
}

async function run() {
    console.log("Starting Cambridge Generation...");

    const topics = {
        english: ['Grammar', 'Punctuation', 'Vocabulary in Context', 'Purpose and Audience', 'Literary Devices', 'Spelling'],
        math: ['Number and Calculation', 'Fractions, Decimals and Percentages', 'Geometry', 'Measure', 'Handling Data'],
        science: ['Biology', 'Chemistry', 'Physics', 'Scientific Enquiry']
    };

    // GENERATE MCQS
    let allNewQs = [];
    for (const subj of Object.keys(topics)) {
        for (const diff of ['Medium', 'Hard']) {
            console.log(`Generating MCQ: ${subj} - ${diff}...`);
            try {
                const qs = await generateMCQ(subj.charAt(0).toUpperCase() + subj.slice(1), topics[subj], diff, 10);
                allNewQs = allNewQs.concat(qs);
                console.log(`Generated ${qs.length} MCQs`);
            } catch (e) {
                console.error(`Failed ${subj} ${diff}`, e);
            }
            await sleep(3000);
        }
    }

    // Write MCQs cleanly
    const qbContent = `export interface BankQuestion {
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
export const QUESTION_BANK: BankQuestion[] = ${JSON.stringify(allNewQs, null, 2)};
`;
    fs.writeFileSync(qbPath, qbContent);
    console.log("Overwritten questionBank.ts with clean Cambridge data.");

    // GENERATE EXAMS
    let exams = { english: [], math: [], science: [] };
    for (const subj of ['English', 'Math', 'Science']) {
        for (const paper of ['Paper 1', 'Paper 2']) {
            console.log(`Generating Exam: ${subj} ${paper}...`);
            try {
                const exam = await generateStructuredPaper(subj, paper);
                if (exam) {
                    exams[subj.toLowerCase()].push(exam);
                    console.log(`Generated ${subj} ${paper}`);
                }
            } catch (e) {
                console.error(`Failed ${subj} ${paper}`, e);
            }
            await sleep(3000);
        }
    }

    const mbContent = `// Generated cleanly by scripts/generate-cambridge.js
export const MOCK_EXAM_BANK: Record<string, any[]> = ${JSON.stringify(exams, null, 2)};
`;
    fs.writeFileSync(mbPath, mbContent);
    console.log("Overwritten mockExamBank.ts with clean Cambridge data.");
}

run().catch(console.error);
