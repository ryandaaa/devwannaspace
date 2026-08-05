import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, FileText, Folder, CheckSquare, Plus, ArrowRight
} from 'lucide-react';
import type { Page, Project, Issue } from '../../types';

export interface CommandItem {
  id: string;
  category: 'Pages' | 'Projects' | 'Issues' | 'Actions';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
  projects: Project[];
  issues: Issue[];
  onSelectPage: (id: string) => void;
  onSelectProject: (id: string) => void;
  onOpenCreateIssue: () => void;
  onOpenCreateProject: () => void;
  onOpenCreatePage: () => void;
  onOpenMyIssues: () => void;
  onOpenAllPages: () => void;
}

const CATEGORIES: Array<CommandItem['category']> = ['Pages', 'Projects', 'Issues', 'Actions'];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  pages,
  projects,
  issues,
  onSelectPage,
  onSelectProject,
  onOpenCreateIssue,
  onOpenCreateProject,
  onOpenCreatePage,
  onOpenMyIssues,
  onOpenAllPages,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Aggregate items into a unified searchable list
  const allItems: CommandItem[] = [
    // Pages
    ...pages.map(page => ({
      id: `page-${page.id}`,
      category: 'Pages' as const,
      title: page.title || 'Untitled',
      subtitle: page.icon ? `Icon: ${page.icon}` : 'Page',
      icon: <FileText size={16} />,
      onSelect: () => { onSelectPage(page.id); onClose(); }
    })),
    // Projects
    ...projects.map(proj => ({
      id: `proj-${proj.id}`,
      category: 'Projects' as const,
      title: proj.name,
      subtitle: 'Project',
      icon: <Folder size={16} style={{ color: proj.color }} />,
      onSelect: () => { onSelectProject(proj.id); onClose(); }
    })),
    // Issues
    ...issues.map(issue => ({
      id: `issue-${issue.id}`,
      category: 'Issues' as const,
      title: issue.title,
      subtitle: `${issue.status} • ${issue.priority}`,
      icon: <CheckSquare size={16} />,
      onSelect: () => { onOpenMyIssues(); onClose(); }
    })),
    // Global Actions
    {
      id: 'action-create-issue',
      category: 'Actions' as const,
      title: 'Create New Issue',
      subtitle: 'Shortcut for issue creation',
      icon: <Plus size={16} />,
      onSelect: () => { onOpenCreateIssue(); onClose(); }
    },
    {
      id: 'action-create-project',
      category: 'Actions' as const,
      title: 'Create New Project',
      subtitle: 'Shortcut for project creation',
      icon: <Plus size={16} />,
      onSelect: () => { onOpenCreateProject(); onClose(); }
    },
    {
      id: 'action-create-page',
      category: 'Actions' as const,
      title: 'Create New Page',
      subtitle: 'Shortcut for document creation',
      icon: <Plus size={16} />,
      onSelect: () => { onOpenCreatePage(); onClose(); }
    },
    {
      id: 'action-all-pages',
      category: 'Actions' as const,
      title: 'Go to All Pages',
      subtitle: 'View page directory',
      icon: <ArrowRight size={16} />,
      onSelect: () => { onOpenAllPages(); onClose(); }
    },
    {
      id: 'action-my-issues',
      category: 'Actions' as const,
      title: 'Go to My Issues',
      subtitle: 'View all assigned issues',
      icon: <ArrowRight size={16} />,
      onSelect: () => { onOpenMyIssues(); onClose(); }
    }
  ];

  const filteredItems = allItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  });

  // Reset index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredItems.length ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  // Auto scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('.cmd-item-selected');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let globalIndexCounter = 0;

  return createPortal(
    <div 
      className="nb-modal-overlay"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'var(--overlay)', backdropFilter: 'blur(4px)',
        zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={onClose}
    >
      <div 
        className="nb-modal-card"
        style={{
          width: '100%', maxWidth: 600, backgroundColor: 'var(--canvas)',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline-strong)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--hairline)'
        }}>
          <Search size={18} style={{ color: 'var(--ink-tertiary)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: 'var(--ink)',
              fontWeight: 400
            }}
          />
          <kbd style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 6px',
            background: 'var(--surface-2)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--ink-tertiary)'
          }}>
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--ink-tertiary)', fontSize: 14 }}>
              No results found for "{query}"
            </div>
          ) : (
            CATEGORIES.map(category => {
              const categoryItems = filteredItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: 8 }}>
                  <div style={{
                    padding: '6px 20px',
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--ink-tertiary)'
                  }}>
                    {category}
                  </div>
                  {categoryItems.map(item => {
                    const itemIndex = globalIndexCounter++;
                    const isSelected = itemIndex === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        className={isSelected ? 'cmd-item-selected' : ''}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 20px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--surface-2)' : 'transparent',
                          transition: 'background-color 0.1s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            color: isSelected ? 'var(--primary)' : 'var(--ink-subtle)',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {item.icon}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: isSelected ? 500 : 400, color: 'var(--ink)' }}>
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span style={{ fontSize: 12, color: 'var(--ink-tertiary)' }}>
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <span style={{ fontSize: 12, color: 'var(--ink-tertiary)', fontWeight: 500 }}>
                            Jump to ↵
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
