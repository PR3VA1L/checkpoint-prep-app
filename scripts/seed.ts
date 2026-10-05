import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load the .env.local file
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

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

const seedData = [
  {
    topic: 'Punctuation',
    difficulty: 'Medium',
    question: 'Read the sentence below. Where should a comma be placed to ensure it is grammatically correct?\n\n"Although the wind was howling loudly the brave explorers continued their journey up the mountain."',
    options: [
      'After "howling"',
      'After "loudly"',
      'After "explorers"',
      'After "journey"'
    ],
    correctIndex: 1,
    explanation: 'A comma is needed after "loudly" to separate the introductory dependent clause ("Although the wind was howling loudly") from the main independent clause.',
    cambridgeStrand: 'Use of English'
  },
  {
    topic: 'Vocabulary in Context',
    difficulty: 'Hard',
    question: 'Read this extract from a story: "The old mansion stood decrepit on the hill, its windows shattered and its paint peeling like sunburned skin."\n\nWhat does the word "decrepit" suggest about the mansion?',
    options: [
      'It is haunted and frightening.',
      'It is ancient but well-maintained.',
      'It is ruined, broken down, and neglected.',
      'It is large, imposing, and expensive.'
    ],
    correctIndex: 2,
    explanation: '"Decrepit" means ruined because of age or neglect. The context clues ("windows shattered", "paint peeling") confirm that the house is falling apart.',
    cambridgeStrand: 'Reading - Explicit/Implicit Meaning'
  },
  {
    topic: 'Purpose and Audience',
    difficulty: 'Easy',
    question: 'You are reading an article titled "Top 10 Ways to Save the Rainforests Before It Is Too Late."\n\nWhat is the primary purpose of this text?',
    options: [
      'To entertain the reader with an exciting story about a jungle.',
      'To persuade the reader to take action to protect the environment.',
      'To explain the scientific process of photosynthesis in trees.',
      'To describe the different animals that live in the rainforest.'
    ],
    correctIndex: 1,
    explanation: 'The phrase "Top 10 Ways" and "Before It Is Too Late" indicates the text wants to convince or persuade the reader to act.',
    cambridgeStrand: 'Reading - Purpose'
  }
];

async function seed() {
  console.log('🌱 Starting database seed process...');
  const questionsCol = collection(db, 'questions');

  // Check if we already seeded to prevent duplicates
  const existingDocs = await getDocs(questionsCol);
  if (!existingDocs.empty) {
    console.log(`⚠️  Found ${existingDocs.size} existing questions. Skipping seed to prevent duplicates.`);
    return;
  }

  let count = 0;
  for (const q of seedData) {
    try {
      await addDoc(questionsCol, q);
      count++;
    } catch (e) {
      console.error('Error adding document:', e);
    }
  }

  console.log(`✅ Successfully seeded ${count} Cambridge Checkpoint questions into Firestore!`);
  process.exit(0);
}

seed();
