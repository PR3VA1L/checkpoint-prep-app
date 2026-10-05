import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { generateMCQQuestions } from './src/lib/gemini.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testEndToEnd() {
  console.log("1. Generating questions via Gemini 3.5...");
  let generatedQuestions = [];
  try {
    generatedQuestions = await generateMCQQuestions(["Grammar"], "Medium", 2);
    console.log(`Generated ${generatedQuestions.length} questions`);
  } catch (err) {
    console.error("Gemini failed:", err);
    return;
  }

  if (generatedQuestions.length === 0) {
    console.log("No questions were generated (empty array)");
    return;
  }

  console.log("2. Saving to Firestore...");
  const qRef = collection(db, 'questions');
  let qList = [];
  
  try {
    for (const q of generatedQuestions) {
      console.log("Adding doc:", q.question);
      const docRef = await addDoc(qRef, q);
      qList.push({ id: docRef.id, ...q });
      console.log("Successfully added doc:", docRef.id);
    }
  } catch (err) {
    console.error("Firestore addDoc failed:", err);
    return;
  }
  
  console.log("Done! qList length:", qList.length);
}

testEndToEnd().catch(console.error);
