import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const NoInternetScreen: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--canvas)',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      textAlign: 'center'
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: 'var(--surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        color: 'var(--ink-subtle)',
        border: '1px solid var(--hairline-strong)'
      }}>
        <WifiOff size={32} />
      </div>
      
      <h1 style={{
        fontSize: 24,
        fontWeight: 600,
        color: 'var(--ink)',
        marginBottom: 8,
        letterSpacing: '-0.5px'
      }}>
        No Internet Connection
      </h1>
      
      <p style={{
        fontSize: 15,
        color: 'var(--ink-subtle)',
        maxWidth: 360,
        marginBottom: 32,
        lineHeight: 1.5
      }}>
        DevWannaSpace requires an active internet connection to sync your workspace securely. Please check your network and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          backgroundColor: 'var(--ink)',
          color: 'var(--canvas)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'opacity 0.1s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <RefreshCw size={16} />
        Retry Connection
      </button>
    </div>
  );
};
