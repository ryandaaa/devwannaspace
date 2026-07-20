import React, { useState } from 'react';
import {
  CheckSquare, Archive, Settings,
  Search, Plus, ChevronDown, ChevronRight, FileText,
  Star, Layers, Trash2, LogOut
} from 'lucide-react';
import type { Page, Project, Issue, ViewState } from '../../types';
import { KbdHint } from '../ui/KbdHint';
import { PageTreeItem } from './PageTreeItem';
import { PageIcon } from '../ui/PageIcon';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  pages: Page[];
  projects: Project[];
  issues: Issue[];
  activePageId: string | null;
  currentView: ViewState;
  isOpen: boolean;
  width: number;
  isResizing: boolean;
  onSelectPage: (id: string) => void;
  onSelectView: (view: ViewState) => void;
  onCreatePage: (parentId?: string) => void;
  onCreateProject: () => void;
  onDeletePage: (id: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenTrash: () => void;
  onMouseDownResize: (e: React.MouseEvent) => void;
}

const NAV_ITEMS = [
  { id: 'my',       icon: CheckSquare, label: 'My Issues',    count: null },
  { id: 'all',      icon: Archive,     label: 'Pages',        count: null },
];

export const Sidebar: React.FC<SidebarProps> = ({
  pages, projects, issues, activePageId, currentView, isOpen, width, isResizing,
  onSelectPage, onSelectView, onCreatePage, onCreateProject, onDeletePage, onOpenCommandPalette,
  onOpenSettings, onOpenTrash, onMouseDownResize,
}) => {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [wsHovered, setWsHovered] = useState(false);
  const [wsMenuOpen, setWsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const rootPages = pages.filter((p) => !p.parentId && !p.isDeleted);
  const favoritePages = pages.filter((p) => p.isFavorite && !p.isDeleted);

  const myIssuesCount = issues.filter(i => i.status !== 'Done' && i.status !== 'Canceled').length;

  const handleNavClick = (id: string) => {
    if (id === 'my') onSelectView({ type: 'my_issues' });
    else if (id === 'all') onSelectView({ type: 'all_pages' });
  };

  return (
    <aside style={{
      width: isOpen ? width : 0,
      minWidth: isOpen ? width : 0,
      height: '100%',
      backgroundColor: 'var(--canvas)',
      borderRight: isOpen ? '1px solid var(--hairline)' : '0px solid transparent',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
      transition: isResizing ? 'none' : 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>

      {/* Resizer Handle */}
      {isOpen && (
        <div
          className="nb-sidebar-resizer"
          onMouseDown={onMouseDownResize}
          title="Drag to resize sidebar"
        />
      )}

      {/* Wails Traffic Light Spacer */}
      <div style={{ height: 12, flexShrink: 0, WebkitAppRegion: 'drag' } as any} />

      {/* ── 1. Workspace Switcher ── */}
      <div style={{ padding: '4px 14px 12px 18px', position: 'relative' }}>
        <div
          onMouseEnter={() => setWsHovered(true)}
          onMouseLeave={() => setWsHovered(false)}
          onClick={() => setWsMenuOpen(!wsMenuOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', width: '100%',
            backgroundColor: wsHovered || wsMenuOpen ? 'var(--surface-1)' : 'transparent',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            transition: 'background 0.1s ease',
          }}
        >
          <span style={{
            flex: 1, fontSize: 14, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.1px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.name}'s Workspace
          </span>
          <ChevronDown size={14} style={{ color: 'var(--ink-tertiary)', flexShrink: 0 }} />
        </div>

        {wsMenuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setWsMenuOpen(false)} />
            <div style={{
              position: 'fixed', top: 48, left: 20, width: 240,
              backgroundColor: 'var(--surface-1)', border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 101, padding: 4, display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--hairline)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-subtle)' }}>{user?.email}</div>
              </div>
              <button 
                onClick={() => { setWsMenuOpen(false); onOpenSettings(); }}
                style={{ padding: '6px 12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--ink)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings size={14} /> Account Settings
              </button>
              <button 
                onClick={() => { setWsMenuOpen(false); logout(); }}
                style={{ padding: '6px 12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--tag-red, #ff4d4f)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── 2. Search / ⌘K ── */}
      <div style={{ padding: '0 14px 16px' }}>
        <button
          onClick={onOpenCommandPalette}
          style={{
            width: '100%', height: 32,
            backgroundColor: 'var(--surface-1)',
            border: '1px solid var(--hairline-tertiary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center',
            padding: '0 10px', gap: 8,
            color: 'var(--ink-subtle)',
            transition: 'border 0.1s ease, color 0.1s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--hairline-strong)';
            e.currentTarget.style.color = 'var(--ink)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--hairline-tertiary)';
            e.currentTarget.style.color = 'var(--ink-subtle)';
          }}
        >
          <Search size={14} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>Search</span>
          <KbdHint>Ctrl K</KbdHint>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── 3. Primary Nav ── */}
        <div style={{ marginBottom: 16 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView.type === (item.id === 'my' ? 'my_issues' : item.id === 'all' ? 'all_pages' : item.id);
            const count = item.id === 'my' ? myIssuesCount : item.count;
            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nb-sidebar-item${isActive ? ' active' : ''}`}
              >
                <Icon size={16} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {count !== null && count > 0 && (
                  <span style={{
                    fontSize: 12, fontFamily: 'var(--mono)',
                    color: 'var(--ink-tertiary)',
                  }}>{count}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 4. FAVORITES ── */}
        {favoritePages.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <SectionLabel icon={<Star size={12} />} label="Favorites" />
            {favoritePages.map((page) => (
              <div
                key={`fav-${page.id}`}
                onClick={() => onSelectPage(page.id)}
                className={`nb-sidebar-item${activePageId === page.id ? ' active' : ''}`}
              >
                <PageIcon name={page.icon} size={15} color={activePageId === page.id ? 'var(--sidebar-active-color)' : 'var(--ink-subtle)'} />
                <span style={{
                  flex: 1, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14,
                }}>
                  {page.title || 'Untitled'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── 5. Projects ── */}
        <div style={{ marginBottom: 12 }}>
          <SectionLabel
            icon={<Layers size={12} />}
            label="Projects"
            action={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => onCreateProject()}
                  style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', padding: 0, cursor: 'pointer', display: 'flex' }}
                  title="New Project"
                >
                  <Plus size={12} />
                </button>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', padding: 0, cursor: 'pointer', display: 'flex' }}
                  onClick={() => setProjectsOpen(!projectsOpen)}
                >
                  <ChevronRight size={12} style={{ transform: projectsOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }} />
                </button>
              </div>
            }
          />
          {projectsOpen && (
            <>
              {projects.map(project => (
                <SidebarProjectItem 
                  key={project.id}
                  dot={project.color} 
                  name={project.name} 
                  count={issues.filter(i => i.projectId === project.id && i.status !== 'Done' && i.status !== 'Canceled').length}
                  isActive={currentView.type === 'project' && currentView.id === project.id}
                  onClick={() => onSelectView({ type: 'project', id: project.id })}
                />
              ))}
            </>
          )}
        </div>

        {/* ── 7. PAGES ── */}
        <div style={{ flex: 1, marginBottom: 12 }}>
          <SectionLabel
            icon={<FileText size={12} />}
            label="Pages"
            action={
              <button
                onClick={() => onCreatePage()}
                style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', padding: 0, cursor: 'pointer', display: 'flex' }}
                title="New page"
              >
                <Plus size={12} />
              </button>
            }
          />
          {rootPages.length === 0 ? (
            <div style={{ padding: '8px 10px 8px 18px', fontSize: 13, color: 'var(--ink-tertiary)' }}>
              No pages yet
            </div>
          ) : (
            rootPages.map((page) => (
              <PageTreeItem
                key={page.id}
                page={page}
                allPages={pages}
                activePageId={activePageId}
                depth={0}
                onSelectPage={onSelectPage}
                onCreatePage={onCreatePage}
                onDeletePage={onDeletePage}
              />
            ))
          )}
        </div>
      </div>

      {/* ── 8. Bottom Nav ── */}
      <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 8, paddingBottom: 12 }}>
        <div
          onClick={onOpenTrash}
          className="nb-sidebar-item"
        >
          <Trash2 size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Trash</span>
          {pages.filter(p => p.isDeleted).length > 0 && (
            <span style={{ fontSize: 11, color: 'var(--ink-tertiary)' }}>
              {pages.filter(p => p.isDeleted).length}
            </span>
          )}
        </div>

        <div
          onClick={onOpenSettings}
          className="nb-sidebar-item"
        >
          <Settings size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

/* ── Sub-components ── */

const SectionLabel: React.FC<{
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
}> = ({ icon, label, action }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 18px 4px', userSelect: 'none',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--ink-tertiary)', display: 'flex' }}>{icon}</span>
      <span style={{
        fontSize: 12, fontWeight: 500, color: 'var(--ink-subtle)',
        letterSpacing: '0.4px'
      }}>{label}</span>
    </div>
    {action && <span style={{ color: 'var(--ink-tertiary)' }}>{action}</span>}
  </div>
);

const SidebarProjectItem: React.FC<{ dot: string; name: string; count?: number; isActive?: boolean; onClick?: () => void }> = ({ dot, name, count, isActive, onClick }) => (
  <div className={`nb-sidebar-item${isActive ? ' active' : ''}`} style={{ paddingLeft: 8 }} onClick={onClick}>
    <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', backgroundColor: dot, flexShrink: 0, display: 'inline-block' }} />
    <span style={{ flex: 1, fontSize: 14 }}>{name}</span>
    {count !== undefined && count > 0 && (
      <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--ink-tertiary)' }}>{count}</span>
    )}
  </div>
);
