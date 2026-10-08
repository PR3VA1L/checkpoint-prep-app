import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Target, Trophy, Star, BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProgress } from '../lib/srs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [generatingCode, setGeneratingCode] = useState(false);
  
  const [stats, setStats] = useState({
    reviewed: 0,
    mastered: 0,
    due: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('english');

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
        
        // Mock chart data (in reality, query historical snapshots)
        const mockData = [];
        const date = new Date();
        date.setDate(date.getDate() - 7);
        for(let i=0; i<7; i++) {
          mockData.push({
            name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
            score: Math.floor(Math.random() * 40) + 60
          });
          date.setDate(date.getDate() + 1);
        }
        setChartData(mockData);

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

  const generateLinkCode = async () => {
    if (!user) return;
    setGeneratingCode(true);
    try {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await setDoc(doc(db, 'users', user.uid), {
        linkingCode: newCode
      }, { merge: true });
      await refreshProfile();
    } catch (e: any) {
      console.error(e);
      alert("Failed to generate code. Error: " + e.message);
    } finally {
      setGeneratingCode(false);
    }
  };

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
          <div style={{ flex: 1 }}>
            {(() => {
              const m = stats.mastered;
              let level = 1;
              let title = "Beginner";
              let max = 5;
              if (m >= 100) { level = 5; title = "Master"; max = m; }
              else if (m >= 50) { level = 4; title = "Expert"; max = 100; }
              else if (m >= 20) { level = 3; title = "Proficient"; max = 50; }
              else if (m >= 5) { level = 2; title = "Learner"; max = 20; }

              const progress = level === 5 ? 100 : (m / max) * 100;
              
              return (
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: 1 }}>
                      Level {level}: <span style={{ color: 'var(--success)' }}>{title}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{ color: star <= level ? '#eab308' : 'rgba(0,0,0,0.1)', fontSize: '1.1rem' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '1rem', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--success)', borderRadius: '1rem', transition: 'width 0.5s' }} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {m} / {level === 5 ? '∞' : max} concepts mastered
                  </p>
                </div>
              );
            })()}
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

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={18} color="var(--primary)" /> Parent Linking
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Allow your parents to track your progress by giving them this code.
        </p>
        {profile?.linkingCode ? (
          <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.75rem', border: '1px dashed var(--border)', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '2px' }}>
            {profile.linkingCode}
          </div>
        ) : (
          <button 
            onClick={generateLinkCode}
            disabled={generatingCode}
            className="btn"
            style={{ width: '100%', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem' }}
          >
            {generatingCode ? 'Generating...' : 'Generate Code'}
          </button>
        )}
      </div>

      {/* Subject Selector */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {['english', 'math', 'science'].map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            style={{
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              background: selectedSubject === subject ? 'var(--primary)' : 'var(--surface)',
              color: selectedSubject === subject ? 'white' : 'var(--text-main)',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              boxShadow: selectedSubject === subject ? '0 4px 6px -1px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Adaptive Daily Study Plan Banner */}
      <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', border: '2px solid var(--primary)' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles color="var(--primary)" /> Your Daily Adaptive Plan
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
            We've built a custom 15-question practice session targeting exactly what you need to review today across {selectedSubject}.
          </p>
        </div>
        <Link to={`/practice/mcq/${selectedSubject}?plan=daily`} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlayCircle /> Start Daily Plan
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Performance Trend (Last 7 Days)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem' }} />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Start Actions */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textTransform: 'capitalize' }}>{selectedSubject} Practice</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="animate-float" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <PlayCircle size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Multiple Choice</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Unlimited focused practice customized to your level.
            </p>
            <Link to={`/practice/mcq/${selectedSubject}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
              Start Practice
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="animate-float" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', animationDelay: '1s' }}>
              <Star size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{selectedSubject === 'english' ? 'Written Tasks & OCR' : 'Structured Questions & OCR'}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {selectedSubject === 'english' ? 'Write or upload handwritten tasks, graded instantly by AI.' : 'Solve problems or upload working, graded instantly by AI.'}
            </p>
            <Link to={`/practice/written/${selectedSubject}`} className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
              {selectedSubject === 'english' ? 'Start Writing' : 'Start Paper'}
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '2px solid var(--accent)' }}>
            <div className="animate-float" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1rem', animationDelay: '2s' }}>
              <Sparkles size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Full Exam Simulator</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Full Paper 1 and Paper 2 mock exams timed under test conditions.
            </p>
            <Link to={`/practice/exam/${selectedSubject}`} className="btn" style={{ background: 'var(--accent)', color: 'white', width: '100%', textDecoration: 'none' }}>
              Start Exam
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
