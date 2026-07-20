import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import {
  ChevronRight, Star, Share2, MoreHorizontal,
  Menu, Settings, Bell, Download, Sun, Moon, Clock
} from 'lucide-react';
import type { Page, Project, NotificationItem } from '../../types';
import { PageIcon } from '../ui/PageIcon';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeSyncStatus, type SyncStatus } from '../../lib/api';
import { Cloud, CloudUpload, CloudOff } from 'lucide-react';

const jsonToMarkdown = (node: any): string => {
  if (!node) return '';
  if (node.type === 'doc') {
    return (node.content || []).map(jsonToMarkdown).join('\n\n');
  }
  if (node.type === 'heading') {
    const level = node.attrs?.level || 1;
    const hashes = '#'.repeat(level);
    const text = (node.content || []).map(jsonToMarkdown).join('');
    return `${hashes} ${text}`;
  }
  if (node.type === 'paragraph') {
    return (node.content || []).map(jsonToMarkdown).join('');
  }
  if (node.type === 'text') {
    let text = node.text || '';
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === 'bold') text = `**${text}**`;
        if (mark.type === 'italic') text = `*${text}*`;
        if (mark.type === 'code') text = `\`${text}\``;
      });
    }
    return text;
  }
  if (node.type === 'bulletList') {
    return (node.content || []).map((item: any) => `* ${jsonToMarkdown(item)}`).join('\n');
  }
  if (node.type === 'orderedList') {
    return (node.content || []).map((item: any, idx: number) => `${idx + 1}. ${jsonToMarkdown(item)}`).join('\n');
  }
  if (node.type === 'listItem' || node.type === 'taskItem') {
    return (node.content || []).map(jsonToMarkdown).join('\n  ');
  }
  if (node.type === 'taskList') {
    return (node.content || []).map((item: any) => `- [${item.attrs?.checked ? 'x' : ' '}] ${jsonToMarkdown(item)}`).join('\n');
  }
  if (node.type === 'blockquote') {
    return `> ${(node.content || []).map(jsonToMarkdown).join('\n> ')}`;
  }
  if (node.type === 'codeBlock') {
    const text = (node.content || []).map((item: any) => item.text || '').join('\n');
    return `\`\`\`${node.attrs?.language || ''}\n${text}\n\`\`\``;
  }
  if (node.type === 'horizontalRule') {
    return '---';
  }
  if (node.type === 'callout') {
    const text = (node.content || []).map(jsonToMarkdown).join('\n');
    return `> 💡 ${text}`;
  }
  return '';
};

interface TopBarProps {
  currentPage: Page | null;
  allPages: Page[];
  projects: Project[];
  onSelectPage: (id: string) => void;
  onUpdatePage: (id: string, updates: Partial<Page>) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePage: (id: string) => void;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  isSidebarOpen?: boolean;
  onSelectProject: (id: string) => void;
  theme: string;
  onToggleTheme: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onOpenHistory: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage, allPages, projects,
  onSelectPage, onUpdatePage, onToggleFavorite, onDeletePage,
  onToggleSidebar, onOpenSettings, isSidebarOpen: _isSidebarOpen,
  onSelectProject, theme, onToggleTheme, notifications, onMarkAllAsRead,
  onOpenHistory
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    return subscribeSyncStatus(status => setSyncStatus(status));
  }, []);

  /* Build breadcrumb chain */
  const breadcrumbs: Page[] = [];
  let node: Page | undefined = currentPage ?? undefined;
  while (node) {
    breadcrumbs.unshift(node);
    node = allPages.find((p) => p.id === node!.parentId);
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header style={{
      height: 56, flexShrink: 0, /* Taller header for Linear */
      backgroundColor: 'var(--main-panel)',
      borderBottom: '1px solid var(--hairline)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      gap: 12,
      position: 'relative',
      zIndex: 20,
    }}>
      {/* Sidebar toggle - Hamburger Menu */}
      <IconBtn onClick={onToggleSidebar} title="Toggle sidebar (⌘\)">
        <Menu size={16} />
      </IconBtn>

      {/* Breadcrumb */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        gap: 6, overflow: 'hidden', minWidth: 0,
        fontSize: 14,
      }}>
        <span style={{ color: 'var(--ink)', whiteSpace: 'nowrap', fontWeight: 600 }}>devwannaspace</span>
        
        {currentPage?.projectId && projects.find(p => p.id === currentPage.projectId) && (
          <React.Fragment>
            <ChevronRight size={12} style={{ color: 'var(--ink-tertiary)', flexShrink: 0 }} />
            <button
              onClick={() => onSelectProject(currentPage.projectId!)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 6px', display: 'flex', alignItems: 'center',
                color: 'var(--ink-subtle)', fontWeight: 500, fontSize: 13,
                whiteSpace: 'nowrap', borderRadius: 'var(--radius-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)';
                e.currentTarget.style.backgroundColor = 'var(--surface-1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ink-subtle)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {projects.find(p => p.id === currentPage.projectId)!.name}
            </button>
          </React.Fragment>
        )}

        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.id}>
              <ChevronRight size={12} style={{ color: 'var(--ink-tertiary)', flexShrink: 0 }} />
              <button
                onClick={() => onSelectPage(crumb.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 6,
                  color: isLast ? 'var(--ink)' : 'var(--ink-subtle)',
                  fontWeight: 500,
                  fontSize: 14, whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220,
                  borderRadius: 'var(--radius-sm)'
                }}
                onMouseEnter={(e) => { 
                  if (!isLast) e.currentTarget.style.color = 'var(--ink)'; 
                  e.currentTarget.style.backgroundColor = 'var(--surface-1)';
                }}
                onMouseLeave={(e) => { 
                  if (!isLast) e.currentTarget.style.color = 'var(--ink-subtle)'; 
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <PageIcon name={crumb.icon} size={14} color={isLast ? 'var(--ink)' : 'var(--ink-subtle)'} />
                <span>{crumb.title || 'Untitled'}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {currentPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          <IconBtn
            onClick={() => onToggleFavorite(currentPage.id)}
            title={currentPage.isFavorite ? 'Remove favorite' : 'Add to favorites'}
            style={{ color: currentPage.isFavorite ? 'var(--tag-yellow)' : undefined }}
          >
            <Star
              size={16}
              fill={currentPage.isFavorite ? 'var(--tag-yellow)' : 'none'}
            />
          </IconBtn>

          {/* Project Selector */}
          {currentPage && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                style={{
                  height: 32, padding: '0 10px',
                  fontSize: 13, fontWeight: 500,
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  color: currentPage.projectId ? (projects.find(p => p.id === currentPage.projectId)?.color || 'var(--ink)') : 'var(--ink-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {currentPage.projectId ? projects.find(p => p.id === currentPage.projectId)?.name || 'Project' : '+ Add to Project'}
              </button>

              {projectMenuOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 4,
                  width: 200, backgroundColor: 'var(--surface-1)',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                  zIndex: 50, padding: 4
                }}>
                  <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--ink-subtle)', textTransform: 'uppercase' }}>
                    Select Project
                  </div>
                  {currentPage.projectId && (
                    <button
                      onClick={() => { onUpdatePage(currentPage.id, { projectId: undefined }); setProjectMenuOpen(false); }}
                      style={{
                        width: '100%', padding: '8px 12px', textAlign: 'left',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, color: 'var(--tag-red)', display: 'block',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Remove from Project
                    </button>
                  )}
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { onUpdatePage(currentPage.id, { projectId: p.id }); setProjectMenuOpen(false); }}
                      style={{
                        width: '100%', padding: '8px 12px', textAlign: 'left',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8,
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: p.color }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Share CTA */}
          <IconBtn
            onClick={handleShare}
            title={copied ? 'Copied!' : 'Share'}
            style={{ color: copied ? 'var(--success)' : undefined }}
          >
            <Share2 size={16} />
          </IconBtn>

          {/* More menu */}
          <div style={{ position: 'relative' }}>
            <IconBtn
              title="More options"
              onClick={() => setMoreOpen((o) => !o)}
            >
              <MoreHorizontal size={16} />
            </IconBtn>

            {moreOpen && (
              <>
                <div 
                  onClick={() => setMoreOpen(false)}
                  style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99
                  }}
                />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 4,
                  backgroundColor: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-md)', padding: '4px 0', minWidth: 140,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100
                }}>
                  <button
                    onClick={() => {
                      if (currentPage) {
                        const md = jsonToMarkdown(currentPage.content);
                        navigator.clipboard.writeText(md);
                        alert('Copied page content as Markdown!');
                      }
                      setMoreOpen(false);
                    }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: 13,
                      textAlign: 'left', border: 'none', background: 'none',
                      color: 'var(--ink-subtle)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                      e.currentTarget.style.color = 'var(--ink)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--ink-subtle)';
                    }}
                  >
                    <Share2 size={14} /> Copy as Markdown
                  </button>
                  <button
                    onClick={() => {
                      if (currentPage) {
                        const md = jsonToMarkdown(currentPage.content);
                        const blob = new Blob([md], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${currentPage.title || 'untitled'}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                      setMoreOpen(false);
                    }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: 13,
                      textAlign: 'left', border: 'none', background: 'none',
                      color: 'var(--ink-subtle)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                      e.currentTarget.style.color = 'var(--ink)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--ink-subtle)';
                    }}
                  >
                    <Download size={14} /> Download as .md
                  </button>
                  <button
                    onClick={() => {
                      onOpenHistory();
                      setMoreOpen(false);
                    }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: 13,
                      textAlign: 'left', border: 'none', background: 'none',
                      color: 'var(--ink-subtle)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                      e.currentTarget.style.color = 'var(--ink)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--ink-subtle)';
                    }}
                  >
                    <Clock size={14} /> Version history
                  </button>
                  <div style={{ height: 1, backgroundColor: 'var(--hairline-strong)', margin: '4px 0' }} />
                  <button
                    onClick={() => {
                      onDeletePage(currentPage.id);
                      setMoreOpen(false);
                    }}
                    style={{
                      width: '100%', padding: '8px 12px', fontSize: 13,
                      textAlign: 'left', border: 'none', background: 'none',
                      color: 'var(--tag-red, #ff4d4f)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={14} /> Delete page
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

            {/* Sync Status Indicator */}
          {syncStatus !== 'idle' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 8px', height: 32,
              fontSize: 12, fontWeight: 500,
              color: syncStatus === 'error' ? 'var(--tag-red)' : 'var(--ink-subtle)',
              transition: 'all 0.3s ease',
              opacity: 1,
            }}>
              {syncStatus === 'saving' && <CloudUpload size={14} className="nb-spin-slow" />}
              {syncStatus === 'saved' && <Cloud size={14} style={{ color: 'var(--tag-green)' }} />}
              {syncStatus === 'error' && <CloudOff size={14} />}
              <span>
                {syncStatus === 'saving' ? 'Saving...' : syncStatus === 'saved' ? 'Saved to Neon' : 'Sync Error'}
              </span>
            </div>
          )}

          {/* Settings button */}
          <IconBtn onClick={onOpenSettings} title="Settings">
            <Settings size={16} />
          </IconBtn>

          {/* Theme Toggle */}
          <IconBtn
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </IconBtn>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <IconBtn onClick={() => setNotifOpen(!notifOpen)} title="Notifications">
              <Bell size={16} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--tag-red, #ff4d4f)',
                  border: '2px solid var(--surface-1)'
                }} />
              )}
            </IconBtn>

            {notifOpen && (
              <>
                <div 
                  onClick={() => setNotifOpen(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 4,
                  width: 280, backgroundColor: 'var(--surface-1)',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 100, padding: 8,
                  maxHeight: 320, overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 8px', borderBottom: '1px solid var(--hairline)', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => { onMarkAllAsRead(); setNotifOpen(false); }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 500, cursor: 'pointer', padding: 0 }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 8px', textAlign: 'center', fontSize: 12, color: 'var(--ink-tertiary)' }}>
                      No new notifications
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {notifications.map(n => (
                        <div 
                          key={n.id}
                          style={{
                            padding: '8px', borderRadius: 'var(--radius-sm)',
                            backgroundColor: n.isRead ? 'transparent' : 'var(--surface-2)',
                            fontSize: 12, display: 'flex', flexDirection: 'column', gap: 2,
                            position: 'relative'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--ink)', paddingRight: 12 }}>{n.title}</div>
                          <div style={{ color: 'var(--ink-subtle)' }}>{n.message}</div>
                          <span style={{ fontSize: 10, color: 'var(--ink-tertiary)' }}>
                            {new Date(n.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>



        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', marginLeft: 4, border: '1px solid var(--hairline)' }} />
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 4 }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
      </div>
    </header>
  );
};

/* Reusable icon button */
const IconBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children, style, ...rest
}) => (
  <button
    {...rest}
    style={{
      background: 'none', border: 'none',
      color: 'var(--ink-subtle)',
      width: 32, height: 32,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', borderRadius: 'var(--radius-md)',
      transition: 'background 0.08s ease, color 0.08s ease',
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
      e.currentTarget.style.color = 'var(--ink)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = style?.color ?? 'var(--ink-subtle)';
    }}
  >
    {children}
  </button>
);
