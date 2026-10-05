import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, PenTool, Home, Award } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/practice/mcq', label: 'MCQ Practice', icon: BookOpen },
    { path: '/practice/written', label: 'Written Tasks', icon: PenTool },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{ width: '250px', padding: '2rem 1rem' }} className="glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Award size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }} className="text-gradient">Checkpoint Prep</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
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

        <div style={{ marginTop: 'auto', paddingTop: '4rem', padding: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Streak</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
              <span style={{ fontSize: '1.5rem' }}>🔥</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>3 Days</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
