import { gradeSubmission } from './src/lib/gemini.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  console.log("Testing gradeSubmission...");
  try {
    const feedback = await gradeSubmission(
      "Write a short story about a mysterious map.",
      "One day I found a map in a book. It was very mysterious. I followed the map and found a treasure chest. Inside the chest was a lot of gold.",
      "Writing"
    );
    console.log(JSON.stringify(feedback, null, 2));
  } catch (err) {
    console.error("gradeSubmission failed:", err);
  }
}

run();
