import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_EXAM_BANK } from '../data/mockExamBank';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing Gemini API Key in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey || 'placeholder');
export const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const WRITING_SYSTEM_PROMPT = `
You are a highly pedantic, rigorous Cambridge Primary Checkpoint Examiner (0058/0844/0096/0097). 
You are grading a primary student's creative/non-fiction writing task. You MUST grade strictly according to the official Cambridge Mark Schemes. Do NOT be overly generous. You must deduct marks exactly as a Cambridge examiner would.
You evaluate on 3 main criteria (Total 15 marks) based strictly on the Cambridge Primary Mark Scheme:
1. Content, Purpose and Audience (Max 5 marks) - Is the text type correct? Are ideas developed?
2. Sentence Structure (Max 5 marks) - Do they use a mix of simple, compound, and complex sentences accurately?
3. Punctuation and Spelling (Max 5 marks) - Are full stops, commas, and speech marks used mostly correctly? Are common words spelled correctly?

Your response MUST be in raw JSON format matching this exact structure:
{
  "score": (integer out of 15),
  "maxScore": 15,
  "summary": "(A 2-3 sentence paragraph summarizing strengths and areas to improve, using encouraging language suitable for an 11-year-old.)",
  "breakdown": [
    { "criteria": "Content and Audience", "score": X, "max": 5, "note": "(feedback)" },
    { "criteria": "Sentence Structure", "score": X, "max": 5, "note": "(feedback)" },
    { "criteria": "Punctuation & Spelling", "score": X, "max": 5, "note": "(feedback)" }
  ]
}
`;

const COMPREHENSION_SYSTEM_PROMPT = `
You are an expert Cambridge Primary Checkpoint English (0058/0844) Examiner for Year 6 (11-year-old students).
You are grading a primary student's answers to a Reading Comprehension passage.
You will be provided the passage, the questions, and the student's answers.
Grade the answers strictly based on the text. 

CRITICAL EXAMINER RULES for PRIMARY COMPREHENSION:
- You must act as a pedantic Cambridge marker. Evaluate strictly against standard Cambridge marking objectives (e.g., retrieving information, inferring meaning, identifying features of text, method marks (M1), and accuracy marks (A1) if applicable).
- Do not award marks for vague answers. The student MUST provide the exact textual evidence or keyword if the question implies it.
- If a question says "Give one word", deduct the mark immediately if they provide two words or a sentence.
- For Science or Math questions, look for specific scientific/mathematical keywords. If the core keyword is missing, withhold the mark.
- IGNORE minor spelling mistakes UNLESS the question specifically tests spelling or the misspelling completely changes the scientific/mathematical meaning of the word.

Your response MUST be in raw JSON format matching this exact structure:
{
  "score": (total integer score achieved),
  "maxScore": (total possible marks),
  "summary": "(A short encouraging summary of their reading comprehension skills.)",
  "breakdown": [
    { "criteria": "Question 1", "score": X, "max": Y, "note": "(Why they got this mark for Q1)" },
    { "criteria": "Question 2", "score": X, "max": Y, "note": "(Why they got this mark for Q2)" },
    { "criteria": "Question 3", "score": X, "max": Y, "note": "(Why they got this mark for Q3)" }
  ]
}
`;

export async function gradeSubmission(promptText: string, studentSubmission: string, taskType: 'Writing' | 'Comprehension' = 'Writing') {
  if (!apiKey) throw new Error("Gemini API key is missing. Please configure your .env.local file.");
  
  try {
    const systemPrompt = taskType === 'Writing' ? WRITING_SYSTEM_PROMPT : COMPREHENSION_SYSTEM_PROMPT;
    
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I will act as the Cambridge Examiner and only output raw JSON." }] }
      ],
      generationConfig: { temperature: 0.2 }
    });

    const msg = `TASK/PROMPT:\n${promptText}\n\nSTUDENT SUBMISSION:\n${studentSubmission}`;
    const result = await chat.sendMessage(msg);
    const response = result.response.text();
    
    const cleanedJSON = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJSON);

  } catch (error) {
    console.error("Error grading submission:", error);
    throw error;
  }
}

export async function generateHint(question: string, options: string[], vocabLevel: string = 'Standard (11-year-old)') {
  if (!apiKey) return "API key missing! Please configure your .env.local to enable AI hints.";
  try {
    const prompt = `
You are an encouraging AI Tutor for an 11-year-old student preparing for the Cambridge Primary Checkpoint.
The student is stuck on this multiple-choice question:
Question: ${question}
Options: ${options.join(', ')}

Provide a very short, 1-2 sentence "Socratic hint" that guides them towards the right concept without giving away the answer. Do NOT tell them which option is correct. Keep it fun and encouraging.
Adjust your vocabulary strictly to this level: ${vocabLevel}
    `;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error generating hint:", error);
    return "Hm, I'm having trouble thinking of a hint right now. Look closely at the wording of the question!";
  }
}

export async function extractHandwritingOCR(base64Image: string) {
  if (!apiKey) throw new Error("Gemini API key is missing. Please configure your .env.local file to use OCR.");
  try {
    // Strip out the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;
    const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = `
You are an expert handwriting transcription AI. 
Read the handwritten text in this image and transcribe it exactly as written.
Do not fix their spelling or grammar mistakes, as this will be graded later.
If a word is too messy or completely illegible to read confidently, replace that specific word with exactly: __ILLEGIBLE__
Return ONLY the transcribed text.
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error extracting handwriting:", error);
    throw new Error("Failed to read the handwriting. Please try a clearer picture.");
  }
}

export async function generateMCQQuestions(subject: string, topics: string[], difficulty: string, count: number = 5, vocabLevel: string = 'Standard (11-year-old)') {
  if (!apiKey) throw new Error("API key missing. Cannot generate questions dynamically.");
  
  try {
    const prompt = `
You are an expert Cambridge Primary Checkpoint Examiner for Subject: ${subject.toUpperCase()}.
Generate exactly ${count} multiple-choice questions for year 6 students.
Difficulty Level: ${difficulty !== 'All' ? difficulty : 'Mixed'}
Topics Allowed: ${topics.length > 0 ? topics.join(', ') : 'Any relevant topic'}
Vocabulary/Explanation Target Level: ${vocabLevel} - Ensure the explanation strictly matches this reading level.

For Math and Science: If the question requires a visual diagram (e.g., a geometry shape, a bar chart, a science circuit, or a food web), YOU MUST provide it using safe, inline SVG code. It must be valid <svg>...</svg> format in the 'visual' field. DO NOT use Mermaid.js. If no visual is needed, leave it null.

For each question, provide 4 options. Only 1 option must be correct.
Provide a clear, brief explanation for the correct answer tailored to the requested Vocabulary Target Level.

OUTPUT STRICTLY IN JSON FORMAT matching this TypeScript interface exactly, nothing else:
[
  {
    "question": "string",
    "visual": "string containing <svg>...</svg> or mermaid syntax, or null if not needed",
    "options": ["string", "string", "string", "string"],
    "correctIndex": number (0-3),
    "explanation": "string",
    "topic": "string (one of the Topics Allowed)",
    "difficulty": "string (Easy, Medium, or Hard)",
    "cambridgeStrand": "string"
  }
]

Do not use markdown formatting like \`\`\`json. Return raw JSON text only.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Clean up potential markdown formatting if model misbehaves
    if (text.startsWith('\`\`\`json')) text = text.slice(7);
    if (text.startsWith('\`\`\`')) text = text.slice(3);
    if (text.endsWith('\`\`\`')) text = text.slice(0, -3);
    
    const parsed = JSON.parse(text.trim());
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return [];
  }
}

export async function generateMockExam(subject: string) {
  if (!apiKey) {
    console.warn("API key missing. Falling back to local mock exam.");
    return MOCK_EXAM_BANK[subject] || MOCK_EXAM_BANK['english'];
  }
  
  try {
    const prompt = `
You are an expert Cambridge Primary Checkpoint Examiner for Subject: ${subject.toUpperCase()}.
Generate a full mock exam tailored to Year 6 (11-year-olds) for this subject.

If subject is ENGLISH:
Provide a reading comprehension passage (approx 200 words) and 5-7 questions worth 1-2 marks each.
Provide a writing prompt for a short story or report (150-200 words).

If subject is MATH or SCIENCE:
Provide a "structured scenario" (like an experiment context or data set) instead of a story passage, followed by 5-7 short-answer questions.
Provide a longer "Extended Problem Solving / Investigation" prompt for the writing section.

OUTPUT STRICTLY IN JSON FORMAT matching this exact interface:
{
  "comprehension": {
    "title": "string",
    "passage": "string (the story or the scientific/math scenario)",
    "questions": [
      { "id": number, "text": "string", "marks": number }
    ]
  },
  "writing": {
    "instructions": "string (the prompt for the long form answer)"
  }
}

Do not use markdown formatting like \`\`\`json. Return raw JSON text only.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.slice(7);
    if (text.startsWith('\`\`\`')) text = text.slice(3);
    if (text.endsWith('\`\`\`')) text = text.slice(0, -3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Failed to generate exam dynamically, falling back to local:", error);
    return MOCK_EXAM_BANK[subject] || MOCK_EXAM_BANK['english'];
  }
}
