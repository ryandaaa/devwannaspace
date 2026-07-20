import React from 'react';
import { X, Moon, Sun, Check, Palette, User, Keyboard, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onSelectTheme: (newTheme: 'dark' | 'light') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
}) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'account' | 'appearance' | 'general' | 'shortcuts'>('account');
  const [profileName, setProfileName] = React.useState(user?.name || '');
  const [profileAvatar, setProfileAvatar] = React.useState(user?.avatar || '');
  const [profilePassword, setProfilePassword] = React.useState(user?.password || '');
  const [isSaved, setIsSaved] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="nb-modal-overlay"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'var(--overlay)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="nb-modal-card"
        style={{
          width: '100%',
          maxWidth: 680,
          height: 480,
          backgroundColor: 'var(--canvas)',
          border: '1px solid var(--hairline-strong)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          height: 48,
          borderBottom: '1px solid var(--hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Settings</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Inner Sidebar */}
          <div style={{
            width: 180,
            borderRight: '1px solid var(--hairline)',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'var(--surface-1)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setActiveTab('account')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', fontSize: 13, fontWeight: 500,
                color: activeTab === 'account' ? 'var(--ink)' : 'var(--ink-subtle)',
                backgroundColor: activeTab === 'account' ? 'var(--surface-2)' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <User size={15} />
              <span>Account</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', fontSize: 13, fontWeight: 500,
                color: activeTab === 'appearance' ? 'var(--ink)' : 'var(--ink-subtle)',
                backgroundColor: activeTab === 'appearance' ? 'var(--surface-2)' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Palette size={15} />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab('general')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', fontSize: 13, fontWeight: 500,
                color: activeTab === 'general' ? 'var(--ink)' : 'var(--ink-subtle)',
                backgroundColor: activeTab === 'general' ? 'var(--surface-2)' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Settings size={15} />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('shortcuts')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', fontSize: 13, fontWeight: 500,
                color: activeTab === 'shortcuts' ? 'var(--ink)' : 'var(--ink-subtle)',
                backgroundColor: activeTab === 'shortcuts' ? 'var(--surface-2)' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Keyboard size={15} />
              <span>Shortcuts</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            {activeTab === 'account' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  My Account
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 24 }}>
                  Manage your personal profile and preferences.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Profile" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--hairline)' }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                        {profileName.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>Avatar Image</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-subtle)' }}>Enter a custom image URL below to update.</div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 8 }}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={{
                        width: '100%', maxWidth: 360, padding: '8px 12px', background: 'var(--surface-1)',
                        border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)',
                        color: 'var(--ink)', fontSize: 14, outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 8 }}>
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: '100%', maxWidth: 360, padding: '8px 12px', background: 'var(--surface-1)',
                        border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)',
                        color: 'var(--ink)', fontSize: 14, outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 8 }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      placeholder="Leave blank to remove password"
                      style={{
                        width: '100%', maxWidth: 360, padding: '8px 12px', background: 'var(--surface-1)',
                        border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)',
                        color: 'var(--ink)', fontSize: 14, outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
                    />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button
                      onClick={() => {
                        updateUser({ name: profileName, avatar: profileAvatar, password: profilePassword });
                        setIsSaved(true);
                        setTimeout(() => setIsSaved(false), 2000);
                      }}
                      disabled={isSaved}
                      style={{
                        padding: '8px 16px', background: isSaved ? 'var(--tag-green)' : 'var(--primary)', color: '#fff',
                        border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                        cursor: isSaved ? 'default' : 'pointer', transition: 'background 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content'
                      }}
                      onMouseEnter={(e) => { if(!isSaved) e.currentTarget.style.background = 'var(--primary-hover)'; }}
                      onMouseLeave={(e) => { if(!isSaved) e.currentTarget.style.background = 'var(--primary)'; }}
                    >
                      {isSaved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Interface Theme
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 20 }}>
                  Choose how devwannaspace looks on your screen.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { 
                      id: 'dark', label: 'Dark Mode', 
                      bg: '#010102', border: '#23252a', bar1: '#23252a', bar2: '#161619'
                    },
                    { 
                      id: 'light', label: 'Light Mode', 
                      bg: '#ffffff', border: '#e1e4e8', bar1: '#e1e4e8', bar2: '#f1f3f5'
                    },
                    { 
                      id: 'nord', label: 'Nord Theme', 
                      bg: '#2e3440', border: '#4c566a', bar1: '#434c5e', bar2: '#4c566a'
                    },
                  ].map(t => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTheme(t.id as any)}
                      style={{
                        border: `1px solid ${theme === t.id ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                        backgroundColor: 'var(--surface-1)',
                        padding: 16,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{
                        height: 80,
                        backgroundColor: t.bg,
                        border: `1px solid ${t.border}`,
                        marginBottom: 12,
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}>
                        <div style={{ width: '40%', height: 8, backgroundColor: t.bar1 }} />
                        <div style={{ width: '80%', height: 6, backgroundColor: t.bar2 }} />
                        <div style={{ width: '60%', height: 6, backgroundColor: t.bar2 }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {t.id === 'light' ? (
                            <Sun size={16} style={{ color: theme === t.id ? 'var(--primary)' : 'var(--ink-subtle)' }} />
                          ) : (
                            <Moon size={16} style={{ color: theme === t.id ? 'var(--primary)' : 'var(--ink-subtle)' }} />
                          )}
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{t.label}</span>
                        </div>
                        {theme === t.id && (
                          <div style={{
                            width: 18, height: 18, backgroundColor: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Check size={12} color="#fff" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  General Preferences
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 16 }}>
                  Manage workspace configurations and editor options.
                </p>
                <div style={{ padding: 16, border: '1px solid var(--hairline)', backgroundColor: 'var(--surface-1)', fontSize: 13, color: 'var(--ink-subtle)' }}>
                  Workspace: <strong>devwannaspace Local</strong>
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Keyboard Shortcuts
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 16 }}>
                  Quick reference for keyboard navigation.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--ink)' }}>Command Palette</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-subtle)' }}>⌘K / Ctrl+K</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--ink)' }}>Toggle Sidebar</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-subtle)' }}>⌘\ / Ctrl+\</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--ink)' }}>Slash Commands</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-subtle)' }}>/</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
