import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
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

async function checkData() {
  const q = query(collection(db, 'questions'));
  const snap = await getDocs(q);
  
  snap.forEach(doc => {
    const data = doc.data();
    if (!data.options || !Array.isArray(data.options)) {
      console.log('Bad options for question:', doc.id);
    }
    if (!data.question) {
      console.log('Missing question text for:', doc.id);
    }
    if (typeof data.correctIndex !== 'number') {
      console.log('Missing correctIndex for:', doc.id);
    }
  });
  console.log(`Checked ${snap.size} questions.`);
}

checkData().catch(console.error);
