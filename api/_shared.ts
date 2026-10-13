import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { VercelRequest } from "@vercel/node";
export function services() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!raw) throw new Error("Server authentication is not configured.");
    initializeApp({ credential: cert(JSON.parse(raw)) });
  }
  return { auth: getAuth(), db: getFirestore() };
}
export async function authenticate(req: VercelRequest) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) throw new Error("Unauthorized");
  return services().auth.verifyIdToken(h.slice(7), true);
}
export async function rateLimit(uid: string, scope: string, max: number) {
  const db = services().db,
    ref = db.doc(
      `rate_limits/${scope}-${uid}-${new Date().toISOString().slice(0, 10)}`,
    );
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref),
      count = snap.data()?.count || 0;
    if (count >= max)
      throw new Error(
        "Daily request limit reached. Please try again tomorrow.",
      );
    tx.set(ref, {
      count: count + 1,
      expiresAt: Timestamp.fromMillis(Date.now() + 172800000),
    });
  });
}
