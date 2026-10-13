import { auth } from "./firebase";
export async function accountAction(body: Record<string, string>) {
  if (!auth.currentUser) throw new Error("Please sign in.");
  const response = await fetch("/api/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
    },
    body: JSON.stringify(body),
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(
      "The account server is unavailable. A Vercel/API deployment is required; local Vite alone cannot link accounts.",
    );
  }
  if (!response.ok) throw new Error(result.error || "Account request failed");
  return result;
}
