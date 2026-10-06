import { useState } from 'react';
import { Calculator, X, Delete } from 'lucide-react';

export default function FloatingCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNum = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // Very basic eval-like logic but safer using Function
      const fullEq = equation + display;
      const sanitized = fullEq.replace(/[^-()\d/*+.]/g, '');
      const result = new Function('return ' + sanitized)();
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'transform 0.2s'
        }}
      >
        <Calculator size={28} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: 'rgba(20, 25, 40, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      width: '320px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 50,
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Calculator size={18} /> Scientific Calculator
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ 
        background: 'rgba(0,0,0,0.5)', 
        borderRadius: '0.75rem', 
        padding: '1rem',
        marginBottom: '1rem',
        textAlign: 'right',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', minHeight: '1.5rem' }}>{equation}</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', overflowX: 'hidden' }}>{display}</div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '0.5rem' 
      }}>
        <button onClick={handleClear} style={calcBtnStyle('var(--danger)')}>AC</button>
        <button onClick={handleDelete} style={calcBtnStyle('var(--secondary)')}><Delete size={18}/></button>
        <button onClick={() => handleNum('(')} style={calcBtnStyle('rgba(255,255,255,0.1)')}>(</button>
        <button onClick={() => handleNum(')')} style={calcBtnStyle('rgba(255,255,255,0.1)')}>)</button>

        <button onClick={() => handleNum('7')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>7</button>
        <button onClick={() => handleNum('8')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>8</button>
        <button onClick={() => handleNum('9')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>9</button>
        <button onClick={() => handleOp('/')} style={calcBtnStyle('var(--primary)')}>÷</button>

        <button onClick={() => handleNum('4')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>4</button>
        <button onClick={() => handleNum('5')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>5</button>
        <button onClick={() => handleNum('6')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>6</button>
        <button onClick={() => handleOp('*')} style={calcBtnStyle('var(--primary)')}>×</button>

        <button onClick={() => handleNum('1')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>1</button>
        <button onClick={() => handleNum('2')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>2</button>
        <button onClick={() => handleNum('3')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>3</button>
        <button onClick={() => handleOp('-')} style={calcBtnStyle('var(--primary)')}>−</button>

        <button onClick={() => handleNum('0')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>0</button>
        <button onClick={() => handleNum('.')} style={calcBtnStyle('rgba(255,255,255,0.05)')}>.</button>
        <button onClick={calculate} style={calcBtnStyle('var(--success)')}>=</button>
        <button onClick={() => handleOp('+')} style={calcBtnStyle('var(--primary)')}>+</button>
      </div>
    </div>
  );
}

const calcBtnStyle = (bg: string) => ({
  background: bg,
  border: 'none',
  borderRadius: '0.5rem',
  padding: '1rem 0',
  color: 'white',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.1s, opacity 0.2s',
});
