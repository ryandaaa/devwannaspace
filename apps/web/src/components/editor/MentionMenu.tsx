import React, { useState, useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
import type { Page } from '../../types';

interface MentionMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  filterText: string;
  pages: Page[];
  onClose: () => void;
  onSelectItem: (page: Page) => void;
}

export const MentionMenu: React.FC<MentionMenuProps> = ({
  isOpen, position, filterText, pages, onClose, onSelectItem
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = pages.filter(p => 
    (p.title || 'Untitled').toLowerCase().includes(filterText.toLowerCase())
  ).slice(0, 8);

  useEffect(() => { setSelectedIndex(0); }, [filterText, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); e.stopPropagation();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); e.stopPropagation();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault(); e.stopPropagation();
        if (filtered[selectedIndex]) onSelectItem(filtered[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault(); onClose();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [isOpen, selectedIndex, filtered, onSelectItem, onClose]);

  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('.selected');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen || filtered.length === 0) return null;

  return (
    <div
      ref={listRef}
      style={{
        position: 'absolute', top: position.top, left: position.left, zIndex: 9000,
        width: 240,
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        maxHeight: 280, overflowY: 'auto',
        padding: '6px 0',
      }}
    >
      <div style={{ padding: '6px 12px 4px', fontSize: 11, textTransform: 'uppercase', color: 'var(--ink-tertiary)', fontWeight: 600, letterSpacing: '0.5px' }}>Mention Page</div>
      {filtered.map((page, idx) => {
        const sel = idx === selectedIndex;
        return (
          <div
            key={page.id}
            className={sel ? 'selected' : ''}
            onClick={() => onSelectItem(page)}
            onMouseEnter={() => setSelectedIndex(idx)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', cursor: 'pointer',
              backgroundColor: sel ? 'var(--surface-2)' : 'transparent',
              color: sel ? 'var(--ink)' : 'var(--ink-subtle)',
              fontSize: 13
            }}
          >
            <FileText size={14} style={{ color: sel ? 'var(--primary)' : 'var(--ink-tertiary)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {page.title || 'Untitled'}
            </span>
          </div>
        );
      })}
    </div>
  );
};
