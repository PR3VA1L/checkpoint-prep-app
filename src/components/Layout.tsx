import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, PenTool, Home, Award, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FloatingCalculator from './FloatingCalculator';

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentSubject = location.pathname.split('/')[3] || 'english';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: `/practice/mcq/${currentSubject}`, match: '/practice/mcq', label: 'MCQ Practice', icon: BookOpen },
    { path: `/practice/written/${currentSubject}`, match: '/practice/written', label: 'Written Tasks', icon: PenTool },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{ width: '250px', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }} className="glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Award size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }} className="text-gradient">Checkpoint Prep</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.match && location.pathname.startsWith(item.match));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '1rem',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 14px 0 rgba(99, 102, 241, 0.39)' : 'none'
                }}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          {user && (
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Signed in as</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email || 'Student'}
              </p>
            </div>
          )}
          <button 
            onClick={logout}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.75rem',
              border: '1px solid var(--border)', background: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Conditionally render calculator for math and science */}
      {(location.pathname.includes('/math') || location.pathname.includes('/science')) && (
        <FloatingCalculator />
      )}
    </div>
  );
}
