import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProgress {
  userId: string;
  questionId: string;
  consecutiveCorrect: number;
  easeFactor: number;
  interval: number; // in days
  nextReviewDate: Timestamp;
}

// Basic SuperMemo-2 (SM-2) algorithm implementation
export function calculateNextReview(wasCorrect: boolean, currentProgress?: UserProgress) {
  let { consecutiveCorrect = 0, easeFactor = 2.5, interval = 0 } = currentProgress || {};

  if (wasCorrect) {
    if (consecutiveCorrect === 0) {
      interval = 1;
    } else if (consecutiveCorrect === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    consecutiveCorrect += 1;
    easeFactor = easeFactor + 0.1; // Reward for correct
  } else {
    consecutiveCorrect = 0;
    interval = 0; // Reset to due immediately so it shows up for review today
    easeFactor = Math.max(1.3, easeFactor - 0.2); // Penalize, but never go below 1.3
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    consecutiveCorrect,
    easeFactor,
    interval,
    nextReviewDate: Timestamp.fromDate(nextDate)
  };
}

export async function saveQuestionProgress(userId: string, questionId: string, wasCorrect: boolean) {
  try {
    const progressRef = doc(db, 'user_progress', `${userId}_${questionId}`);
    const progressSnap = await getDoc(progressRef);
    
    let currentProgress;
    if (progressSnap.exists()) {
      currentProgress = progressSnap.data() as UserProgress;
    }

    const newStats = calculateNextReview(wasCorrect, currentProgress);
    
    await setDoc(progressRef, {
      userId,
      questionId,
      ...newStats,
      lastReviewed: Timestamp.now()
    }, { merge: true });

  } catch (error) {
    console.error("Error saving SRS progress:", error);
  }
}

export async function getDueQuestions(userId: string) {
  try {
    const q = query(
      collection(db, 'user_progress'),
      where('userId', '==', userId),
      where('nextReviewDate', '<=', Timestamp.now())
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProgress);
  } catch (error) {
    console.error("Error fetching due questions:", error);
    return [];
  }
}
