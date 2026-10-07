import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Loader2, History as HistoryIcon, Target, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'sessions'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessions(data);
      } catch (e) {
        console.error("Failed to fetch history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <HistoryIcon size={40} color="var(--primary)" /> Practice History
      </h1>

      {sessions.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            You haven't completed any practice sessions or mock exams yet.
          </p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map((session, i) => {
            const date = session.timestamp?.toDate ? session.timestamp.toDate() : new Date();
            const scorePercentage = Math.round((session.score / session.total) * 100) || 0;
            
            return (
              <div key={session.id} className="glass-card animate-slide-up" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${i * 0.1}s` }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'capitalize',
                      background: session.subject === 'math' ? 'rgba(59, 130, 246, 0.1)' : session.subject === 'science' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: session.subject === 'math' ? '#3b82f6' : session.subject === 'science' ? '#10b981' : '#f59e0b'
                    }}>
                      {session.subject}
                    </span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{session.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={16} /> {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Target size={16} /> {session.topics?.join(', ')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: scorePercentage >= 80 ? 'var(--success)' : scorePercentage >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                      {scorePercentage}%
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {session.score} / {session.total} correct
                    </div>
                  </div>
                  {scorePercentage >= 80 && <Award size={32} color="var(--success)" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
