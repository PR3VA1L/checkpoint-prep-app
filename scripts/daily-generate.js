import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const qbPath = path.join(__dirname, '..', 'src', 'data', 'questionBank.ts');

async function generateMCQ(subject) {
    const prompt = `You are a Cambridge Primary Checkpoint Examiner. 
Generate exactly 3 diverse multiple-choice questions for ${subject} for Year 6 (11-year-olds).
Use topics appropriate for ${subject} from the official syllabus.
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

async function run() {
    console.log("Starting daily generation...");
    
    let qbContent = fs.readFileSync(qbPath, 'utf8');
    const closingBracketIndex = qbContent.lastIndexOf('];');
    let beforeQb = qbContent.substring(0, closingBracketIndex).trimEnd();
    if (!beforeQb.endsWith(',')) beforeQb += ',';
    const afterQb = qbContent.substring(closingBracketIndex + 2);
    
    let allNewQs = [];
    for (const subject of ['English', 'Math', 'Science']) {
        console.log(`Generating 3 MCQs for ${subject}...`);
        try {
            const qs = await generateMCQ(subject);
            allNewQs = allNewQs.concat(qs);
            console.log(`Generated ${qs.length} MCQs for ${subject}`);
        } catch (e) {
            console.error(`Failed MCQ for ${subject}`, e.message);
        }
    }
    
    if (allNewQs.length > 0) {
        const qsStr = allNewQs.map(q => `  ${JSON.stringify(q)}`).join(',\n');
        fs.writeFileSync(qbPath, `${beforeQb}\n  // Daily Auto-Generated Batch\n${qsStr}\n];\n${afterQb}`);
        console.log("Saved daily MCQs");
    }
}

run().catch(console.error);
