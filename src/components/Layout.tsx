import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  ListChecks,
  History,
  Menu,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
export default function Layout() {
  const { profile, user, logout } = useAuth(),
    location = useLocation();
  const [openPath, setOpenPath] = useState<string|null>(null),
    [theme, setTheme] = useState(
      () => {try{return localStorage.getItem("theme") || "light";}catch{return "light";}},
    );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try{localStorage.setItem("theme", theme);}catch{/* Theme still applies if storage is blocked. */}
  }, [theme]);
  const open=openPath===location.pathname;
  const parent = profile?.role === "parent";
  const subject =
    location.pathname.match(/\/(english|math|science)(?:\/|$)/)?.[1] ||
    "english";
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="mobile-header">
        <span>Checkpoint Prep</span>
        <button
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpenPath(open?null:location.pathname)}
        >
          <Menu size={20} />
        </button>
      </header>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <NavLink className="brand" to={parent ? "/parent/dashboard" : "/"}>
          <div className="brand-icon">
            <BookOpen size={23} />
          </div>
          <span>
            Checkpoint
            <br />
            <small>PREP</small>
          </span>
        </NavLink>
        <div className="eyebrow">
          {parent ? "FAMILY SPACE" : "LEARNING SPACE"}
        </div>
        <nav aria-label="Main navigation" onClick={()=>setOpenPath(null)}>
          {parent ? (
            <NavLink to="/parent/dashboard">
              <LayoutDashboard size={19} />
              Parent dashboard
            </NavLink>
          ) : (
            <>
              <NavLink to="/" end>
                <LayoutDashboard size={19} />
                Overview
              </NavLink>
              <NavLink to={`/practice/mcq/${subject}`}>
                <BookOpen size={19} />
                Quick practice
              </NavLink>
              <NavLink to={`/practice/structured/${subject}`}>
                <ListChecks size={19} />
                Structured questions
              </NavLink>
              <NavLink to="/history">
                <History size={19} />
                My activity
              </NavLink>
              <NavLink to="/contact">Report a problem</NavLink>
            </>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="account-label">
            <strong>
              {profile?.displayName || user?.displayName || "Your account"}
            </strong>
            <small>{user?.email}</small>
            <span className="badge">
              {parent ? "Parent" : "Student"} account
            </span>
          </div>
          <button
            className="secondary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}{" "}
            {theme === "dark" ? "Light" : "Dark"} mode
          </button>
          <button className="secondary" onClick={() => void logout()}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <main id="main" className="main-content">
        <Outlet />
        <footer>
          Original practice, not an official Cambridge assessment. Progress
          reflects practice, not a certified grade.
        </footer>
      </main>
    </div>
  );
}
