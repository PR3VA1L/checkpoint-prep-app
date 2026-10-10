import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Loader2, Settings2, Lightbulb } from 'lucide-react';
import { collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateMCQQuestions } from '../lib/gemini';
import { saveQuestionProgress } from '../lib/srs';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { QUESTION_BANK } from '../data/questionBank';
import confetti from 'canvas-confetti';

const playPopSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio context errors
  }
};

const SUBJECT_CATEGORIES: Record<string, Record<string, string[]>> = {
  english: {
    'Reading & Comprehension': ['Vocabulary in Context', 'Purpose and Audience', 'Literary Devices'],
    'Writing & Grammar': ['Punctuation', 'Grammar', 'Word Classes', 'Sentence Structure']
  },
  math: {
    'Number': ['Fractions', 'Decimals', 'Percentages', 'Mental Math', 'Ratio'],
    'Geometry': ['2D Shapes', '3D Shapes', 'Symmetry', 'Angles', 'Coordinates'],
    'Measure': ['Time', 'Mass', 'Capacity', 'Length', 'Area & Perimeter'],
    'Data Handling': ['Bar charts', 'Line graphs', 'Probability', 'Averages']
  },
  science: {
    'Biology': ['Plants', 'Human Systems', 'Habitats', 'Food Chains', 'Microorganisms'],
    'Chemistry': ['Materials', 'States of Matter', 'Reversible Changes', 'Properties'],
    'Physics': ['Forces', 'Light', 'Sound', 'Electricity', 'Magnetism'],
    'Earth & Space': ['Earth', 'Solar System', 'Moon Phases']
  }
};

export default function MCQPractice() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const activeSubject = subject || 'english';
  const categoryObj = SUBJECT_CATEGORIES[activeSubject] || SUBJECT_CATEGORIES['english'];

  // Setup State
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [vocabLevel, setVocabLevel] = useState('Standard (11-year-old)');
  const [numQuestions, setNumQuestions] = useState<number | string>(10);
  const [isTestMode, setIsTestMode] = useState(false);
  const [allowHints, setAllowHints] = useState(true);
  const [isTimed, setIsTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // FIX: Reset selected topics when subject changes via URL
  useEffect(() => {
    setSelectedTopics([]);
    setIsSetupComplete(false);
  }, [activeSubject]);

  // FIX: Preload speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
    }
  }, []);
  
  // Practice State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hint State
  const [currentHint, setCurrentHint] = useState<string | null>(null);
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

  const startDailyPlan = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let dueQuestionIds = new Set<string>();
      let progressIds = new Set<string>();
      if (user) {
        try {
          const progressQuery = query(collection(db, 'user_progress'), where('userId', '==', user.uid));
          const snapshot = await getDocs(progressQuery);
          const now = Date.now();
          snapshot.forEach(doc => {
            const data = doc.data();
            progressIds.add(data.questionId);
            if (data.nextReviewDate && data.nextReviewDate.toMillis() <= now) {
              dueQuestionIds.add(data.questionId);
            }
          });
        } catch (e) {
          console.error('Failed to get progress', e);
        }
      }

      let qList = QUESTION_BANK.filter(q => q.subject === activeSubject);
      
      const formattedBank = qList.map(q => {
        let hash = 0;
        for (let i = 0; i < q.question.length; i++) {
          hash = (hash << 5) - hash + q.question.charCodeAt(i);
          hash &= hash;
        }
        return {
          ...q,
          id: 'bank-' + Math.abs(hash).toString(36)
        };
      });

      let dueQuestions = formattedBank.filter(q => dueQuestionIds.has(q.id));
      let unseen = formattedBank.filter(q => !progressIds.has(q.id));
      
      let selectedQuestions = [];
      // Take up to 7 due questions
      selectedQuestions.push(...dueQuestions.sort(() => Math.random() - 0.5).slice(0, 7));
      
      // Fill remaining with unseen
      const remainingSlots = 15 - selectedQuestions.length;
      if (remainingSlots > 0) {
        selectedQuestions.push(...unseen.sort(() => Math.random() - 0.5).slice(0, remainingSlots));
      }
      
      // If still not 15, fallback to anything
      if (selectedQuestions.length < 15) {
        const selectedIds = new Set(selectedQuestions.map(q => q.id));
        const filler = formattedBank.filter(q => !selectedIds.has(q.id));
        selectedQuestions.push(...filler.sort(() => Math.random() - 0.5).slice(0, 15 - selectedQuestions.length));
      }

      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
      
      setQuestions(selectedQuestions);
      setStartTime(Date.now());
      setIsSetupComplete(true);
      setIsFinished(false);
      setUserAnswers({});
      setCurrentIndex(0);
      setSelected(null);
      setIsChecked(false);
      setCurrentHint(null);
      if (isTimed) setTimeLeft(selectedQuestions.length * 60); // 1 minute per question
    } catch (err) {
      setErrorMsg('Failed to start daily plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isTimed && !isFinished && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev! - 1), 1000);
    } else if (isTimed && timeLeft === 0 && !isFinished) {
      setIsFinished(true); // Auto-finish when time is up
    }
    return () => clearInterval(timer);
  }, [isTimed, isFinished, timeLeft]);

  useEffect(() => {
    if (location.search.includes('plan=daily')) {
      startDailyPlan();
    }
  }, [location.search, activeSubject]);


  const startPractice = async () => {
    // FIX: Guard against empty or invalid numQuestions
    const questionCount = Number(numQuestions) || 10;
    if (questionCount < 1) {
      setErrorMsg('Please enter a valid number of questions (1-50).');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      let progressIds = new Set<string>();
      if (user) {
        try {
          const progressQuery = query(collection(db, 'user_progress'), where('userId', '==', user.uid));
          const snapshot = await getDocs(progressQuery);
          snapshot.forEach(doc => {
            // Include seen questions so we skip them
            if (doc.data().consecutiveCorrect > 0 || doc.data().interval > 0) {
              progressIds.add(doc.data().questionId);
            }
          });
        } catch (e) {
          console.error('Failed to get progress', e);
        }
      }

      // Target counts
      const specificTopicCount = selectedTopics.length > 0 ? Math.ceil(questionCount / 2) : 0;

      let qList: any[] = [];
      let bankQuestions = [...QUESTION_BANK];

      // Add stable IDs to bank questions to check against progressIds
      bankQuestions = bankQuestions.map((q, idx) => ({
        ...q,
        id: 'bank-' + activeSubject + '-' + idx + '-' + Math.abs(q.question.length)
      }));

      // Filter by subject and difficulty
      let eligibleBank = bankQuestions.filter(q => {
        if (q.subject.toLowerCase() !== activeSubject.toLowerCase()) return false;
        if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
        return true;
      });

      // Filter out seen questions
      let unseenBank = eligibleBank.filter(q => !progressIds.has(q.id!));
      if (unseenBank.length < questionCount) {
        // Fall back to reusing seen ones if we don't have enough unseen
        unseenBank = eligibleBank;
      }

      // Shuffle unseen bank
      unseenBank = unseenBank.sort(() => Math.random() - 0.5);

      if (specificTopicCount > 0) {
        const specificQs = unseenBank.filter(q => selectedTopics.includes(q.topic)).slice(0, specificTopicCount);
        qList.push(...specificQs);
        
        // Remove picked questions so we don't pick them again for the mixed part
        const pickedIds = new Set(specificQs.map(q => q.id));
        unseenBank = unseenBank.filter(q => !pickedIds.has(q.id));
      }

      // Fill the rest with mixed topics
      const needed = questionCount - qList.length;
      if (needed > 0) {
        qList.push(...unseenBank.slice(0, needed));
      }

      // --- FINAL FALLBACK: Dynamic Generation (Gemini) ---
      // Only if we somehow don't have enough in the 900+ question bank
      if (qList.length < questionCount) {
        try {
          const numToGenerate = questionCount - qList.length;
          const generatedQuestions = await generateMCQQuestions(activeSubject, selectedTopics, selectedDifficulty, numToGenerate, vocabLevel);
          
          if (generatedQuestions.length > 0) {
            for (const q of generatedQuestions) {
              qList.push({ id: 'temp-' + Math.random().toString(), ...q });
            }
          }
        } catch (genErr) {
          console.error("Dynamic generation failed", genErr);
        }
      }

      if (qList.length === 0) {
        setErrorMsg('No questions found. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Final shuffle to mix the specific and mixed topic questions
      qList = qList.sort(() => Math.random() - 0.5).slice(0, questionCount);

      setQuestions(qList);
      setStartTime(Date.now());
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
    if (!questions[currentIndex] || currentHint) return;
    setUsedHint(true);
    const q = questions[currentIndex];
    setCurrentHint(q.hint || `Focus on the core concept of ${q.topic}. Look carefully at the options and try to eliminate the ones that clearly don't make sense in this context.`);
  };

  if (!isSetupComplete) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textTransform: 'capitalize' }}>
          <Settings2 color="var(--primary)" /> Configure {activeSubject} Practice
        </h1>

        {/* Subject Selector */}
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '2rem' }}>
          {['english', 'math', 'science'].map(sub => (
            <button
              key={sub}
              onClick={() => {
                setSelectedTopics([]); // reset topics
                navigate(`/practice/mcq/${sub}`);
              }}
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

        <div className="glass-card" style={{ padding: '2rem' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold' }}>Select Topics</label>
              <button 
                onClick={() => {
                  const allTopics = Object.values(categoryObj).flat();
                  setSelectedTopics(selectedTopics.length === allTopics.length ? [] : [...allTopics]);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
              >
                {selectedTopics.length === Object.values(categoryObj).flat().length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(categoryObj).map(([category, topics]) => (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 'bold' }}>
                      {category}
                    </h3>
                    <button 
                      onClick={() => {
                        const allSelected = topics.every(t => selectedTopics.includes(t));
                        if (allSelected) {
                          setSelectedTopics(selectedTopics.filter(t => !topics.includes(t)));
                        } else {
                          const newTopics = new Set([...selectedTopics, ...topics]);
                          setSelectedTopics(Array.from(newTopics));
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}
                    >
                      {topics.every(t => selectedTopics.includes(t)) ? 'Deselect Group' : 'Select Group'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {topics.map(topic => {
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
                            fontFamily: 'inherit',
                            fontSize: '0.95rem'
                          }}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.75rem' }}>Vocabulary & Explanation Complexity</label>
            <select 
              value={vocabLevel} 
              onChange={(e) => setVocabLevel(e.target.value)}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '0.75rem', 
                border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="Simple (8-9 year old, very basic words)">Simple (Basic vocab for younger readers)</option>
              <option value="Standard (11-year-old)">Standard (Exam Level)</option>
              <option value="Advanced (13+ year old, rich vocabulary)">Advanced (Challenge Level)</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.75rem' }}>Number of Questions (1-50)</label>
            <input 
              type="number" 
              min="1" 
              max="50"
              value={numQuestions}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') setNumQuestions('');
                else setNumQuestions(Math.min(50, Math.max(1, parseInt(val) || 1)));
              }}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '0.75rem', 
                border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem', outline: 'none'
              }}
            />
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

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isTimed} 
                onChange={(e) => setIsTimed(e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }} 
              />
              <span style={{ fontWeight: 'bold' }}>Timed Practice</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>(1 min per question)</span>
            </label>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {selectedTopics.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginBottom: '1rem' }}>Please select at least one topic above to begin.</p>
          )}

          <button 
            className="btn btn-primary" 
            onClick={startPractice}
            disabled={loading || selectedTopics.length === 0}
            style={{ width: '100%', opacity: selectedTopics.length === 0 ? 0.5 : 1, minHeight: '3.5rem' }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Loader2 className="animate-spin" /> Preparing questions...
              </div>
            ) : 'Start Practicing'}
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
    let audioFile = '';
    if (streakCount === 3) { word = 'SENSATIONAL!'; audioFile = '/sounds/sensational.mp3'; }
    else if (streakCount === 5) { word = 'UNSTOPPABLE!'; audioFile = '/sounds/unstoppable.mp3'; }
    else if (streakCount >= 7) { word = 'GOD LIKE!'; audioFile = '/sounds/godlike.mp3'; }
    else return;

    setShowAnnouncer(word);
    setTimeout(() => setShowAnnouncer(''), 2000);

    try {
      // Use real MP3 sound effects from the public folder instead of robotic TTS
      const audio = new Audio(audioFile);
      audio.volume = 1.0;
      audio.play().catch(e => console.warn('Could not play announcer voice. Please ensure you have added the MP3 files to public/sounds/', e));
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  const handleCheck = async () => {
    if (selected !== null) {
      const newAnswers = { ...userAnswers, [currentQuestion.id]: selected };
      setUserAnswers(newAnswers);
      const isCorrect = selected === currentQuestion.correctIndex;

      // Save SRS progress in ALL modes
      if (user) {
        await saveQuestionProgress(user.uid, currentQuestion.id, isCorrect);
      }

      if (isTestMode) {
        handleNext(newAnswers);
      } else {
        setIsChecked(true);
        
        if (isCorrect) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
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

  const handleNext = (finalAnswers?: Record<string, number>) => {
    setSelected(null);
    setIsChecked(false);
    setCurrentHint(null);
    setUsedHint(false);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      // Save session history
      if (user) {
        const answersToUse = finalAnswers || userAnswers;
        const score = questions.filter(q => answersToUse[q.id] === q.correctIndex).length;
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
        const sessionRef = collection(db, 'users', user.uid, 'sessions');
        addDoc(sessionRef, {
          subject: activeSubject,
          type: isTestMode ? 'Mock Exam' : 'Practice',
          score,
          total: questions.length,
          timestamp: Timestamp.now(),
          durationSeconds,
          topics: selectedTopics.length > 0 ? selectedTopics : ['Daily Mix']
        }).catch(console.error);
      }
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
                
                {q.visual && (
                  <div 
                    style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(q.visual) }} 
                  />
                )}

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          {isTimed && timeLeft !== null && (
            <div style={{ padding: '0.5rem 1rem', background: timeLeft < 30 ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)', color: timeLeft < 30 ? 'var(--danger)' : 'var(--text-main)', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: '2rem', height: '0.5rem', background: i <= currentIndex ? 'var(--primary)' : 'rgba(0,0,0,0.1)', borderRadius: '1rem' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {currentQuestion.imageUrl && (
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <img src={currentQuestion.imageUrl} alt="Question Diagram" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem', objectFit: 'contain' }} />
          </div>
        )}
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
          {currentQuestion.question}
        </p>

        {currentQuestion.visual && (
          <div 
            style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '1rem' }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentQuestion.visual) }} 
          />
        )}

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
                onClick={() => {
                  if (!isChecked) {
                    playPopSound();
                    setSelected(idx);
                  }
                }}
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
                disabled={currentHint !== null}
                style={{ 
                  background: 'none', border: 'none', color: '#ca8a04', cursor: currentHint ? 'default' : 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem',
                  opacity: currentHint ? 0.5 : 1 
                }}
              >
                <Lightbulb size={20} />
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
            <button className="btn btn-primary" onClick={() => handleNext()}>
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
