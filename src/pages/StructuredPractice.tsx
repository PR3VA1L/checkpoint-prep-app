import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PenTool, Loader2, Upload, AlertCircle } from 'lucide-react';
import { extractHandwritingOCR, gradeSubmission, generateMockExam } from '../lib/gemini';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { MOCK_EXAM_BANK } from '../data/mockExamBank';


export default function StructuredPractice() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeSubject = subject || 'english';
  const [taskType, setTaskType] = useState<string>('Writing');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  const [text, setText] = useState('');
  const [compAnswers, setCompAnswers] = useState<Record<number, string>>({});
  
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrChunks, setOcrChunks] = useState<string[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  
  const [examData, setExamData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const startPractice = async () => {
    setIsGenerating(true);
    try {
      let seenExamHashes = new Set<number>();
      if (user) {
        try {
          const sessionQuery = query(collection(db, 'users', user.uid, 'sessions'), where('subject', '==', activeSubject));
          const snapshot = await getDocs(sessionQuery);
          snapshot.forEach(doc => {
            if (doc.data().examHash) seenExamHashes.add(doc.data().examHash);
          });
        } catch (e) {
          console.error('Failed to get sessions', e);
        }
      }

      const bank = MOCK_EXAM_BANK[activeSubject] || [];
      const unseenExams = bank.filter(exam => {
        let hash = 0;
        const text = exam.comprehension?.passage || exam.writing?.instructions || '';
        for (let i = 0; i < text.length; i++) {
          hash = (hash << 5) - hash + text.charCodeAt(i);
          hash &= hash;
        }
        return !seenExamHashes.has(hash);
      });

      let data;
      if (unseenExams.length > 0) {
        data = unseenExams[Math.floor(Math.random() * unseenExams.length)];
      } else {
        data = await generateMockExam(activeSubject);
      }

      let hash = 0;
      const text = data.comprehension?.passage || data.writing?.instructions || '';
      for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash &= hash;
      }
      data.hash = hash;

      setExamData(data);
      setStartTime(Date.now());
      setIsSetupComplete(true);
      setFeedback(null);
      setErrorMsg(null);
      setText('');
      setCompAnswers({});
      setOcrChunks([]);
      setMissingWords([]);
    } catch (err) {
      alert("Failed to generate task. Check connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const transcribedText = await extractHandwritingOCR(base64String);
        
        const chunks = transcribedText.split('__ILLEGIBLE__');
        setOcrChunks(chunks);
        setMissingWords(new Array(chunks.length > 1 ? chunks.length - 1 : 0).fill(''));
      } catch (error) {
        console.error(error);
        alert("Failed to read image. Please try a clearer photo.");
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMissingWordChange = (index: number, value: string) => {
    const newWords = [...missingWords];
    newWords[index] = value;
    setMissingWords(newWords);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let promptText = '';
      let submissionText = '';

      if (taskType === 'Writing') {
        promptText = examData.writing.instructions;
        submissionText = text;
      } else if (taskType === 'Comprehension') {
        promptText = `Passage: ${examData.comprehension.passage}\nQuestions: ${JSON.stringify(examData.comprehension.questions)}`;
        submissionText = JSON.stringify(compAnswers);
      } else if (taskType === 'Upload') {
        promptText = examData.writing.instructions;
        submissionText = ocrChunks.reduce((acc, chunk, i) => {
          return acc + chunk + (missingWords[i] !== undefined ? missingWords[i] : '');
        }, '');
      }

      const result = await gradeSubmission(promptText, submissionText, taskType === 'Comprehension' ? 'Comprehension' : 'Writing');
      setFeedback(result);

      if (user) {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
        const sessionRef = collection(db, 'users', user.uid, 'sessions');
        addDoc(sessionRef, {
          subject: activeSubject,
          type: taskType === 'Comprehension' ? 'Structured Questions' : 'Extended Task',
          score: result.score,
          total: result.maxScore,
          examHash: examData.hash || null,
          timestamp: Timestamp.now(),
          durationSeconds,
          topics: ['Structured Practice']
        }).catch(console.error);
      }
    } catch (error: any) {
      console.error("Grading failed", error);
      setErrorMsg(error.message || "Failed to grade submission. The AI service may be overloaded or out of quota.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSetupComplete) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textTransform: 'capitalize' }}>
          <PenTool color="var(--primary)" /> Configure {activeSubject} Task
        </h1>

        {/* Subject Selector */}
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '2rem', justifyContent: 'center' }}>
          {['english', 'math', 'science'].map(sub => (
            <button
              key={sub}
              onClick={() => navigate(`/practice/structured/${sub}`)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                background: activeSubject === sub ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                color: activeSubject === sub ? 'white' : 'var(--text-main)',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                boxShadow: activeSubject === sub ? '0 4px 6px -1px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            <button 
              onClick={() => setTaskType('Writing')}
              style={{
                padding: '1.5rem', borderRadius: '1rem', cursor: 'pointer',
                border: `2px solid ${taskType === 'Writing' ? 'var(--primary)' : 'var(--border)'}`,
                background: taskType === 'Writing' ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)',
                fontWeight: 'bold', fontSize: '1.1rem'
              }}
            >
              {activeSubject === 'english' ? 'Full Writing Task' : 'Extended Problem Solving'}
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '0.5rem' }}>
                {activeSubject === 'english' ? '(Type an essay or story)' : '(Explain your full reasoning)'}
              </span>
            </button>
            <button 
              onClick={() => setTaskType('Comprehension')}
              style={{
                padding: '1.5rem', borderRadius: '1rem', cursor: 'pointer',
                border: `2px solid ${taskType === 'Comprehension' ? 'var(--primary)' : 'var(--border)'}`,
                background: taskType === 'Comprehension' ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)',
                fontWeight: 'bold', fontSize: '1.1rem'
              }}
            >
              {activeSubject === 'english' ? 'Full Comprehension Task' : 'Structured Paper Questions'}
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '0.5rem' }}>
                {activeSubject === 'english' ? '(Read passage & answer questions)' : '(Solve short-answer questions)'}
              </span>
            </button>
            <button 
              onClick={() => setTaskType('Upload')}
              style={{
                padding: '1.5rem', borderRadius: '1rem', cursor: 'pointer',
                border: `2px solid ${taskType === 'Upload' ? 'var(--primary)' : 'var(--border)'}`,
                background: taskType === 'Upload' ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)',
                fontWeight: 'bold', fontSize: '1.1rem'
              }}
            >
              Upload Photo of Handwriting
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '0.5rem' }}>(AI OCR Auto-Grade)</span>
            </button>
          </div>

          <button className="btn btn-primary" onClick={startPractice} style={{ width: '100%', padding: '1rem' }} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="animate-spin" style={{ display: 'inline', marginRight: '0.5rem' }} /> Generating Practice...</> : 'Start Task'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: taskType === 'Comprehension' ? '1200px' : '800px', margin: '0 auto' }}>
      
      {taskType === 'Comprehension' ? (
        <div className={activeSubject === 'english' ? "responsive-flex" : ""} style={activeSubject !== 'english' ? { display: 'flex', flexDirection: 'column', gap: '2rem' } : undefined}>
          {/* Passage / Scenario block */}
          {examData.comprehension.passage && (
            <div className="glass-card scrollable-panel" style={{ flex: 1, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{examData.comprehension.title}</h2>
              <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                {examData.comprehension.passage}
              </div>
            </div>
          )}

          {/* Right Column / Bottom Column: Questions */}
          <div className="glass-card scrollable-panel" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {examData.comprehension.questions.map((q: any) => (
                <div key={q.id} style={{ marginBottom: '2rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                    {q.id}. {q.text} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>[{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]</span>
                  </p>
                  <textarea
                    value={compAnswers[q.id] || ''}
                    onChange={(e) => setCompAnswers({ ...compAnswers, [q.id]: e.target.value })}
                    placeholder="Type your answer here..."
                    style={{
                      width: '100%', minHeight: '80px', padding: '1rem',
                      borderRadius: '0.75rem', border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.7)', outline: 'none',
                      resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {errorMsg && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
                </div>
              )}
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%' }}>
                {loading ? <Loader2 className="animate-spin" /> : 'Submit for Marking'}
              </button>
            </div>
          </div>
        </div>

      ) : taskType === 'Upload' ? (
        
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Upload Handwritten Practice</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Prompt: <strong>{examData?.writing?.instructions || (activeSubject === 'english' ? "Write your essay here." : "Show your working here.")}</strong>
          </p>

          {ocrChunks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border)', borderRadius: '1rem', background: 'rgba(255,255,255,0.3)' }}>
              {ocrLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Loader2 className="animate-spin" size={40} color="var(--primary)" />
                  <p>Reading your handwriting... This takes a moment!</p>
                </div>
              ) : (
                <>
                  <Upload size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>{activeSubject === 'english' ? 'Take a photo of your essay' : 'Take a photo of your work'}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ensure the lighting is good and the writing is clear.</p>
                  <input type="file" accept="image/*" onChange={handleFileUpload} id="handwriting-upload" style={{ display: 'none' }} />
                  <label htmlFor="handwriting-upload" className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    Select Image
                  </label>
                </>
              )}
            </div>
          ) : (
            <div>
              {missingWords.length > 0 && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={20} />
                  <span>The AI had trouble reading some words. Please fill in the red boxes before grading!</span>
                </div>
              )}

              <div style={{ lineHeight: '2.2', fontSize: '1.15rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                {ocrChunks.map((chunk, index) => (
                  <span key={index}>
                    {chunk}
                    {index < missingWords.length && (
                      <input
                        type="text"
                        value={missingWords[index]}
                        onChange={(e) => handleMissingWordChange(index, e.target.value)}
                        placeholder="???"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)', border: '2px solid var(--danger)',
                          color: 'var(--danger)', fontWeight: 'bold', padding: '0.2rem 0.5rem',
                          borderRadius: '0.5rem', width: '100px', margin: '0 0.5rem', textAlign: 'center',
                          outline: 'none'
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>

              {errorMsg && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.75rem', marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || missingWords.some(w => w.trim() === '')} style={{ width: '100%', marginTop: '2rem' }}>
                {loading ? <Loader2 className="animate-spin" /> : (activeSubject === 'english' ? 'Confirm & Grade Essay' : 'Confirm & Grade Work')}
              </button>
            </div>
          )}
        </div>

      ) : (

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{activeSubject === 'english' ? 'Writing Task' : 'Problem Solving Task'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Prompt: <strong>{examData?.writing?.instructions || (activeSubject === 'english' ? "Write your essay here." : "Show your working here.")}</strong>
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing here..."
            style={{
              width: '100%', minHeight: '300px', padding: '1.5rem',
              borderRadius: '1rem', border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.7)', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit', fontSize: '1.1rem',
              lineHeight: '1.6'
            }}
          />

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || text.length < 10}>
              {loading ? <Loader2 className="animate-spin" /> : 'Submit for Marking'}
            </button>
          </div>
          {errorMsg && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.75rem', marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: '2rem' }} className="glass-card fade-in">
          <div style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem 2rem', borderRadius: '1rem 1rem 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Examiner Feedback</h3>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{feedback.score} / {feedback.maxScore}</span>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>{feedback.summary}</p>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {feedback.breakdown.map((item: any, i: number) => (
                <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '1rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.criteria}</h4>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{item.score}/{item.max}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>{item.note}</p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setIsSetupComplete(false)} style={{ padding: '0.75rem 2rem' }}>
                Back to Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
