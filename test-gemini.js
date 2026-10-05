import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing API Key");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function testGen() {
  const prompt = `
You are an expert Cambridge Primary Checkpoint English (0058/0844) Examiner.
Generate exactly 5 multiple-choice questions for 11-year-old students.
Difficulty Level: Mixed
Topics Allowed: Grammar

For each question, provide 4 options. Only 1 option must be correct.
Provide a clear, brief explanation for the correct answer.

OUTPUT STRICTLY IN JSON FORMAT matching this TypeScript interface exactly, nothing else:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctIndex": number (0-3),
    "explanation": "string",
    "topic": "string (one of the Topics Allowed)",
    "difficulty": "string (Easy, Medium, or Hard)",
    "cambridgeStrand": "string"
  }
]

Do not use markdown formatting like \`\`\`json. Return raw JSON text only.`;

  try {
    const result = await model.generateContent(prompt);
    console.log("Raw Response:", result.response.text());
  } catch (e) {
    console.error("Failed:", e);
  }
}

testGen();
