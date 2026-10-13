import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
export default function Auth() {
  const {
    user,
    profile,
    loading,
    error: profileError,
    completeProfile,
    logout,
  } = useAuth();
  const [signup, setSignup] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function action(fn: () => Promise<unknown>) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      const code = (e as { code?: string }).code;
      setMessage(
        code === "auth/account-exists-with-different-credential"
          ? "This email already uses another sign-in method. Sign in with that method first; do not create a second account."
          : code === "auth/invalid-credential"
            ? "The email or password is incorrect."
            : code === "auth/unauthorized-domain"
              ? location.hostname === "127.0.0.1"
                ? "Google sign-in is not allowed from 127.0.0.1 in this Firebase project. Open http://localhost:5173/ to test locally."
                : "Google sign-in is not allowed from this address. The site owner must add this domain in Firebase Authentication settings."
              : code === "auth/popup-blocked"
                ? "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again."
            : e instanceof Error
              ? e.message
              : "Sign-in failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <main className="auth-card">
        <p role="status">Loading your saved account…</p>
      </main>
    );
  if (profile)
    return (
      <Navigate
        to={profile.role === "parent" ? "/parent/dashboard" : "/"}
        replace
      />
    );
  return (
    <main className="auth-card">
      <div className="eyebrow">CHECKPOINT PREP</div>
      <h1>
        {user
          ? "Finish setting up your account"
          : signup
            ? "Start your learning journey"
            : "Welcome back"}
      </h1>
      <p className="muted">
        Original practice for Cambridge Primary Checkpoint. Your role and
        progress belong to your account, not your browser.
      </p>
      {(message || profileError) && (
        <p role="alert" className="notice">
          {message || profileError}
        </p>
      )}
      {user ? (
        <>
          <p>Signed in as {user.email}. This account has no saved role yet.</p>
          {!profileError && (
            <div className="button-row">
              <button
                disabled={busy}
                onClick={() => action(() => completeProfile("student"))}
              >
                I am a student
              </button>
              <button
                disabled={busy}
                onClick={() => action(() => completeProfile("parent"))}
              >
                I am a parent
              </button>
            </div>
          )}
          <button className="secondary" onClick={() => action(logout)}>
            Use another account
          </button>
        </>
      ) : (
        <>
          <button
            disabled={busy}
            onClick={() => action(() => signInWithPopup(auth, googleProvider))}
          >
            Continue with Google
          </button>
          <p className="muted">
            Use the same email and sign-in method you used on your other
            browser.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void action(() =>
                signup
                  ? createUserWithEmailAndPassword(auth, email.trim(), password)
                  : signInWithEmailAndPassword(auth, email.trim(), password),
              );
            }}
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button disabled={busy} type="submit">
              {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
            </button>
          </form>
          <div className="button-row">
            <button className="secondary" onClick={() => setSignup(!signup)}>
              {signup ? "Already have an account?" : "Create an account"}
            </button>
            <button
              className="secondary"
              disabled={!email || busy}
              onClick={() =>
                action(async () => {
                  await sendPasswordResetEmail(auth, email.trim());
                  setMessage(
                    "If this email is registered, check its inbox for recovery instructions.",
                  );
                })
              }
            >
              Reset password
            </button>
          </div>
        </>
      )}
    </main>
  );
}
