import { useState } from 'react';
import { Send, CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function ContactUs() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user ? user.uid : 'anonymous',
        email: user ? user.email : 'anonymous',
        name: user ? user.displayName : 'anonymous',
        subject,
        message,
        timestamp: Timestamp.now(),
        status: 'unread'
      });
      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error("Failed to submit feedback", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
          <MessageSquareWarning size={40} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Have feedback, found a bug, or need help? Let us know!</p>
      </header>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Message Sent!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for your feedback. We'll look into it right away.</p>
            <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>Send Another Message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subject</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontFamily: 'inherit' }}
                required
              >
                <option value="">Select a topic...</option>
                <option value="bug">Report a Bug / Glitch</option>
                <option value="content">Question Content Issue (e.g. wrong answer)</option>
                <option value="feedback">General Feedback & Ideas</option>
                <option value="help">Need Help / Support</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or feedback in detail..."
                style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}>
              {loading ? 'Sending...' : <><Send size={20} /> Send Message</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
