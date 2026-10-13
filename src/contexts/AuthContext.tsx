import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
export interface UserProfile {
  role: "student" | "parent";
  displayName?: string;
  timezone?: string;
  linkedStudents?: string[];
  linkedParents?: string[];
  linkingCode?: string;
}
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeProfile: (role: "student" | "parent") => Promise<void>;
}
const Context = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  error: "",
  logout: async () => {},
  refreshProfile: async () => {},
  completeProfile: async () => {},
});
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [profile, setProfile] = useState<UserProfile | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const identity = useRef<string | null>(null);
  useEffect(() => {
    let stopProfile = () => {};
    const stop = onAuthStateChanged(auth, (u) => {
      stopProfile();
      identity.current = u?.uid || null;
      setUser(u);
      setProfile(null);
      setError("");
      setLoading(!!u);
      if (!u) return;
      stopProfile = onSnapshot(
        doc(db, "users", u.uid),
        (snapshot) => {
          if (identity.current !== u.uid) return;
          const data = snapshot.data();
          if (data && data.role !== "student" && data.role !== "parent") {
            setError(
              "Your account profile has an unsupported role. Please contact support.",
            );
            setProfile(null);
          } else setProfile(data ? (data as UserProfile) : null);
          setLoading(false);
        },
        () => {
          if (identity.current !== u.uid) return;
          setError(
            "Your account profile could not be loaded. Check your connection and reload; no account role has been changed.",
          );
          setLoading(false);
        },
      );
    });
    return () => {
      stopProfile();
      stop();
    };
  }, []);
  async function completeProfile(role: "student" | "parent") {
    if (!auth.currentUser) throw new Error("Please sign in first.");
    const u = auth.currentUser;
    await runTransaction(db, async (tx) => {
      const ref = doc(db, "users", u.uid);
      const snap = await tx.get(ref);
      if (snap.exists()) return;
      tx.set(ref, {
        role,
        displayName:
          (u.displayName || (role === "parent" ? "Parent" : "Student")).slice(0, 100),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    });
  }
  const logout = async () => {
    await signOut(auth);
  };
  return (
    <Context.Provider
      value={{
        user,
        profile,
        loading,
        error,
        logout,
        completeProfile,
        refreshProfile: async () => {},
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
