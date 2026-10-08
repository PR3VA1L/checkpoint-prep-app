import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); // Use 3.5 flash for speed/availability

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const qbPath = path.join(__dirname, 'src', 'data', 'questionBank.ts');
const mbPath = path.join(__dirname, 'src', 'data', 'mockExamBank.ts');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateMCQ(subject) {
    const prompt = `You are a Cambridge Primary Checkpoint Examiner. 
Generate 100 diverse multiple-choice questions for ${subject} for Year 6 (11-year-olds).
Use topics appropriate for ${subject}. 
Output strictly JSON as an array of objects matching:
{ "subject": "${subject.toLowerCase()}", "topic": "string", "difficulty": "Medium", "question": "string", "options": ["string", "string", "string", "string"], "correctIndex": number (0-3), "explanation": "string" }
Output ONLY the raw JSON array. DO NOT use markdown \`\`\`json.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) text = text.slice(7);
    if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);
    
    return JSON.parse(text.trim());
}

async function generateMockExams(subject) {
    const prompt = `You are a Cambridge Primary Checkpoint Examiner.
Generate an array of 5 full mock exams for ${subject} for Year 6 (11-year-olds). (Generating 100 in one go is too large, so just generate 5 high quality ones for now, I will loop this).
If subject is ENGLISH: Provide a reading comprehension passage (approx 200 words) and 5 questions. Provide a writing prompt for a short story.
If subject is MATH or SCIENCE: Provide a structured scenario and 5 short-answer questions. Provide an Extended Problem Solving prompt for writing.

Output strictly JSON as an array of objects matching:
[
  {
    "comprehension": { "title": "string", "passage": "string", "questions": [ { "id": number, "text": "string", "marks": number } ] },
    "writing": { "instructions": "string" }
  }
]
Output ONLY the raw JSON array. DO NOT use markdown.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('```json')) text = text.slice(7);
    if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);
    
    return JSON.parse(text.trim());
}

async function run() {
    console.log("Starting generation...");
    
    // Process MCQs
    let qbContent = fs.readFileSync(qbPath, 'utf8');
    const closingBracketIndex = qbContent.lastIndexOf('];');
    let beforeQb = qbContent.substring(0, closingBracketIndex).trimEnd();
    if (!beforeQb.endsWith(',')) beforeQb += ',';
    const afterQb = qbContent.substring(closingBracketIndex + 2);
    
    let allNewQs = [];
    for (const subject of ['English', 'Math', 'Science']) {
        console.log(`Generating 100 MCQs for ${subject}...`);
        try {
            const qs = await generateMCQ(subject);
            allNewQs = allNewQs.concat(qs);
            console.log(`Generated ${qs.length} MCQs for ${subject}`);
        } catch (e) {
            console.error(`Failed MCQ for ${subject}`, e.message);
        }
        await sleep(2000);
    }
    
    if (allNewQs.length > 0) {
        const qsStr = allNewQs.map(q => `  ${JSON.stringify(q)}`).join(',\n');
        fs.writeFileSync(qbPath, `${beforeQb}\n  // AI Generated Batch\n${qsStr}\n];\n${afterQb}`);
        console.log("Saved new MCQs");
    }

    // Convert MOCK_EXAM_BANK to array syntax if not already
    let mbContent = fs.readFileSync(mbPath, 'utf8');
    // For simplicity, we'll just rewrite the file to be arrays.
    
    let exams = { english: [], math: [], science: [] };
    
    for (const subject of ['English', 'Math', 'Science']) {
        console.log(`Generating Mock Exams for ${subject}...`);
        for (let i = 0; i < 4; i++) { // Generate 20 exams per subject (5 * 4) to avoid timeouts, still a good amount
            try {
                const exms = await generateMockExams(subject);
                exams[subject.toLowerCase()] = exams[subject.toLowerCase()].concat(exms);
                console.log(`Generated batch ${i+1} for ${subject}`);
            } catch (e) {
                console.error(`Failed Mock Exam for ${subject}`, e.message);
            }
            await sleep(2000);
        }
    }
    
    const newMbContent = `export const MOCK_EXAM_BANK: Record<string, any[]> = ${JSON.stringify(exams, null, 2)};\n`;
    fs.writeFileSync(mbPath, newMbContent);
    console.log("Saved new Mock Exams");
}

run().catch(console.error);
