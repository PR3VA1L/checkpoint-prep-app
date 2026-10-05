import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Loader2, Settings2, Lightbulb } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateHint } from '../lib/gemini';
import { saveQuestionProgress } from '../lib/srs';
import { useAuth } from '../contexts/AuthContext';

const TOPICS = [
  'Punctuation',
  'Vocabulary in Context',
  'Purpose and Audience',
  'Grammar',
  'Literary Devices',
  'Word Classes',
  'Sentence Structure'
];

export default function MCQPractice() {
  // Setup State
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [isTestMode, setIsTestMode] = useState(false);
  const [allowHints, setAllowHints] = useState(true);
  
  // Practice State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hint State
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [isFetchingHint, setIsFetchingHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  
  // Score Screen State
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  // Auth & Gamification State (must be declared before any conditional returns)
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [showAnnouncer, setShowAnnouncer] = useState('');

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const selectAllTopics = () => {
    if (selectedTopics.length === TOPICS.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics([...TOPICS]);
    }
  };

  const startPractice = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const qRef = collection(db, 'questions');
      let qList = [];
      
      const constraints = [];
      
      if (selectedTopics.length > 0 && selectedTopics.length < TOPICS.length) {
        constraints.push(where('topic', 'in', selectedTopics));
      }
      
      if (selectedDifficulty !== 'All') {
        constraints.push(where('difficulty', '==', selectedDifficulty));
      }
      
      if (constraints.length === 0) {
        const querySnapshot = await getDocs(qRef);
        qList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        const q = query(qRef, ...constraints);
        const querySnapshot = await getDocs(q);
        qList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      if (qList.length === 0) {
        setErrorMsg('No questions found for those filters. Try selecting more topics!');
        setLoading(false);
        return;
      }

      qList = qList.sort(() => Math.random() - 0.5);

      setQuestions(qList);
      setIsSetupComplete(true);
      setIsFinished(false);
      setUserAnswers({});
      setCurrentIndex(0);
      setSelected(null);
      setIsChecked(false);
      setCurrentHint(null);
      setUsedHint(false);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setErrorMsg('Failed to connect to the database.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHint = async () => {
    if (!questions[currentIndex] || isFetchingHint || currentHint) return;
    setIsFetchingHint(true);
    setUsedHint(true);
    const hint = await generateHint(questions[currentIndex].question, questions[currentIndex].options);
    setCurrentHint(hint);
    setIsFetchingHint(false);
  };

  if (!isSetupComplete) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings2 color="var(--primary)" /> Configure Practice
        </h1>
        <div className="glass-card" style={{ padding: '2rem' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold' }}>Select Topics</label>
              <button 
                onClick={selectAllTopics}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
              >
                {selectedTopics.length === TOPICS.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {TOPICS.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                      color: isSelected ? 'white' : 'var(--text-main)',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Difficulty</label>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.7)', fontSize: '1rem', outline: 'none' }}
            >
              <option value="All">All Difficulties (Exam Mix)</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isTestMode} 
                onChange={(e) => {
                  setIsTestMode(e.target.checked);
                  if (e.target.checked) setAllowHints(false);
                }}
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
              <span style={{ fontWeight: 'bold' }}>Simulated Test Mode</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>(No hints, no immediate feedback)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', opacity: isTestMode ? 0.5 : 1 }}>
              <input 
                type="checkbox" 
                checked={allowHints} 
                onChange={(e) => setAllowHints(e.target.checked)}
                disabled={isTestMode}
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
              <span style={{ fontWeight: 'bold' }}>Enable AI Tutor Hints</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>(Penalizes score if used)</span>
            </label>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={startPractice}
            disabled={loading || selectedTopics.length === 0}
            style={{ width: '100%', opacity: selectedTopics.length === 0 ? 0.5 : 1 }}
          >
            {loading ? <Loader2 className="animate-pulse-glow" /> : 'Start Practicing'}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (isSetupComplete && !currentQuestion && !isFinished) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto' }} color="var(--primary)" />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Preparing your questions...</p>
      </div>
    );
  }

  const triggerWrestlemaniaVoice = (streakCount: number) => {
    let word = '';
    if (streakCount === 3) word = 'SENSATIONAL!';
    else if (streakCount === 5) word = 'UNSTOPPABLE!';
    else if (streakCount >= 7) word = 'GOD LIKE!';
    else return;

    setShowAnnouncer(word);
    setTimeout(() => setShowAnnouncer(''), 2000);

    try {
      const msg = new SpeechSynthesisUtterance(word);
      msg.pitch = 0.1; // Super deep voice
      msg.rate = 0.8;
      msg.volume = 1;
      
      // Try to find a male English voice if possible
      const voices = window.speechSynthesis.getVoices();
      const deepVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('david'));
      if (deepVoice) msg.voice = deepVoice;

      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheck = async () => {
    if (selected !== null) {
      setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: selected }));
      const isCorrect = selected === currentQuestion.correctIndex;

      // Save SRS progress in ALL modes
      if (user) {
        await saveQuestionProgress(user.uid, currentQuestion.id, isCorrect);
      }

      if (isTestMode) {
        handleNext();
      } else {
        setIsChecked(true);
        
        if (isCorrect) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          if (newStreak >= 3 && newStreak % 2 !== 0) { // Trigger at 3, 5, 7, 9...
            triggerWrestlemaniaVoice(newStreak);
          }
        } else {
          setStreak(0);
        }
      }
    }
  };

  const handleNext = () => {
    setSelected(null);
    setIsChecked(false);
    setCurrentHint(null);
    setUsedHint(false);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const score = questions.filter(q => userAnswers[q.id] === q.correctIndex).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            {isTestMode ? 'Mock Exam Complete!' : 'Practice Complete!'}
          </h1>
          <div style={{ 
            width: '150px', height: '150px', margin: '0 auto 1.5rem', 
            borderRadius: '50%', background: 'var(--primary-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '8px solid var(--primary)'
          }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {score}/{questions.length}
            </span>
          </div>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            You scored {percentage}% on this session.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsSetupComplete(false)}
            style={{ marginTop: '2rem', padding: '1rem 2rem' }}
          >
            Return to Setup
          </button>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingLeft: '1rem' }}>Review Your Answers</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, idx) => {
            const userAnswerIdx = userAnswers[q.id];
            const isCorrect = userAnswerIdx === q.correctIndex;
            
            return (
              <div key={q.id} className="glass-card" style={{ padding: '2rem', borderLeft: `6px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}` }}>
                <span style={{ display: 'inline-block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  Question {idx + 1} • {q.topic}
                </span>
                <p style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{q.question}</p>
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {(q.options || []).map((opt: string, i: number) => {
                    const isUserPick = i === userAnswerIdx;
                    const isActualAnswer = i === q.correctIndex;
                    
                    let bgColor = 'rgba(255,255,255,0.5)';
                    let borderColor = 'var(--border)';
                    if (isActualAnswer) {
                      bgColor = 'rgba(16, 185, 129, 0.15)'; // Success light
                      borderColor = 'var(--success)';
                    } else if (isUserPick && !isCorrect) {
                      bgColor = 'rgba(239, 68, 68, 0.15)'; // Danger light
                      borderColor = 'var(--danger)';
                    }

                    return (
                      <div key={i} style={{
                        padding: '1rem', borderRadius: '0.75rem',
                        border: `2px solid ${borderColor}`,
                        background: bgColor,
                        display: 'flex', justifyContent: 'space-between'
                      }}>
                        <span>{opt}</span>
                        {isUserPick && <strong>(Your Answer)</strong>}
                      </div>
                    );
                  })}
                </div>

                {!isCorrect && q.explanation && (
                  <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Why is this the answer?</h4>
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      
      {showAnnouncer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', zIndex: 9999, pointerEvents: 'none',
          animation: 'fadeInOut 2s ease-in-out'
        }}>
          <h1 style={{
            fontSize: '6rem', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase',
            background: 'linear-gradient(to bottom, #ffeb3b, #f44336)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(244, 67, 54, 0.8), 0 0 50px rgba(255, 235, 59, 0.5)',
            transform: 'scale(1)', animation: 'slam 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {showAnnouncer}
          </h1>
          <style>{`
            @keyframes fadeInOut { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }
            @keyframes slam { 0% { transform: scale(3); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          `}</style>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {currentQuestion.topic} - {currentQuestion.difficulty} {isTestMode && '(TEST MODE)'}
          </span>
          <h1 style={{ marginTop: '0.5rem', fontSize: '1.75rem' }}>Question {currentIndex + 1} of {questions.length}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: '2rem', height: '0.5rem', background: i <= currentIndex ? 'var(--primary)' : 'rgba(0,0,0,0.1)', borderRadius: '1rem' }} />
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
          {currentQuestion.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(currentQuestion.options || []).map((opt: string, idx: number) => {
            let bgColor = 'rgba(255, 255, 255, 0.5)';
            let borderColor = 'var(--border)';
            let icon = null;

            if (isChecked && !isTestMode) {
              if (idx === currentQuestion.correctIndex) {
                bgColor = 'rgba(34, 197, 94, 0.1)';
                borderColor = 'var(--success)';
                icon = <CheckCircle2 color="var(--success)" />;
              } else if (idx === selected) {
                bgColor = 'rgba(239, 68, 68, 0.1)';
                borderColor = 'var(--danger)';
                icon = <XCircle color="var(--danger)" />;
              }
            } else if (selected === idx) {
              bgColor = 'var(--primary-light)';
              borderColor = 'var(--primary)';
            }

            return (
              <button
                key={idx}
                onClick={() => !isChecked && setSelected(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderRadius: '1rem',
                  border: `2px solid ${borderColor}`,
                  background: bgColor,
                  cursor: isChecked ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '1.125rem',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  color: 'inherit'
                }}
              >
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {currentHint && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '1rem', borderLeft: '4px solid #eab308' }}>
            <h4 style={{ color: '#ca8a04', marginBottom: '0.5rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={20} /> AI Tutor Hint
            </h4>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{currentHint}</p>
          </div>
        )}

        {isChecked && !isTestMode && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.8)', borderRadius: '1rem', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Explanation</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {currentQuestion.explanation}
              {usedHint && <span style={{ display: 'block', marginTop: '0.5rem', color: '#ca8a04', fontWeight: 'bold' }}>(Max score reduced to 0.5 due to hint usage)</span>}
            </p>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div>
            {!isChecked && allowHints && !isTestMode && (
              <button 
                onClick={fetchHint} 
                disabled={isFetchingHint || currentHint !== null}
                style={{ 
                  background: 'none', border: 'none', color: '#ca8a04', cursor: currentHint ? 'default' : 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem',
                  opacity: (isFetchingHint || currentHint) ? 0.5 : 1 
                }}
              >
                {isFetchingHint ? <Loader2 className="animate-spin" size={20} /> : <Lightbulb size={20} />}
                Ask for a Hint (-0.5 pts)
              </button>
            )}
          </div>

          {!isChecked ? (
            <button 
              className="btn btn-primary" 
              onClick={handleCheck}
              disabled={selected === null}
              style={{ opacity: selected === null ? 0.5 : 1, cursor: selected === null ? 'not-allowed' : 'pointer' }}
            >
              {isTestMode ? 'Next Question' : 'Check Answer'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>
              {currentIndex < questions.length - 1 ? (
                <>Next Question <ArrowRight size={20} /></>
              ) : (
                <>Finish Practice <ArrowRight size={20} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
