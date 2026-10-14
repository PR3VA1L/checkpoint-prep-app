import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Attempt } from "../src/learning/types";
import { authenticate, rateLimit, services } from "./_shared.js";
import { prepareMarking, applyMarks } from "./_grading.js";
import { markWithModel, modelConfigured } from "./_modelMark.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST required" });
  try {
    const { uid } = await authenticate(req);
    const attemptId = req.body?.attemptId;
    if (typeof attemptId !== "string" || !/^[0-9a-f-]{36}$/i.test(attemptId))
      return res.status(400).json({ error: "Invalid attempt ID" });
    const ref = services().db.doc(`users/${uid}/sessions/${attemptId}`);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: "Attempt not found" });
    const attempt = snapshot.data() as Attempt;
    if (attempt.id !== attemptId || attempt.mode !== "structured" || attempt.status !== "completed")
      return res.status(400).json({ error: "Submit a structured paper before marking it." });
    if (attempt.grading === "ai-assisted" || (attempt.grading === "automatic" && attempt.markingVersion))
      return res.json({ attempt, pending: 0, modelAvailable: modelConfigured() });
    if (attempt.grading === "self-assessed" || Object.values(attempt.answers || {}).some((a) => a.markingMethod === "manual"))
      return res.status(409).json({ error: "This paper already has manually reviewed marks." });
    await rateLimit(uid, "mark", 30);
    const { results, jobs } = prepareMarking(attempt);
    let modelUnavailable = false;
    if (jobs.length && modelConfigured()) {
      try {
        Object.assign(results, await markWithModel(jobs));
      } catch (error) {
        console.warn("Marking provider failed:", error instanceof Error ? error.message : "Unknown provider error");
        modelUnavailable = true;
      }
    }
    const graded = applyMarks(attempt, results);
    await services().db.runTransaction(async (tx) => {
      const latest = await tx.get(ref);
      if (!latest.exists || latest.data()?.updatedAt !== attempt.updatedAt || latest.data()?.status !== "completed")
        throw new Error("This answer changed during marking. Reopen the latest saved attempt and retry.");
      tx.update(ref, {
        answers: graded.answers,
        score: graded.score,
        total: graded.total,
        questions: graded.questions,
        grading: graded.grading,
        updatedAt: graded.updatedAt,
        markingVersion: graded.markingVersion,
      });
    });
    return res.json({
      attempt: graded,
      pending: Object.values(results).filter((r) => r.method === "pending").length,
      modelAvailable: modelConfigured(),
      modelUnavailable,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Marking is unavailable";
    const status = message === "Unauthorized" ? 401 : /changed during marking/.test(message) ? 409 : 400;
    return res.status(status).json({ error: message });
  }
}
