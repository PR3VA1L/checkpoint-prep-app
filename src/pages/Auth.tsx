import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('That email is already registered. Try logging in instead!');
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMsg('Incorrect email or password.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(error.message || 'Failed to authenticate.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Checkpoint
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
          Cambridge Primary Checkpoint prep for English, Math & Science.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h2>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ 
            width: '100%', padding: '0.875rem', borderRadius: '1rem', 
            background: 'white', color: '#333', border: '1px solid #ddd', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '1.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '1rem', border: '1px solid var(--border)', outline: 'none', background: 'rgba(255,255,255,0.5)' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '1rem', border: '1px solid var(--border)', outline: 'none', background: 'rgba(255,255,255,0.5)' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
}
