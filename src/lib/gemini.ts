import { auth } from "./firebase";
// Core practice deliberately uses authored explanations, never unbounded AI text.
export async function extractHandwritingOCR(image: string): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sign in before requesting transcription.");
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operation: "transcribe", image }),
  });
  let result: { text?: string; error?: string };
  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Transcription is unavailable. You can still type and save your answer.",
    );
  }
  if (!response.ok || typeof result.text !== "string")
    throw new Error(
      result.error || "Transcription failed. Your typed answer is unchanged.",
    );
  return result.text;
}
