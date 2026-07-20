import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import type { Page, Project, Issue } from '../../types';
import { KbdHint } from '../ui/KbdHint';
import { PageIcon } from '../ui/PageIcon';

interface CommandPaletteProps {
  isOpen: boolean;
  pages: Page[];
  projects: Project[];
  issues: Issue[];
  onClose: () => void;
  onSelectResult: (type: 'page' | 'project' | 'issue', id: string, projectId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen, pages, projects, issues, onClose, onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const activePages = pages.filter((p) => !p.isDeleted);
  
  const searchResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [
        ...activePages.slice(0, 4).map(p => ({ type: 'page' as const, id: p.id, title: p.title || 'Untitled', icon: p.icon || 'FileText' })),
        ...projects.slice(0, 4).map(p => ({ type: 'project' as const, id: p.id, title: p.name, icon: 'Folder', color: p.color }))
      ];
    }
    return [
      ...activePages.filter(p => (p.title?.toLowerCase().includes(q)) || JSON.stringify(p.content||'').toLowerCase().includes(q))
        .map(p => ({ type: 'page' as const, id: p.id, title: p.title || 'Untitled', icon: p.icon || 'FileText', page: p })),
      ...projects.filter(p => p.name.toLowerCase().includes(q))
        .map(p => ({ type: 'project' as const, id: p.id, title: p.name, icon: 'Folder', color: p.color })),
      ...issues.filter(i => i.title.toLowerCase().includes(q) || (i.description||'').toLowerCase().includes(q))
        .map(i => ({ type: 'issue' as const, id: i.id, title: i.title, icon: 'CheckSquare', projectId: i.projectId }))
    ].slice(0, 12);
  }, [query, activePages, projects, issues]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const res = searchResults[selectedIndex];
        if (res) {
          onSelectResult(res.type, res.id, (res as any).projectId);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, selectedIndex, searchResults, onSelectResult, onClose]);

  // Auto-scroll the active item into view when navigating with keyboard
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('.nb-menu-row.selected');
      if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const sectionLabel = !query ? 'Recent Pages' : `Results for "${query}"`;

  return (
    /* Scrim */
    <div
      className="nb-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        backgroundColor: 'var(--overlay)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="nb-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 600, maxWidth: '90vw',
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '70vh',
          overflow: 'hidden',
        }}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--hairline-tertiary)',
        }}>
          <Search size={18} style={{ color: 'var(--ink-subtle)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages or jump to..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: 'var(--font)', fontSize: 16, color: 'var(--ink)',
            }}
          />
          <KbdHint>ESC</KbdHint>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {/* Section label */}
          <div className="nb-eyebrow">
            {sectionLabel}
          </div>

          {searchResults.length === 0 ? (
            <div style={{
              padding: '32px 20px', textAlign: 'center',
              color: 'var(--ink-tertiary)', fontSize: 14,
            }}>
              No results found for "{query}"
            </div>
          ) : (
            searchResults.map((res, idx) => {
              const sel = idx === selectedIndex;
              const excerpt = (() => {
                if (res.type !== 'page' || !(res as any).page) return null;
                const page = (res as any).page;
                const body = JSON.stringify(page.content ?? '');
                const q = query.toLowerCase();
                if (!query || !body.toLowerCase().includes(q)) return null;
                const raw = body.replace(/[{}[\]"\\]/g, ' ').replace(/\s+/g, ' ');
                const i = raw.toLowerCase().indexOf(q);
                return i !== -1 ? '...' + raw.slice(Math.max(0, i - 20), i + 60) + '...' : null;
              })();

              return (
                <div
                  key={`${res.type}-${res.id}`}
                  className={`nb-menu-row${sel ? ' selected' : ''}`}
                  onClick={() => { onSelectResult(res.type, res.id, (res as any).projectId); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}>
                    {res.type === 'project' && (res as any).color ? (
                      <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: (res as any).color }} />
                    ) : (
                      <PageIcon name={res.icon as string} size={16} color="var(--ink-subtle)" />
                    )}
                  </span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: 14, fontWeight: sel ? 500 : 400,
                      color: sel ? 'var(--ink)' : 'var(--ink-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {res.title || 'Untitled'}
                    </div>
                    {excerpt && (
                      <div style={{
                        fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 2,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {excerpt}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {res.type}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--hairline-tertiary)',
          backgroundColor: 'var(--surface-2)',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 12, color: 'var(--ink-subtle)',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span><KbdHint>↑↓</KbdHint> <span style={{ marginLeft: 6 }}>navigate</span></span>
            <span><KbdHint>↵</KbdHint> <span style={{ marginLeft: 6 }}>open</span></span>
            <span><KbdHint>ESC</KbdHint> <span style={{ marginLeft: 6 }}>close</span></span>
          </div>
          <span style={{ fontFamily: 'var(--mono)' }}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
