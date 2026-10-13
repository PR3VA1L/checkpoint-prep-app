import type { VercelRequest, VercelResponse } from "@vercel/node";
// This product is directed at children. A public Gemini API key or parent consent
// does not override the provider's age restrictions. No provider call is made.
// Replace this adapter only after choosing a service/contract permitting this use.
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  return res
    .status(503)
    .json({
      error:
        "AI transcription is not enabled for this child-facing service. Please type your answer; practice, hints and marking guidance work without AI.",
    });
}
