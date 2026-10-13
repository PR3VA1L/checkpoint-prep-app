import { Component, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Practice = lazy(() => import("./pages/Practice"));
const Parent = lazy(() => import("./pages/ParentDashboard"));
const History = lazy(() => import("./pages/History"));
const Contact = lazy(() => import("./pages/ContactUs"));
function Protected({
  children,
  role,
}: {
  children: ReactNode;
  role: "student" | "parent";
}) {
  const { user, profile, loading, error } = useAuth();
  if (loading)
    return (
      <p className="loading" role="status">
        Loading your account…
      </p>
    );
  if (error)
    return (
      <section className="auth-card">
        <h1>Account unavailable</h1>
        <p role="alert">{error}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </section>
    );
  if (!user || !profile) return <Navigate to="/auth" replace />;
  if (profile.role !== role)
    return (
      <Navigate
        to={profile.role === "parent" ? "/parent/dashboard" : "/"}
        replace
      />
    );
  return children;
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="auth-card">
        <h1>Something went wrong</h1>
        <p>
          Your locally saved draft has not been deleted. Reload to resume it.
        </p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <Boundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <p className="loading" role="status">
                Loading…
              </p>
            }
          >
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={
                    <Protected role="student">
                      <Dashboard />
                    </Protected>
                  }
                />
                <Route
                  path="/practice/mcq/:subject"
                  element={
                    <Protected role="student">
                      <Practice />
                    </Protected>
                  }
                />
                <Route
                  path="/practice/structured/:subject"
                  element={
                    <Protected role="student">
                      <Practice mode="structured" />
                    </Protected>
                  }
                />
                <Route
                  path="/practice/written/:subject"
                  element={
                    <Protected role="student">
                      <Practice mode="structured" />
                    </Protected>
                  }
                />
                <Route
                  path="/practice/exam/:subject"
                  element={
                    <Protected role="student">
                      <Practice mode="structured" />
                    </Protected>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <Protected role="student">
                      <History />
                    </Protected>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Protected role="student">
                      <Contact />
                    </Protected>
                  }
                />
                <Route
                  path="/parent/dashboard"
                  element={
                    <Protected role="parent">
                      <Parent />
                    </Protected>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Boundary>
  );
}
