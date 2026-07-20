import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Command } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim()) {
      const success = login(name.trim(), password);
      if (!success) {
        setError('Incorrect password for this username.');
      }
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--main-panel)'
    }}>
      <div style={{
        width: '100%', maxWidth: 400, padding: 40,
        backgroundColor: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-xl)', boxShadow: '0 12px 48px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(94, 106, 210, 0.3)' }}>
            <Command size={20} />
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            devwannaspace
          </span>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 8 }}>
              What should we call you?
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ryanda"
              style={{
                width: '100%', padding: '12px 16px', background: 'var(--surface-2)',
                border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)',
                color: 'var(--ink)', fontSize: 15, outline: 'none', transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 8 }}>
              Password (optional for new users)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 16px', background: 'var(--surface-2)',
                border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)',
                color: 'var(--ink)', fontSize: 15, outline: 'none', transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
            />
          </div>
          
          {error && (
            <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 500, padding: '8px 12px', background: '#fef2f2', border: '1px solid #f87171', borderRadius: 'var(--radius-md)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease', opacity: name.trim() ? 1 : 0.5,
              marginTop: 8
            }}
            onMouseEnter={(e) => { if (name.trim()) e.currentTarget.style.background = 'var(--primary-hover)'; }}
            onMouseLeave={(e) => { if (name.trim()) e.currentTarget.style.background = 'var(--primary)'; }}
          >
            Enter Workspace
          </button>
        </form>
      </div>
    </div>
  );
};
