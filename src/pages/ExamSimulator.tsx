import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Loader2, Settings } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { MOCK_EXAM_BANK } from '../data/mockExamBank';
import { gradeSubmission } from '../lib/gemini';

export default function ExamSimulator() {
  const { user } = useAuth();
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const activeSubject = (subject || 'english').toLowerCase();
  
  const [selectedPaper, setSelectedPaper] = useState<'Paper 1' | 'Paper 2'>('Paper 1');
  const [selectedSection, setSelectedSection] = useState<'Comprehension' | 'Writing' | 'Both'>('Both'); 
  
  const [examData, setExamData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); 
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [essayText, setEssayText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    // Reset selections on subject change
    setSelectedPaper('Paper 1');
    setSelectedSection('Both');
  }, [activeSubject]);

  const startExam = async () => {
    setIsGenerating(true);
    try {
      const exams = MOCK_EXAM_BANK[activeSubject] || [];
      const paperExams = exams.filter(e => e.paper === selectedPaper);
      
      if (paperExams.length === 0) {
        alert(`Sorry, we don't have enough ${selectedPaper} exams generated for ${activeSubject} right now. Try checking the generation script.`);
        setIsGenerating(false);
        return;
      }
      
      const randomExam = paperExams[Math.floor(Math.random() * paperExams.length)];
      setExamData(randomExam);
      setHasStarted(true);
      
      // Determine time
      if (activeSubject === 'english' && selectedSection !== 'Both') {
          setTimeLeft(1800); // 30 mins for half
      } else {
          setTimeLeft(3600); // 60 mins for full
      }
      
      setAnswers({});
      setEssayText('');
    } catch (err) {
      alert("Failed to load exam.");
    } finally {
      setIsGenerating(false);
    }
  };

  const answersRef = useRef(answers);
  const essayTextRef = useRef(essayText);
  useEffect(() => {
    answersRef.current = answers;
    essayTextRef.current = essayText;
  }, [answers, essayText]);

  const handleSubmit = useCallback(async () => {
    if (!examData) return;
    setIsSubmitting(true);
    try {
      let totalScore = 0;
      let totalMax = 0;
      let finalFeedback: any = { sections: [] };

      if (activeSubject === 'english') {
          if (selectedSection === 'Both' || selectedSection === 'Comprehension') {
              const compPrompt = `Passage: ${examData.comprehension.passage}\\nQuestions: ${JSON.stringify(examData.comprehension.questions)}`;
              const compResult = await gradeSubmission(compPrompt, JSON.stringify(answersRef.current), 'Comprehension');
              finalFeedback.sections.push({ name: 'Comprehension', result: compResult });
              totalScore += compResult.score;
              totalMax += compResult.maxScore;
          }
          if (selectedSection === 'Both' || selectedSection === 'Writing') {
              const writeResult = await gradeSubmission(examData.writing.instructions, essayTextRef.current, 'Writing');
              finalFeedback.sections.push({ name: 'Writing', result: writeResult });
              totalScore += writeResult.score;
              totalMax += writeResult.maxScore;
          }
      } else {
          const structuredPrompt = `Questions: ${JSON.stringify(examData.questions)}`;
          const res = await gradeSubmission(structuredPrompt, JSON.stringify(answersRef.current), 'Structured Paper');
          finalFeedback.sections.push({ name: 'Structured Questions', result: res });
          totalScore += res.score;
          totalMax += res.maxScore;
      }

      finalFeedback.totalScore = totalScore;
      finalFeedback.totalMax = totalMax;
      setFeedback(finalFeedback);

      if (user) {
        const durationSeconds = 3600 - timeLeft;
        const sessionRef = collection(db, 'users', user.uid, 'sessions');
        addDoc(sessionRef, {
          subject: activeSubject,
          type: 'Structured Exam',
          paper: selectedPaper,
          score: totalScore,
          total: totalMax,
          timestamp: Timestamp.now(),
          durationSeconds,
          topics: [selectedPaper]
        }).catch(console.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to grade exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [examData, activeSubject, selectedPaper, selectedSection, user, timeLeft]);

  useEffect(() => {
    let timer: any;
    if (hasStarted && timeLeft > 0 && !feedback && !isSubmitting) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, feedback, isSubmitting, handleSubmit]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!hasStarted) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'capitalize' }}>Structured Exam Simulator</h1>
        
        {/* Subject Selector */}
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '2rem', justifyContent: 'center' }}>
          {['english', 'math', 'science'].map(sub => (
            <button
              key={sub}
              onClick={() => navigate(`/practice/exam/${sub}`)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                background: activeSubject === sub ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                color: activeSubject === sub ? 'white' : 'var(--text-main)',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                boxShadow: activeSubject === sub ? '0 4px 6px -1px rgba(245, 158, 11, 0.4)' : 'none'
              }}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '3rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Settings size={32} />
            <h2 style={{ margin: 0 }}>Configure Paper</h2>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Paper Variant</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setSelectedPaper('Paper 1')} className={`btn ${selectedPaper === 'Paper 1' ? 'btn-primary' : ''}`} style={{ flex: 1 }}>Paper 1</button>
                <button onClick={() => setSelectedPaper('Paper 2')} className={`btn ${selectedPaper === 'Paper 2' ? 'btn-primary' : ''}`} style={{ flex: 1 }}>Paper 2</button>
            </div>
            {activeSubject === 'math' && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {selectedPaper === 'Paper 1' ? 'Calculators are NOT allowed.' : 'Calculators ARE allowed.'}
                </p>
            )}
          </div>

          {activeSubject === 'english' && (
            <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Section</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setSelectedSection('Comprehension')} className={`btn ${selectedSection === 'Comprehension' ? 'btn-primary' : ''}`} style={{ flex: 1 }}>Comprehension Only</button>
                    <button onClick={() => setSelectedSection('Writing')} className={`btn ${selectedSection === 'Writing' ? 'btn-primary' : ''}`} style={{ flex: 1 }}>Writing Only</button>
                    <button onClick={() => setSelectedSection('Both')} className={`btn ${selectedSection === 'Both' ? 'btn-primary' : ''}`} style={{ flex: 1 }}>Full Paper</button>
                </div>
            </div>
          )}

          <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.5)', padding: '1rem 2rem', borderRadius: '1rem' }}>
            <li>You will have <strong>{activeSubject === 'english' && selectedSection !== 'Both' ? '30 Minutes' : '60 Minutes'}</strong> to complete this paper.</li>
            <li>Questions are designed to strictly mimic Cambridge Primary Checkpoint Year 6.</li>
            <li>Do not close or refresh this page during the exam.</li>
          </ul>
          
          <button 
            className="btn" 
            style={{ background: 'var(--accent)', color: 'white', width: '100%', fontSize: '1.25rem' }} 
            onClick={startExam}
            disabled={isGenerating}
          >
            {isGenerating ? <><Loader2 className="animate-spin" style={{ display: 'inline', marginRight: '0.5rem' }} /> Loading Exam...</> : 'Start the Timer & Begin'}
          </button>
        </div>
      </div>
    );
  }

  if (feedback) {
    const percentage = Math.round((feedback.totalScore / feedback.totalMax) * 100) || 0;
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', paddingBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Final Exam Results</h1>
          <div style={{ 
            width: '150px', height: '150px', margin: '0 auto 1.5rem', 
            borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '8px solid var(--accent)'
          }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)' }}>
              {feedback.totalScore}/{feedback.totalMax}
            </span>
          </div>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            You scored {percentage}% on this Mock Exam.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
            Return to Dashboard
          </Link>
        </div>

        {feedback.sections.map((section: any, idx: number) => (
            <div key={idx}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>{section.name}</h2>
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Score: {section.result.score}/{section.result.maxScore}</span>
                  </div>
                  <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>{section.result.summary}</p>
                  {section.result.breakdown.map((b: any, i: number) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: `4px solid var(--${i % 2 === 0 ? 'primary' : 'secondary'})` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{b.criteria}</h4>
                        <span style={{ fontWeight: 'bold' }}>{b.score}/{b.max}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{b.note}</p>
                    </div>
                  ))}
                </div>
            </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '6rem' }}>
      
      <div style={{ 
        position: 'sticky', top: '1rem', zIndex: 100, 
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
        padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid var(--border)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', textTransform: 'capitalize' }}>Cambridge {activeSubject} - {selectedPaper}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 300 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <Clock /> {formatTime(timeLeft)}
          </div>
          <button className="btn" style={{ background: 'var(--accent)', color: 'white' }} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Exam'}
          </button>
        </div>
      </div>

      <div className="responsive-flex">
        
        {/* Left Side: Material */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeSubject === 'english' && (selectedSection === 'Both' || selectedSection === 'Comprehension') && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Reading Comprehension</h3>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{examData?.comprehension?.title}</h2>
                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                  {examData?.comprehension?.passage}
                </div>
              </div>
          )}

          {activeSubject === 'english' && (selectedSection === 'Both' || selectedSection === 'Writing') && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>Writing Task</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{examData?.writing?.instructions}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>[Total marks: {examData?.writing?.totalMarks}]</p>
              </div>
          )}

          {activeSubject !== 'english' && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                 <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>Structured Questions</h3>
                 <p style={{ fontSize: '1.1rem' }}>Read each question carefully and type your structured answer in the provided boxes on the right.</p>
                 {activeSubject === 'math' && selectedPaper === 'Paper 1' && (
                     <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Calculators are NOT allowed.</p>
                 )}
                 {activeSubject === 'math' && selectedPaper === 'Paper 2' && (
                     <p style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Calculators are allowed.</p>
                 )}
              </div>
          )}
        </div>

        {/* Right Side: Answer Sheet */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {((activeSubject === 'english' && (selectedSection === 'Both' || selectedSection === 'Comprehension')) || activeSubject !== 'english') && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Structured Answers</h3>
                {(activeSubject === 'english' ? examData?.comprehension?.questions : examData?.questions)?.map((q: any) => (
                  <div key={q.id} style={{ marginBottom: '2rem' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                      {q.id}. {q.text} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>[{q.marks} mark{q.marks > 1 ? 's' : ''}]</span>
                    </p>
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Type your answer here..."
                      style={{
                        width: '100%', minHeight: '80px', padding: '1rem',
                        borderRadius: '0.5rem', border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.7)', outline: 'none', resize: 'vertical',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                ))}
              </div>
          )}

          {activeSubject === 'english' && (selectedSection === 'Both' || selectedSection === 'Writing') && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Writing Submission</h3>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Begin your writing here..."
                  style={{
                    width: '100%', minHeight: '400px', padding: '1rem',
                    borderRadius: '0.5rem', border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.7)', outline: 'none', resize: 'vertical',
                    lineHeight: '1.6', fontSize: '1.1rem'
                  }}
                />
                <div style={{ textAlign: 'right', marginTop: '1rem', color: 'var(--text-muted)' }}>
                  {essayText.split(/\\s+/).filter(w => w.length > 0).length} words
                </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}
