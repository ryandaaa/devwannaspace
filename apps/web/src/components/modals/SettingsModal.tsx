import React from 'react';
import { X, Moon, Sun, Check, Palette, User, Keyboard, Settings, Minus, Square, Server } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onSelectTheme: (newTheme: string) => void;
  customThemeColors: any;
  setCustomThemeColors: (colors: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  customThemeColors,
  setCustomThemeColors,
}) => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'account' | 'appearance' | 'general' | 'shortcuts' | 'selfhost'>('account');
  const [profileName, setProfileName] = React.useState(user?.name || '');
  const [profileAvatar, setProfileAvatar] = React.useState(user?.avatar || '');
  const [profilePassword, setProfilePassword] = React.useState(user?.password || '');
  const [isSaved, setIsSaved] = React.useState(false);
  const [windowStyle, setWindowStyle] = React.useState(() => localStorage.getItem('windowControlsStyle') || 'mac');
  const [apiUrl, setApiUrl] = React.useState(() => localStorage.getItem('devwannaspace_custom_api_url') || '');
  const [clerkKey, setClerkKey] = React.useState(() => localStorage.getItem('devwannaspace_custom_clerk_key') || '');

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
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{t('Settings')}</span>
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
              <span>{t('Account')}</span>
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
              <span>{t('Appearance')}</span>
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
              <span>{t('General')}</span>
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
              <span>{t('Shortcuts')}</span>
            </button>

            <button
              onClick={() => setActiveTab('selfhost')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', fontSize: 13, fontWeight: 500,
                color: activeTab === 'selfhost' ? 'var(--ink)' : 'var(--ink-subtle)',
                backgroundColor: activeTab === 'selfhost' ? 'var(--surface-2)' : 'transparent',
                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Server size={15} />
              <span>Custom Server</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            {activeTab === 'account' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  {t('MyAccount')}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 24 }}>
                  {t('AccountDesc')}
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
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{t('AvatarImage')}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-subtle)' }}>{t('AvatarDesc')}</div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 8 }}>
                      {t('DisplayName')}
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
                      {t('AvatarUrl')}
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
                      {t('Password')}
                    </label>
                    <input
                      type="password"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      placeholder={t('PasswordPlaceholder')}
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
                      {isSaved ? <><Check size={14} /> {t('Saved')}</> : t('SaveChanges')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  {t('InterfaceTheme')}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 20 }}>
                  {t('ThemeDesc')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { 
                      id: 'dark', label: t('DarkMode'), 
                      bg: '#010102', border: '#23252a', bar1: '#23252a', bar2: '#161619'
                    },
                    { 
                      id: 'light', label: t('LightMode'), 
                      bg: '#ffffff', border: '#e1e4e8', bar1: '#e1e4e8', bar2: '#f1f3f5'
                    },
                    { 
                      id: 'nord', label: t('NordMode'), 
                      bg: '#2e3440', border: '#4c566a', bar1: '#434c5e', bar2: '#4c566a'
                    },
                    { 
                      id: 'midnight', label: t('MidnightMode'), 
                      bg: '#000000', border: '#333333', bar1: '#222222', bar2: '#3b82f6'
                    },
                    { 
                      id: 'rose', label: t('RoseMode'), 
                      bg: '#1f1a1a', border: '#564343', bar1: '#382b2b', bar2: '#f43f5e'
                    },
                    { 
                      id: 'forest', label: t('ForestMode'), 
                      bg: '#16211a', border: '#466a51', bar1: '#293f31', bar2: '#10b981'
                    }
                  ].map(tItem => (
                    <div
                      key={tItem.id}
                      onClick={() => onSelectTheme(tItem.id as any)}
                      style={{
                        border: `1px solid ${theme === tItem.id ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                        backgroundColor: 'var(--surface-1)',
                        padding: 16,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{
                        height: 80,
                        backgroundColor: tItem.bg,
                        border: `1px solid ${tItem.border}`,
                        marginBottom: 12,
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}>
                        <div style={{ width: '40%', height: 8, backgroundColor: tItem.bar1 }} />
                        <div style={{ width: '80%', height: 6, backgroundColor: tItem.bar2 }} />
                        <div style={{ width: '60%', height: 6, backgroundColor: tItem.bar2 }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {tItem.id === 'light' ? (
                            <Sun size={16} style={{ color: theme === tItem.id ? 'var(--primary)' : 'var(--ink-subtle)' }} />
                          ) : (
                            <Moon size={16} style={{ color: theme === tItem.id ? 'var(--primary)' : 'var(--ink-subtle)' }} />
                          )}
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{tItem.label}</span>
                        </div>
                        {theme === tItem.id && (
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

                {/* Custom Theme Editor */}
                {theme === 'custom' && (
                  <div style={{ marginTop: 24, padding: 16, backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>{t('CustomPalette')}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        { key: 'canvas', label: t('Background') },
                        { key: 'surface1', label: t('CardSurface') },
                        { key: 'primary', label: t('AccentColor') },
                        { key: 'ink', label: t('TextColor') },
                      ].map(field => (
                        <div key={field.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: 'var(--ink-subtle)' }}>{field.label}</span>
                          <input 
                            type="color" 
                            value={customThemeColors[field.key] || '#000000'} 
                            onChange={e => setCustomThemeColors({ ...customThemeColors, [field.key]: e.target.value })}
                            style={{ 
                              width: 32, height: 32, padding: 0, border: '1px solid var(--hairline-strong)', 
                              borderRadius: '4px', cursor: 'pointer', background: 'none'
                            }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Window Controls Toggle */}
                {((window as any).runtime) && (
                  <div style={{ marginTop: 32, borderTop: '1px solid var(--hairline)', paddingTop: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                      {t('WindowControls')}
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 16 }}>
                      {t('WindowControlsDesc')}
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => {
                          setWindowStyle('mac');
                          localStorage.setItem('windowControlsStyle', 'mac');
                          window.dispatchEvent(new Event('windowControlsChanged'));
                        }}
                        style={{
                          flex: 1, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          backgroundColor: windowStyle === 'mac' ? 'var(--surface-2)' : 'var(--surface-1)',
                          border: `1px solid ${windowStyle === 'mac' ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                          borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        <div style={{ display: 'flex', gap: 4 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                        </div>
                        {t('MacStyle')}
                      </button>

                      <button
                        onClick={() => {
                          setWindowStyle('windows');
                          localStorage.setItem('windowControlsStyle', 'windows');
                          window.dispatchEvent(new Event('windowControlsChanged'));
                        }}
                        style={{
                          flex: 1, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          backgroundColor: windowStyle === 'windows' ? 'var(--surface-2)' : 'var(--surface-1)',
                          border: `1px solid ${windowStyle === 'windows' ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                          borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        <div style={{ display: 'flex', gap: 4, color: 'var(--ink-subtle)' }}>
                          <Minus size={12} />
                          <Square size={10} />
                          <X size={12} />
                        </div>
                        {t('WinStyle')}
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 32 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 10 }}>
                    {language === 'id' ? 'Skala Tampilan (Interface Zoom)' : 'Interface Scale (Zoom)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    {[75, 85, 90, 100, 110, 125, 150].map((z) => {
                      const currentZoom = parseInt(localStorage.getItem('devwannaspace_zoom') || '100', 10);
                      const isActive = currentZoom === z;
                      return (
                        <button
                          key={z}
                          onClick={() => {
                            localStorage.setItem('devwannaspace_zoom', z.toString());
                            document.body.style.zoom = `${z}%`;
                            window.dispatchEvent(new Event('devwannaspaceZoomChanged'));
                          }}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: isActive ? 'var(--primary)' : 'var(--surface-1)',
                            border: `1px solid ${isActive ? 'var(--primary)' : 'var(--hairline-strong)'}`,
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? '#fff' : 'var(--ink)',
                            fontSize: 12, fontWeight: 500, cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isActive ? '0 2px 8px rgba(94, 106, 210, 0.3)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-1)';
                          }}
                        >
                          {z}%
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 10, lineHeight: 1.5 }}>
                    {language === 'id'
                      ? 'Tips: Anda juga dapat menekan Ctrl + Putar Roda Mouse (atau Ctrl+ / Ctrl-) sewaktu-waktu di dalam aplikasi untuk merubah ukuran dengan kilat.'
                      : 'Tip: You can also hold Ctrl + Mouse Wheel scroll (or Ctrl+ / Ctrl-) anytime while using the app for fast scaling.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  {t('ProfileSettings')}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 20 }}>
                  {t('ProfileDesc')}
                </p>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>
                    {t('AppLanguage')}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
                    style={{
                      width: '100%', maxWidth: 240, padding: '8px 12px', background: 'var(--surface-1)',
                      border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)',
                      color: 'var(--ink)', fontSize: 13, outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="en">English (US)</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>

                <div style={{ padding: 16, border: '1px solid var(--hairline)', backgroundColor: 'var(--surface-1)', fontSize: 13, color: 'var(--ink-subtle)' }}>
                  Workspace: <strong>devwannaspace Local</strong>
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  {t('KbdShortcuts')}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 16 }}>
                  {t('KbdDesc')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--ink)' }}>{t('CmdPalette')}</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-subtle)' }}>⌘K / Ctrl+K</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--ink)' }}>{t('ToggleSidebar')}</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-subtle)' }}>⌘\ / Ctrl+\</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--hairline)' }}>
                    <span style={{ color: 'var(--ink)' }}>{t('SlashCommandsTitle')}</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-subtle)' }}>/</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'selfhost' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Self-Host / Custom Server
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 24 }}>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      localStorage.removeItem('devwannaspace_custom_api_url');
                      localStorage.removeItem('devwannaspace_custom_clerk_key');
                      window.location.reload();
                    }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--ink-subtle)',
                      fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 12px',
                      borderRadius: 'var(--radius-md)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Reset to Default
                  </button>

                  <button
                    onClick={() => {
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
                      
                      window.location.reload();
                    }}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
