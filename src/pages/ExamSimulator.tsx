import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { gradeSubmission, generateMockExam } from '../lib/gemini';

const MOCK_EXAM_DATA = {
  comprehension: {
    title: 'The Great Balloon Race',
    passage: `It was a crisp, clear morning in September, the perfect day for the annual Great Balloon Race. Hundreds of people had gathered in the park, their faces turned towards the sky as massive, colorful hot air balloons slowly began to inflate. The roaring sound of the gas burners filled the air, like giant dragons waking from a long sleep.

Twelve-year-old Mia stood at the edge of the field, clutching her notebook. She wasn't just watching; she was reporting for her school newspaper. Her favorite balloon, "The Scarlet Flyer," was a bright, dazzling red and looked bigger than a house. Its pilot, Captain Thorne, was busy checking the ropes. He looked nervous. 

Suddenly, a gust of wind swept across the field. "The Scarlet Flyer" jerked violently, pulling one of its anchor ropes loose. Mia gasped as the massive balloon tipped dangerously to one side. The crowd fell silent, watching in horror. Captain Thorne acted quickly, pulling a lever that released a blast of hot air, stabilizing the balloon just in time. The crowd erupted into cheers.`,
    questions: [
      { id: 1, text: 'What month did the Great Balloon Race take place?', marks: 1 },
      { id: 2, text: 'Give one simile used in the first paragraph to describe the sound of the burners.', marks: 1 },
      { id: 3, text: 'Why was Mia at the balloon race?', marks: 1 },
      { id: 4, text: 'Look at the second paragraph. Which word tells you that the red balloon was very bright and impressive?', marks: 1 },
      { id: 5, text: 'What caused the balloon to tip dangerously? Give a reason from the text.', marks: 2 }
    ]
  },
  writing: {
    instructions: 'Write a news report (150-200 words) about a surprising event that happened at a local festival. Remember to include a catchy headline, explain what happened, and include a quote from a witness.'
  }
};

export default function ExamSimulator() {
  const { subject } = useParams<{ subject: string }>();
  const activeSubject = subject || 'english';
  const [examData, setExamData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  
  const [compAnswers, setCompAnswers] = useState<Record<number, string>>({});
  const [essayText, setEssayText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const startExam = async () => {
    setIsGenerating(true);
    try {
      const data = await generateMockExam(activeSubject);
      setExamData(data);
      setHasStarted(true);
      setTimeLeft(3600);
      setCompAnswers({});
      setEssayText('');
    } catch (err) {
      alert("Failed to generate exam. Please check your API key and connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Refs to avoid stale closures in the timer auto-submit
  const compAnswersRef = useRef(compAnswers);
  const essayTextRef = useRef(essayText);
  compAnswersRef.current = compAnswers;
  essayTextRef.current = essayText;

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Grade Comprehension
      const compPrompt = `Passage: ${examData.comprehension.passage}\nQuestions: ${JSON.stringify(examData.comprehension.questions)}`;
      const compResult = await gradeSubmission(compPrompt, JSON.stringify(compAnswersRef.current), 'Comprehension');

      // Grade Writing
      const writeResult = await gradeSubmission(examData.writing.instructions, essayTextRef.current, 'Writing');

      setFeedback({
        comprehension: compResult,
        writing: writeResult,
        totalScore: compResult.score + writeResult.score,
        totalMax: compResult.maxScore + writeResult.maxScore
      });
    } catch (error) {
      console.error(error);
      alert("Failed to grade exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Full Exam Simulator</h1>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <AlertTriangle size={32} />
            <h2 style={{ margin: 0 }}>Strict Exam Conditions</h2>
          </div>
          <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', color: 'var(--text-main)' }}>
            <li>You will have exactly <strong>1 Hour (60 minutes)</strong> to complete the paper.</li>
            <li>The paper consists of a <strong>Reading Comprehension</strong> section and a <strong>Writing Task</strong>.</li>
            <li>When the timer reaches zero, your paper will be automatically submitted and marked by the AI Examiner.</li>
            <li>Do not close or refresh this page during the exam.</li>
          </ul>
          </ul>
          <button 
            className="btn" 
            style={{ background: 'var(--accent)', color: 'white', width: '100%', fontSize: '1.25rem' }} 
            onClick={startExam}
            disabled={isGenerating}
          >
            {isGenerating ? <><Loader2 className="animate-spin" style={{ display: 'inline', marginRight: '0.5rem' }} /> Generating Exam...</> : 'Start the Timer & Begin'}
          </button>
        </div>
      </div>
    );
  }

  if (feedback) {
    const percentage = Math.round((feedback.totalScore / feedback.totalMax) * 100);
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

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Section 1: Reading Comprehension</h2>
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>Score: {feedback.comprehension.score}/{feedback.comprehension.maxScore}</span>
          </div>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>{feedback.comprehension.summary}</p>
          {feedback.comprehension.breakdown.map((b: any, i: number) => (
            <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>{b.criteria}</h4>
                <span style={{ fontWeight: 'bold' }}>{b.score}/{b.max}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{b.note}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Section 2: Writing Task</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>Score: {feedback.writing.score}/{feedback.writing.maxScore}</span>
          </div>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>{feedback.writing.summary}</p>
          {feedback.writing.breakdown.map((b: any, i: number) => (
            <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>{b.criteria}</h4>
                <span style={{ fontWeight: 'bold' }}>{b.score}/{b.max}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{b.note}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '6rem' }}>
      
      {/* Sticky Header with Timer */}
      <div style={{ 
        position: 'sticky', top: '1rem', zIndex: 100, 
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
        padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid var(--border)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', textTransform: 'capitalize' }}>Cambridge Primary {activeSubject} Checkpoint</h2>
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
        
        {/* Left Side: Reading Material */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Section 1: {activeSubject === 'english' ? 'Reading' : 'Context'}</h3>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{examData.comprehension.title}</h2>
            <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {examData.comprehension.passage}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem' }}>Section 2: {activeSubject === 'english' ? 'Writing Prompt' : 'Investigation'}</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{examData.writing.instructions}</p>
          </div>
        </div>

        {/* Right Side: Answer Sheet */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Part 1 Answers</h3>
            {examData.comprehension.questions.map((q: any) => (
              <div key={q.id} style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {q.id}. {q.text} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>[{q.marks} mark{q.marks > 1 ? 's' : ''}]</span>
                </p>
                <textarea
                  value={compAnswers[q.id] || ''}
                  onChange={(e) => setCompAnswers({ ...compAnswers, [q.id]: e.target.value })}
                  style={{
                    width: '100%', minHeight: '60px', padding: '1rem',
                    borderRadius: '0.5rem', border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.7)', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Part 2 Answer (Essay)</h3>
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
              {essayText.split(/\s+/).filter(w => w.length > 0).length} words
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
