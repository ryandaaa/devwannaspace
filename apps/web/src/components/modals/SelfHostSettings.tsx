import React, { useState } from 'react';
import { X, Server } from 'lucide-react';

interface SelfHostSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

export const SelfHostSettings: React.FC<SelfHostSettingsProps> = ({ isOpen, onClose, isMandatory = false }) => {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('devwannaspace_custom_api_url') || '');
  const [clerkKey, setClerkKey] = useState(() => localStorage.getItem('devwannaspace_custom_clerk_key') || '');
  
  if (!isOpen) return null;

  const handleSave = () => {
    if (apiUrl.trim()) {
      localStorage.setItem('devwannaspace_custom_api_url', apiUrl.trim());
    } else {
      localStorage.removeItem('devwannaspace_custom_api_url');
    }
    
    if (clerkKey.trim()) {
      localStorage.setItem('devwannaspace_custom_clerk_key', clerkKey.trim());
    } else {
      localStorage.removeItem('devwannaspace_custom_clerk_key');
    }
    
    // Reload the app to apply new settings to ClerkProvider and api.ts
    window.location.reload();
  };

  const handleClear = () => {
    localStorage.removeItem('devwannaspace_custom_api_url');
    localStorage.removeItem('devwannaspace_custom_clerk_key');
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'var(--scrim)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        backgroundColor: 'var(--surface-1)',
        borderRadius: 'var(--radius-xl)',
        width: 480,
        maxWidth: '90%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        border: '1px solid var(--hairline-strong)',
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Server size={20} color="var(--ink)" />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>Self-Host Configuration</h2>
          </div>
          {!isMandatory && (
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'transparent',
                color: 'var(--ink-tertiary)', cursor: 'pointer',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          <p style={{ fontSize: 14, color: 'var(--ink-subtle)', marginBottom: 24, lineHeight: 1.5 }}>
            Configure your own custom backend server and authentication keys. Leave blank to use the default official server.
          </p>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>
              Custom API URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="e.g. https://api.your-domain.workers.dev/api"
              style={{
                width: '100%', padding: '10px 14px',
                backgroundColor: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>
              Clerk Publishable Key
            </label>
            <input
              type="text"
              value={clerkKey}
              onChange={(e) => setClerkKey(e.target.value)}
              placeholder="e.g. pk_test_..."
              style={{
                width: '100%', padding: '10px 14px',
                backgroundColor: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              onClick={handleClear}
              style={{
                padding: '10px 16px',
                background: 'none', border: 'none', color: 'var(--ink-subtle)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                borderRadius: 'var(--radius-md)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Clear Settings
            </button>

            <button
              onClick={handleSave}
              style={{
                backgroundColor: 'var(--brand)', color: 'white',
                border: 'none', padding: '10px 24px', borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Save & Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
