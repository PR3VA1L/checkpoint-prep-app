import { auth } from "./firebase";
import type { Attempt } from "../learning/types";

export interface MarkingResponse {
  attempt: Attempt;
  pending: number;
  modelAvailable: boolean;
  modelUnavailable?: boolean;
}

export async function requestAutomaticMark(attemptId: string): Promise<MarkingResponse> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in before marking your paper.");
  const response = await fetch("/api/mark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ attemptId }),
  });
  let result: Partial<MarkingResponse> & { error?: string };
  try {
    result = await response.json();
  } catch {
    throw new Error("Automatic marking requires the deployed account/API server. Your answers remain saved.");
  }
  if (!response.ok || !result.attempt)
    throw new Error(result.error || "Automatic marking is unavailable. Your answers remain saved.");
  return result as MarkingResponse;
}
