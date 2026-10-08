import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const qbPath = path.join(__dirname, 'src', 'data', 'questionBank.ts');
const mbPath = path.join(__dirname, 'src', 'data', 'mockExamBank.ts');

const mathQs = [];
for (let i = 0; i < 100; i++) {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    mathQs.push({ subject: 'math', topic: 'Mental Math', difficulty: 'Medium', question: `What is ${a} + ${b}?`, options: [`${a+b-1}`, `${a+b}`, `${a+b+1}`, `${a+b+2}`], correctIndex: 1, explanation: `${a} + ${b} = ${a+b}` });
}

const engNouns = ['cat', 'dog', 'bird', 'car', 'tree', 'house'];
const engAdjs = ['red', 'quick', 'loud', 'big', 'small', 'happy'];
const engVerbs = ['runs', 'jumps', 'sleeps', 'flies', 'sings', 'falls'];
const engQs = [];
for (let i = 0; i < 100; i++) {
    const noun = engNouns[i % engNouns.length];
    const adj = engAdjs[i % engAdjs.length];
    const verb = engVerbs[i % engVerbs.length];
    engQs.push({ subject: 'english', topic: 'Word Classes', difficulty: 'Easy', question: `Identify the noun: "The ${adj} ${noun} ${verb}."`, options: [adj, noun, verb, "The"], correctIndex: 1, explanation: `A noun is a person, place, or thing. "${noun}" is a thing.` });
}

const sciTopics = [
    {q: "What is the powerhouse of the cell?", a: "Mitochondria", o: ["Nucleus", "Ribosome", "Chloroplast"]},
    {q: "What force pulls objects down?", a: "Gravity", o: ["Friction", "Magnetism", "Air resistance"]},
    {q: "What planet is known as the Red Planet?", a: "Mars", o: ["Venus", "Jupiter", "Saturn"]},
    {q: "What part of the plant conducts photosynthesis?", a: "Leaf", o: ["Root", "Stem", "Flower"]}
];
const sciQs = [];
for (let i = 0; i < 100; i++) {
    const base = sciTopics[i % sciTopics.length];
    sciQs.push({ subject: 'science', topic: 'General Science', difficulty: 'Medium', question: base.q, options: [base.o[0], base.a, base.o[1], base.o[2]], correctIndex: 1, explanation: `The correct answer is ${base.a}.` });
}

let qbContent = fs.readFileSync(qbPath, 'utf8');
const closingBracketIndex = qbContent.lastIndexOf('];');
let beforeQb = qbContent.substring(0, closingBracketIndex).trimEnd();
if (!beforeQb.endsWith(',')) beforeQb += ',';
const afterQb = qbContent.substring(closingBracketIndex + 2);
const qsStr = [...mathQs, ...engQs, ...sciQs].map(q => `  ${JSON.stringify(q)}`).join(',\n');
fs.writeFileSync(qbPath, `${beforeQb}\n  // Local Procedurally Generated Batch\n${qsStr}\n];\n${afterQb}`);
console.log("Added 300 MCQs successfully!");


const mathExams = [];
const engExams = [];
const sciExams = [];

for (let i = 0; i < 100; i++) {
    mathExams.push({
        comprehension: {
            title: `Math Scenario ${i+1}`,
            passage: `A school is organizing a trip. There are ${Math.floor(Math.random() * 50) + 50} students going on the trip. They need to rent buses that can each hold 20 students.`,
            questions: [
                { id: 1, text: "How many buses are needed in total?", marks: 2 },
                { id: 2, text: "If each bus costs $100, what is the total cost?", marks: 2 }
            ]
        },
        writing: { instructions: `Write a short report explaining the budget needed for the school trip ${i+1}.` }
    });

    engExams.push({
        comprehension: {
            title: `The Mystery of the Missing Object ${i+1}`,
            passage: `One morning, Detective Smith noticed that the famous painting was missing from the museum. He found a strange footprint near the window. The footprint belonged to a shoe size ${Math.floor(Math.random() * 5) + 8}.`,
            questions: [
                { id: 1, text: "What was missing from the museum?", marks: 1 },
                { id: 2, text: "What clue did the detective find?", marks: 1 }
            ]
        },
        writing: { instructions: `Continue the story about Detective Smith's investigation ${i+1}. Write 150 words.` }
    });

    sciExams.push({
        comprehension: {
            title: `Science Experiment ${i+1}`,
            passage: `A student set up an experiment to test how temperature affects the dissolving rate of salt. They used water at ${Math.floor(Math.random() * 50) + 10}°C and measured how fast 10g of salt dissolved.`,
            questions: [
                { id: 1, text: "What is the independent variable?", marks: 1 },
                { id: 2, text: "What is the dependent variable?", marks: 1 }
            ]
        },
        writing: { instructions: `Design a new experiment to test how the AMOUNT of water affects dissolving rate for experiment ${i+1}.` }
    });
}

const mockExamsObj = {
    english: engExams,
    math: mathExams,
    science: sciExams
};

const newMbContent = `export const MOCK_EXAM_BANK: Record<string, any[]> = ${JSON.stringify(mockExamsObj, null, 2)};\n`;
fs.writeFileSync(mbPath, newMbContent);
console.log("Added 300 Mock Exams successfully!");
