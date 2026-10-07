import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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

const SUBJECTS = [
  { name: 'English', topics: ['Grammar', 'Vocabulary in Context', 'Literary Devices', 'Punctuation'] },
  { name: 'Math', topics: ['Fractions', 'Decimals', 'Percentages', 'Geometry', 'Algebra', 'Measure'] },
  { name: 'Science', topics: ['Biology', 'Physics', 'Chemistry', 'Earth & Space'] }
];

const BATCH_SIZE = 10;
const TARGET_PER_SUBJECT = 500;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function massGenerate() {
  console.log("Starting massive generation script...");
  const qRef = collection(db, 'questions');

  for (const subject of SUBJECTS) {
    console.log(`\n=== Starting Generation for ${subject.name} ===`);
    let generatedCount = 0;

    while (generatedCount < TARGET_PER_SUBJECT) {
      // Pick a random topic and difficulty for variety
      const randomTopic = subject.topics[Math.floor(Math.random() * subject.topics.length)];
      const difficulties = ['Easy', 'Medium', 'Hard'];
      const randomDiff = difficulties[Math.floor(Math.random() * difficulties.length)];

      console.log(`Requesting ${BATCH_SIZE} ${randomDiff} questions for ${subject.name} -> ${randomTopic}...`);
      
      try {
        const generatedQuestions = await generateMCQQuestions(subject.name, [randomTopic], randomDiff, BATCH_SIZE);
        
        if (!generatedQuestions || generatedQuestions.length === 0) {
           console.log("No questions returned. Retrying after 5 seconds...");
           await sleep(5000);
           continue;
        }

        let successCount = 0;
        for (const q of generatedQuestions) {
          try {
            await addDoc(qRef, q);
            successCount++;
          } catch (err) {
            console.error("Failed to add to Firestore:", err);
          }
        }
        
        generatedCount += successCount;
        console.log(`Successfully added ${successCount} questions. Total for ${subject.name}: ${generatedCount}/${TARGET_PER_SUBJECT}`);
        
        // Sleep to avoid rate limiting
        await sleep(3000);

      } catch (err) {
        console.error("Gemini API call failed (possibly rate limit). Sleeping for 30s...", err.message);
        await sleep(30000); // Backoff for 30 seconds if we hit a rate limit
      }
    }
    console.log(`Finished generating ${TARGET_PER_SUBJECT} questions for ${subject.name}!`);
  }
  
  console.log("Mass generation complete!");
}

massGenerate().catch(console.error);
