import { useState } from 'react';
import { PenTool, Loader2, Upload, AlertCircle } from 'lucide-react';
import { extractHandwritingOCR, gradeSubmission } from '../lib/gemini';

const MOCK_WRITING_PROMPT = {
  instructions: 'Write a short story (150-200 words) about a character who finds a mysterious map hidden inside a library book.',
};

const MOCK_COMPREHENSION = {
  title: 'The Secret of the Old Mill',
  passage: `The old flour mill stood at the edge of the village, silent and forgotten. Its wooden wheel had not turned for fifty years, and thick, green ivy crept up its stone walls like long fingers. Most of the villagers avoided it, especially after dark, whispering stories about strange noises that echoed from inside.
  
Leo, however, was not like most villagers. He was ten years old and had a mind full of questions and a pocket full of useful things, like string, a magnifying glass, and a slightly squashed sandwich. It was a Tuesday afternoon, and the sun was just beginning to dip behind the hills, casting long, spooky shadows across the grass.

As Leo approached the mill's heavy wooden door, he noticed something unusual. The thick layer of dust on the ground had been disturbed. There were fresh footprints leading right up to the entrance. They were small, perhaps belonging to an animal, or maybe... someone else. 

Taking a deep breath, Leo pushed the door. It swung open with a loud *creak* that made him jump. Inside, it was dark and smelled strongly of damp wood and old flour. Suddenly, a tiny scuffling noise came from the corner of the room. Leo froze. He reached into his pocket, pulled out his flashlight, and clicked it on. The beam of light swept across the dusty floor, stopping on a small, huddled shape hiding behind a broken barrel.`,
  questions: [
    { id: 1, text: 'Look at the first paragraph. What did the ivy creeping up the walls look like?', marks: 1 },
    { id: 2, text: 'Why did the villagers avoid the mill after dark?', marks: 1 },
    { id: 3, text: 'Give two things Leo had in his pocket.', marks: 2 },
    { id: 4, text: 'What time of day did Leo visit the mill? Give a reason from the text to support your answer.', marks: 2 },
    { id: 5, text: 'What made Leo jump when he opened the door?', marks: 1 },
    { id: 6, text: 'Look at the last paragraph. Write down one word that tells you the room was wet or humid.', marks: 1 },
    { id: 7, text: 'What do you think the "small, huddled shape" is? Give a reason using evidence from the text.', marks: 2 }
  ]
};

export default function WrittenPractice() {
  const [taskType, setTaskType] = useState<string>('Writing');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  const [text, setText] = useState('');
  const [compAnswers, setCompAnswers] = useState<Record<number, string>>({});
  
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrChunks, setOcrChunks] = useState<string[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const startPractice = () => {
    setIsSetupComplete(true);
    setFeedback(null);
    setText('');
    setCompAnswers({});
    setOcrChunks([]);
    setMissingWords([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const transcribedText = await extractHandwritingOCR(base64String);
        
        const chunks = transcribedText.split('__ILLEGIBLE__');
        setOcrChunks(chunks);
        setMissingWords(new Array(chunks.length > 1 ? chunks.length - 1 : 0).fill(''));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert("Failed to read image.");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleMissingWordChange = (index: number, value: string) => {
    const newWords = [...missingWords];
    newWords[index] = value;
    setMissingWords(newWords);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let promptText = '';
      let submissionText = '';

      if (taskType === 'Writing') {
        promptText = MOCK_WRITING_PROMPT.instructions;
        submissionText = text;
      } else if (taskType === 'Comprehension') {
        promptText = `Passage: ${MOCK_COMPREHENSION.passage}\nQuestions: ${JSON.stringify(MOCK_COMPREHENSION.questions)}`;
        submissionText = JSON.stringify(compAnswers);
      } else if (taskType === 'Upload') {
        promptText = MOCK_WRITING_PROMPT.instructions;
        submissionText = ocrChunks.reduce((acc, chunk, i) => {
          return acc + chunk + (missingWords[i] !== undefined ? missingWords[i] : '');
        }, '');
      }

      const result = await gradeSubmission(promptText, submissionText, taskType === 'Comprehension' ? 'Comprehension' : 'Writing');
      setFeedback(result);
    } catch (error) {
      console.error("Grading failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSetupComplete) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <PenTool color="var(--primary)" /> Configure Task
        </h1>
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
              Full Writing Task
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '0.5rem' }}>(Type an essay or story)</span>
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
              Full Comprehension Task
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '0.5rem' }}>(Read passage & answer questions)</span>
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

          <button className="btn btn-primary" onClick={startPractice} style={{ width: '100%', padding: '1rem' }}>
            Start Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: taskType === 'Comprehension' ? '1200px' : '800px', margin: '0 auto' }}>
      
      {taskType === 'Comprehension' ? (
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Left Column: Passage */}
          <div className="glass-card" style={{ flex: 1, padding: '2rem', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{MOCK_COMPREHENSION.title}</h2>
            <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {MOCK_COMPREHENSION.passage}
            </div>
          </div>

          {/* Right Column: Questions */}
          <div className="glass-card" style={{ flex: 1, padding: '2rem', height: 'calc(100vh - 120px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {MOCK_COMPREHENSION.questions.map((q) => (
                <div key={q.id} style={{ marginBottom: '2rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
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
            Prompt: <strong>{MOCK_WRITING_PROMPT.instructions}</strong>
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
                  <h3 style={{ marginBottom: '0.5rem' }}>Take a photo of your essay</h3>
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

              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || missingWords.some(w => w.trim() === '')} style={{ width: '100%', marginTop: '2rem' }}>
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm & Grade Essay'}
              </button>
            </div>
          )}
        </div>

      ) : (

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Writing Task</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Prompt: <strong>{MOCK_WRITING_PROMPT.instructions}</strong>
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
          </div>
        </div>
      )}
    </div>
  );
}
