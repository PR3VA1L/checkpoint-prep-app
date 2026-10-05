import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Target, Trophy, Star, BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProgress } from '../lib/srs';

export default function Dashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    reviewed: 0,
    mastered: 0,
    due: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'user_progress'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        let reviewedCount = 0;
        let masteredCount = 0;
        let dueCount = 0;
        const now = Timestamp.now();

        snapshot.forEach((doc) => {
          const data = doc.data() as UserProgress;
          reviewedCount++;
          if (data.consecutiveCorrect >= 3) {
            masteredCount++;
          }
          if (data.nextReviewDate && data.nextReviewDate.toMillis() <= now.toMillis()) {
            dueCount++;
          }
        });

        setStats({
          reviewed: reviewedCount,
          mastered: masteredCount,
          due: dueCount
        });
      } catch (error) {
        console.error("Failed to fetch user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      <header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Welcome back, <span className="text-gradient">{user?.displayName?.split(' ')[0] || 'Student'}!</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          {stats.due > 0 
            ? `You have ${stats.due} questions waiting for your daily review.`
            : "You're all caught up for today! Keep up the momentum."}
        </p>
      </header>

      {/* SRS Mastery Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', padding: '1rem', borderRadius: '1rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={32} />}
          </div>
          <div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{loading ? '-' : stats.reviewed}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Questions Practiced</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '1rem', borderRadius: '1rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : <Trophy size={32} />}
          </div>
          <div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{loading ? '-' : stats.mastered}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Concepts Mastered</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: stats.due > 0 ? '2px solid var(--accent)' : 'none' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent)', padding: '1rem', borderRadius: '1rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : <Target size={32} />}
          </div>
          <div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{loading ? '-' : stats.due}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Due for Review</p>
          </div>
        </div>
      </div>

      {/* Quick Start Actions */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Jump Back In</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="animate-float" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <PlayCircle size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Multiple Choice</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Unlimited focused practice on grammar, vocabulary, and more.
            </p>
            <Link to="/practice/mcq" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
              Start Practice
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="animate-float" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', animationDelay: '1s' }}>
              <Star size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Written Tasks & OCR</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Write or upload handwritten short stories, graded instantly by AI.
            </p>
            <Link to="/practice/written" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
              Start Writing
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '2px solid var(--accent)' }}>
            <div className="animate-float" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', animationDelay: '2s' }}>
              <Sparkles size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Full Exam Simulator</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              A full timed past-paper combining Comprehension and Writing.
            </p>
            <Link to="/practice/exam" className="btn" style={{ background: 'var(--accent)', color: 'white', width: '100%', textDecoration: 'none' }}>
              Start Exam
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
