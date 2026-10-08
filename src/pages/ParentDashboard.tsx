import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, collection, query, where, getDocs, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2, Clock, TrendingUp, AlertTriangle, Link as LinkIcon, BookOpen, PenTool } from 'lucide-react';

export default function ParentDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  
  const [linking, setLinking] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [linkError, setLinkError] = useState('');

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<{uid: string, name: string}[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const [timeframe, setTimeframe] = useState<'today' | 'week'>('today');
  
  // Dashboard Metrics
  const [sessions, setSessions] = useState<any[]>([]);
  
  useEffect(() => {
    fetchLinkedStudents();
  }, [profile]);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentData(selectedStudentId, timeframe);
    }
  }, [selectedStudentId, timeframe]);

  const fetchLinkedStudents = async () => {
    if (!profile?.linkedStudents || profile.linkedStudents.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      const studentData = [];
      for (const uid of profile.linkedStudents) {
        // Fetch basic info, normally you'd want a safer way if privacy is strict
        studentData.push({ uid, name: 'Student ' + uid.substring(0, 4) }); 
        // Note: For a real app we might store student name in a public profile or subcollection
      }
      setStudents(studentData);
      if (!selectedStudentId && studentData.length > 0) {
        setSelectedStudentId(studentData[0].uid);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async (studentUid: string, time: 'today' | 'week') => {
    try {
      setLoading(true);
      
      const now = new Date();
      let startDate = new Date();
      if (time === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else {
        // Last 7 days
        startDate.setDate(now.getDate() - 7);
      }
      
      const q = query(
        collection(db, 'users', studentUid, 'sessions'),
        where('timestamp', '>=', Timestamp.fromDate(startDate))
      );
      
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkStudent = async () => {
    if (!user || !linkCode) return;
    setLinking(true);
    setLinkError('');
    try {
      // Find the user with this linking code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('linkingCode', '==', linkCode.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setLinkError('Invalid linking code. Please check the student dashboard.');
        setLinking(false);
        return;
      }
      
      const studentDoc = snap.docs[0];
      const studentUid = studentDoc.id;
      
      // Update parent document
      await updateDoc(doc(db, 'users', user.uid), {
        linkedStudents: arrayUnion(studentUid)
      });
      
      // Update student document (optional but good for tracking)
      await updateDoc(doc(db, 'users', studentUid), {
        linkedParents: arrayUnion(user.uid)
      });
      
      await refreshProfile();
      setLinkCode('');
    } catch (e) {
      console.error(e);
      setLinkError('An error occurred while linking.');
    } finally {
      setLinking(false);
    }
  };

  // Compute Metrics
  let totalSeconds = 0;
  let mcqCount = 0;
  let writtenCount = 0;
  let weakTopics: Record<string, { attempts: number, correct: number }> = {};

  sessions.forEach(s => {
    totalSeconds += (s.durationSeconds || 0);
    
    if (s.type === 'Practice') {
      mcqCount += (s.total || 0);
    } else {
      writtenCount += (s.total || 0); // treating each sub-question/mark as a count, or just 1 task
    }

    // Naive topic tracking for weekly report
    if (s.topics) {
      s.topics.forEach((t: string) => {
        if (!weakTopics[t]) weakTopics[t] = { attempts: 0, correct: 0 };
        weakTopics[t].attempts += (s.total || 1);
        weakTopics[t].correct += (s.score || 0);
      });
    }
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  // Weekly Report Generation
  let actionableAdvice = "Your child has been doing great! Keep encouraging them to maintain their daily practice streak.";
  if (sessions.length === 0) {
    actionableAdvice = `Your child hasn't completed any practice sessions ${timeframe === 'today' ? 'today' : 'this week'}. Encourage them to log in and do a quick 10-minute session!`;
  } else {
    // Find the weakest topic
    let lowestScore = 1;
    let weakestTopic = '';
    
    Object.entries(weakTopics).forEach(([topic, stats]) => {
      const percentage = stats.correct / stats.attempts;
      if (stats.attempts > 5 && percentage < lowestScore) { // only count if they've attempted a bit
        lowestScore = percentage;
        weakestTopic = topic;
      }
    });

    if (weakestTopic && lowestScore < 0.6) {
      actionableAdvice = `We noticed some struggles with "${weakestTopic}" (scoring around ${Math.round(lowestScore * 100)}%). Suggest that they select this specific topic for their next Multiple Choice practice session to build confidence.`;
    } else if (mcqCount > 0 && writtenCount === 0) {
      actionableAdvice = "Great job on the multiple choice questions! To prepare fully for the exam, encourage them to try a 'Written Task' or 'Structured Paper' this week.";
    }
  }

  if (loading && !profile) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;
  }

  if (!profile?.linkedStudents || profile.linkedStudents.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ background: 'var(--primary-light)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <LinkIcon size={40} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Link a Student</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            To view practice metrics and weekly reports, you need to link your account to your child's student account. 
            Ask your child to find their 6-character linking code on their dashboard.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            {linkError && <div style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>{linkError}</div>}
            <input 
              type="text" 
              placeholder="Enter 6-character code (e.g. A1B2C3)"
              value={linkCode}
              onChange={e => setLinkCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ padding: '1rem', borderRadius: '1rem', border: '2px solid var(--border)', fontSize: '1.25rem', textAlign: 'center', letterSpacing: '4px', outline: 'none' }}
            />
            <button 
              onClick={handleLinkStudent}
              disabled={linking || linkCode.length < 5}
              className="btn btn-primary"
              style={{ padding: '1rem', fontSize: '1.1rem' }}
            >
              {linking ? <Loader2 className="animate-spin" /> : 'Connect Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Parent Dashboard
            {students.length > 1 && (
              <select 
                value={selectedStudentId || ''} 
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{ fontSize: '1rem', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                {students.map(s => (
                  <option key={s.uid} value={s.uid}>{s.name}</option>
                ))}
              </select>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Monitoring progress and identifying growth opportunities.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setTimeframe('today')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: timeframe === 'today' ? 'var(--primary)' : 'transparent', color: timeframe === 'today' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeframe('week')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: timeframe === 'week' ? 'var(--primary)' : 'transparent', color: timeframe === 'week' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            This Week
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '1.25rem', borderRadius: '1rem' }}>
            <Clock size={36} />
          </div>
          <div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: 1 }}>
              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Time Spent {timeframe === 'today' ? 'Today' : 'This Week'}</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '1.25rem', borderRadius: '1rem' }}>
            <BookOpen size={36} />
          </div>
          <div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: 1 }}>{mcqCount}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Multiple Choice Qs</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '1.25rem', borderRadius: '1rem' }}>
            <PenTool size={36} />
          </div>
          <div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: 1 }}>{writtenCount}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Written Tasks</p>
          </div>
        </div>
      </div>

      {/* AI Weekly Report Section */}
      <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'scale(2)' }}>
          <TrendingUp size={200} />
        </div>
        
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle color="var(--primary)" /> 
          {timeframe === 'week' ? 'Weekly Insights & Advice' : 'Daily Insights'}
        </h2>
        
        <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
          {actionableAdvice}
        </p>

        {sessions.length > 0 && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Activity Breakdown</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{s.subject}</span> {s.type} 
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({Math.round((s.score/s.total)*100)}%)</span>
                </div>
              ))}
              {sessions.length > 5 && (
                <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>+ {sessions.length - 5} more</div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
