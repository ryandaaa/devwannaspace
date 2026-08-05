import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './styles/tokens.css';
import './styles/editor.css';
import App from './App.tsx';

import { SelfHostSettings } from './components/modals/SelfHostSettings';

const PUBLISHABLE_KEY = localStorage.getItem('devwannaspace_custom_clerk_key') || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const isValidClerkKey = typeof PUBLISHABLE_KEY === 'string' && 
  (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_')) &&
  PUBLISHABLE_KEY.length > 30;

if (!isValidClerkKey) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--canvas)', color: 'var(--ink)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Welcome to DevWannaSpace</h1>
          <p style={{ color: 'var(--ink-secondary)' }}>Please configure your Self-Host settings to continue.</p>
        </div>
        <SelfHostSettings isOpen={true} onClose={() => {}} isMandatory={true} />
      </div>
    </StrictMode>
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>
  );
}
