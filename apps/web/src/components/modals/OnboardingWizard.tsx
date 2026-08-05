import React, { useState, useEffect } from 'react';

interface OnboardingWizardProps {
  onComplete: (name: string, theme: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2) onComplete(name, theme);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--canvas)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ width: 400, padding: 32, backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--hairline-strong)' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Welcome to devwannaspace</h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-subtle)' }}>Let's set up your local workspace. What should we call you?</p>
            
            <input 
              autoFocus
              type="text" 
              placeholder="Your name" 
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
                color: 'var(--ink)', fontSize: 14, outline: 'none'
              }}
            />

            <button 
              onClick={handleNext}
              disabled={!name.trim()}
              style={{
                marginTop: 8, padding: '10px', backgroundColor: name.trim() ? 'var(--primary)' : 'var(--surface-3)', 
                color: name.trim() ? '#fff' : 'var(--ink-tertiary)', borderRadius: 'var(--radius-md)', 
                border: 'none', cursor: name.trim() ? 'pointer' : 'not-allowed', fontWeight: 500
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Choose a theme</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-subtle)' }}>You can change this later in Settings.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { id: 'dark', label: 'Dark Mode' },
                { id: 'midnight', label: 'Midnight Blue' },
                { id: 'rose', label: 'Rose Gold' },
                { id: 'forest', label: 'Forest Green' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    padding: '12px', borderRadius: 'var(--radius-md)',
                    backgroundColor: theme === t.id ? 'var(--surface-3)' : 'var(--surface-2)',
                    border: `1px solid ${theme === t.id ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                    color: 'var(--ink)', fontSize: 13, cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button 
              onClick={handleNext}
              style={{
                marginTop: 8, padding: '10px', backgroundColor: 'var(--primary)', color: '#fff', 
                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 500
              }}
            >
              Finish Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
