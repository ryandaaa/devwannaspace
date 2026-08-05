import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SignedIn, SignedOut, SignIn, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setTokenGetter } from './lib/api';
import React, { useEffect, useState } from 'react';
import { DesktopTitleBar } from './components/layout/DesktopTitleBar';
import { LanguageProvider } from './contexts/LanguageContext';
import { SelfHostSettings } from './components/modals/SelfHostSettings';
import { NoInternetScreen } from './components/ui/NoInternetScreen';
import { Server } from 'lucide-react';
import './App.css';

const ApiConfigurator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken } = useClerkAuth();
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isSelfHostOpen, setIsSelfHostOpen] = useState(false);
  const [isWails, setIsWails] = useState(false);
  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem('devwannaspace_zoom');
    return saved ? parseInt(saved, 10) : 100;
  });
  const [showZoomToast, setShowZoomToast] = useState(false);
  const zoomTimeoutRef = React.useRef<any>(null);

  useEffect(() => {
    let retries = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const check = () => {
      if (typeof window !== 'undefined' && ((window as any).go || (window as any).runtime)) {
        setIsWails(true);
        return;
      }
      if (retries < 20) {
        retries++;
        timer = setTimeout(check, 50);
      }
    };
    check();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const checkAndRestoreSession = async () => {
      if (window.location.search) return;

      // Ensure Wails bindings have time to initialize when running inside the desktop app
      let attempts = 0;
      while (!(window as any).go?.main?.App && attempts < 15) {
        await new Promise((r) => setTimeout(r, 50));
        if (isCancelled) return;
        attempts++;
      }

      let savedQuery = localStorage.getItem('devwannaspace_clerk_query');
      if (!savedQuery && (window as any).go?.main?.App?.GetSession) {
        try {
          savedQuery = await (window as any).go?.main?.App?.GetSession();
        } catch (e) {
          // No saved session found on disk
        }
      }

      if (savedQuery && !isCancelled) {
        const cleanQuery = savedQuery.replace(/^\?/, '');
        console.log('Restoring saved session query:', cleanQuery);
        localStorage.setItem('devwannaspace_clerk_query', cleanQuery);
        window.location.replace(`/?${cleanQuery}`);
      }
    };

    checkAndRestoreSession();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.zoom = `${zoom}%`;
    localStorage.setItem('devwannaspace_zoom', zoom.toString());
  }, [zoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+' || e.code === 'NumpadAdd') {
          e.preventDefault();
          updateZoom((prev) => Math.min(prev + 10, 200));
        } else if (e.key === '-' || e.key === '_' || e.code === 'NumpadSubtract') {
          e.preventDefault();
          updateZoom((prev) => Math.max(prev - 10, 50));
        } else if (e.key === '0' || e.code === 'Numpad0') {
          e.preventDefault();
          updateZoom(100);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          updateZoom((prev) => Math.min(prev + 5, 200));
        } else if (e.deltaY > 0) {
          updateZoom((prev) => Math.max(prev - 5, 50));
        }
      }
    };

    const updateZoom = (updater: ((prev: number) => number) | number) => {
      setZoom((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (next !== prev) {
          setShowZoomToast(true);
          if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
          zoomTimeoutRef.current = setTimeout(() => setShowZoomToast(false), 2000);
        }
        return next;
      });
    };

    const handleZoomSync = () => {
      const saved = localStorage.getItem('devwannaspace_zoom');
      if (saved) setZoom(parseInt(saved, 10));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('devwannaspaceZoomChanged', handleZoomSync);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('devwannaspaceZoomChanged', handleZoomSync);
    };
  }, []);

  return (
    <ErrorBoundary>
      <NoInternetScreen />
      {showZoomToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100000,
          backgroundColor: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
          color: 'var(--ink)', padding: '6px 14px', borderRadius: 'var(--radius-pill)',
          fontSize: 12, fontWeight: 600, boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
          pointerEvents: 'none', transition: 'opacity 0.2s ease', display: 'flex', alignItems: 'center', gap: 6
        }}>
          <span>Zoom: {zoom}%</span>
          {zoom !== 100 && <span style={{ color: 'var(--ink-subtle)', fontSize: 11, fontWeight: 400 }}>| Ctrl+0 reset</span>}
        </div>
      )}
      <LanguageProvider>
        <ApiConfigurator>
          <AuthProvider>
            <div style={{
              display: 'flex', flexDirection: 'column',
              height: navigator.userAgent.includes('Windows') ? `${100 / (zoom / 100)}vh` : '100vh',
              width: navigator.userAgent.includes('Windows') ? `${100 / (zoom / 100)}vw` : '100vw',
              overflow: 'hidden',
              boxSizing: 'border-box',
              border: isWails ? '1px solid var(--hairline-strong)' : 'none',
              backgroundColor: 'var(--canvas)'
            }}>
              <DesktopTitleBar />
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <SignedIn>
                  <AppShell />
                </SignedIn>
                <SignedOut>
                  <div style={{
                    display: 'flex', flex: 1, flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'var(--canvas)', position: 'relative', padding: 20
                  }}>
                    {isWails ? (
                      <div style={{
                        width: '100%', maxWidth: 360, padding: '36px 32px',
                        backgroundColor: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
                        borderRadius: 'var(--radius-xl)', boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
                        textAlign: 'center'
                      }}>
                        <div style={{ marginBottom: 20 }}>
                          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.4px' }}>
                            devwannaspace
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 24, lineHeight: 1.5 }}>
                          Sign in via your system browser to continue to your workspace.
                        </p>
                        <button
                          onClick={() => {
                            const wailsLogin = (window as any).go?.main?.App?.StartExternalLogin;
                            if (wailsLogin) {
                              const clerkDomain = "https://golden-mole-61.accounts.dev";
                              const callbackUrl = encodeURIComponent("http://localhost:34567/callback");
                              const signInUrl = `${clerkDomain}/sign-in?redirect_url=${callbackUrl}`;
                              wailsLogin(signInUrl).then((query: string) => {
                                if (query) {
                                  localStorage.setItem('devwannaspace_clerk_query', query);
                                  const saveSession = (window as any).go?.main?.App?.SaveSession;
                                  if (saveSession) {
                                    saveSession(query).catch((e: any) => console.error("Gagal menyimpan sesi ke disk:", e));
                                  }
                                }
                                if ((window as any).runtime?.WindowShow) {
                                  (window as any).runtime.WindowShow();
                                  (window as any).runtime.WindowUnminimise();
                                }
                                window.location.href = `/?${query}`;
                              }).catch((e: any) => console.error(e));
                            }
                          }}
                          style={{
                            width: '100%', padding: '10px 16px', background: 'var(--primary)', color: '#fff',
                            border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                        >
                          Continue in Browser
                        </button>
                      </div>
                    ) : (
                      <SignIn />
                    )}
                    
                    <button
                      onClick={() => setIsSelfHostOpen(true)}
                      style={{
                        position: 'absolute', bottom: 32,
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', cursor: 'pointer',
                        color: 'var(--ink-subtle)', fontSize: 13, fontWeight: 500,
                        padding: '8px 16px', borderRadius: 'var(--radius-full)',
                        transition: 'all 0.2s ease', backgroundColor: 'var(--surface-1)',
                        border: '1px solid var(--hairline)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.backgroundColor = 'var(--surface-2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-subtle)'; e.currentTarget.style.backgroundColor = 'var(--surface-1)'; }}
                    >
                      <Server size={16} />
                      Custom Server / Self-Host
                    </button>
                    <SelfHostSettings isOpen={isSelfHostOpen} onClose={() => setIsSelfHostOpen(false)} />
                  </div>
                </SignedOut>
              </div>
            </div>
          </AuthProvider>
        </ApiConfigurator>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
