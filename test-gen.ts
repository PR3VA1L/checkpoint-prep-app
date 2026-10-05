import { generateMCQQuestions } from './src/lib/gemini.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  console.log("Generating questions...");
  const qList = await generateMCQQuestions(["Grammar"], "Medium", 2);
  console.log(JSON.stringify(qList, null, 2));
}

run().catch(console.error);
