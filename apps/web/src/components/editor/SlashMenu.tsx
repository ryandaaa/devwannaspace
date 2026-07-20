import React, { useState, useEffect, useRef } from 'react';
import {
  Heading1, Heading2, Heading3, Type, List, ListOrdered,
  CheckSquare, Code, Quote, Minus, FileText, ChevronRight, AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import type { SlashMenuItem } from '../../types';

interface SlashMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  filterText: string;
  onClose: () => void;
  onSelectItem: (item: SlashMenuItem) => void;
}

const CATEGORIES = ['Text', 'Lists', 'Structure'] as const;

export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  { id: 'h1',      title: 'Heading 1',     description: 'Large section heading',        iconName: 'Heading1',    category: 'Text',      command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'h2',      title: 'Heading 2',     description: 'Medium section heading',       iconName: 'Heading2',    category: 'Text',      command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'h3',      title: 'Heading 3',     description: 'Small subsection heading',     iconName: 'Heading3',    category: 'Text',      command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'p',       title: 'Text',          description: 'Plain text paragraph',         iconName: 'Type',        category: 'Text',      command: (e) => e.chain().focus().setParagraph().run() },
  { id: 'bullet',  title: 'Bullet List',   description: 'Unordered list',              iconName: 'List',        category: 'Lists',     command: (e) => e.chain().focus().toggleBulletList().run() },
  { id: 'ordered', title: 'Numbered List', description: 'Ordered sequence list',        iconName: 'ListOrdered', category: 'Lists',     command: (e) => e.chain().focus().toggleOrderedList().run() },
  { id: 'todo',    title: 'To-do',         description: 'Track tasks with checkboxes',  iconName: 'CheckSquare', category: 'Lists',     command: (e) => e.chain().focus().toggleTaskList().run() },
  { id: 'code',    title: 'Code Block',    description: 'Syntax-highlighted code',      iconName: 'Code',        category: 'Structure', command: (e) => e.chain().focus().toggleCodeBlock().run() },
  { id: 'quote',   title: 'Quote',         description: 'Highlight a quotation',        iconName: 'Quote',       category: 'Structure', command: (e) => e.chain().focus().toggleBlockquote().run() },
  { id: 'toggle',  title: 'Toggle List',   description: 'Collapsible content block',    iconName: 'ChevronRight',category: 'Structure', command: (e) => e.chain().focus().wrapIn('toggleBlock').run() },
  { id: 'callout', title: 'Callout',       description: 'Highlight important info',     iconName: 'AlertCircle', category: 'Structure', command: (e) => e.chain().focus().wrapIn('callout').run() },
  { id: 'hr',      title: 'Divider',       description: 'Visual section separator',     iconName: 'Minus',       category: 'Structure', command: (e) => e.chain().focus().setHorizontalRule().run() },
  { id: 'subpage', title: 'Sub-page',      description: 'Embed a new nested page',      iconName: 'FileText',    category: 'Structure', command: (_e, cb) => cb && cb() },
  { id: 'image',   title: 'Image',         description: 'Embed image from file upload', iconName: 'Image',       category: 'Structure', command: (_e, cb) => cb && cb() },
];

const ICONS: Record<string, React.ReactNode> = {
  Heading1:    <Heading1 size={16} />,
  Heading2:    <Heading2 size={16} />,
  Heading3:    <Heading3 size={16} />,
  Type:        <Type size={16} />,
  List:        <List size={16} />,
  ListOrdered: <ListOrdered size={16} />,
  CheckSquare: <CheckSquare size={16} />,
  Code:        <Code size={16} />,
  Quote:       <Quote size={16} />,
  ChevronRight: <ChevronRight size={16} />,
  AlertCircle: <AlertCircle size={16} />,
  Minus:       <Minus size={16} />,
  FileText:    <FileText size={16} />,
  Image:       <ImageIcon size={16} />,
};

export const SlashMenu: React.FC<SlashMenuProps> = ({
  isOpen, position, filterText, onClose, onSelectItem,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = SLASH_MENU_ITEMS.filter((item) => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.id.includes(q);
  });

  useEffect(() => { setSelectedIndex(0); }, [filterText, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); e.stopPropagation();
        setSelectedIndex((i: number) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); e.stopPropagation();
        setSelectedIndex((i: number) => Math.max(i - 1, 0));
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

  // Auto-scroll the selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('.nb-menu-row.selected');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen || filtered.length === 0) return null;

  const groupedIndex = (item: SlashMenuItem) => filtered.indexOf(item);

  return (
    <div
      ref={listRef}
      style={{
        position: 'absolute', top: position.top, left: position.left, zIndex: 9000,
        width: 320,
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
        maxHeight: 380, overflowY: 'auto',
        padding: '8px 0',
      }}
    >
      {CATEGORIES.map((cat) => {
        const items = filtered.filter((i) => i.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <div className="nb-eyebrow">{cat}</div>
            {items.map((item) => {
              const idx = groupedIndex(item);
              const sel = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`nb-menu-row${sel ? ' selected' : ''}`}
                  onClick={() => onSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{
                    width: 36, height: 36, flexShrink: 0,
                    backgroundColor: 'var(--surface-2)',
                    border: '1px solid var(--hairline-strong)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: sel ? 'var(--primary-hover)' : 'var(--ink-subtle)',
                  }}>
                    {ICONS[item.iconName]}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 14, fontWeight: sel ? 500 : 400, color: sel ? 'var(--ink)' : 'var(--ink-muted)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
