import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import type { Page } from '../../types';
import { PageIcon } from '../ui/PageIcon';

interface PageHeaderProps {
  page: Page;
  onUpdateTitle: (title: string) => void;
  onOpenEmojiPicker: () => void;
  onUpdateCoverColor?: (color: string) => void;
}

const PASTEL_COLORS = [
  '#fde2e4', // soft pink
  '#fad2e1', // soft rose
  '#c5dedd', // soft teal
  '#dbe7e4', // soft mint
  '#f0efeb', // warm gray/yellow
  '#d6e2e9', // soft blue
  '#bcd4e6', // sky blue
  '#99c1b9', // muted green
  '#e2ece9', // mint white
  '#dfd7f0', // soft purple
];
const getPastelColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  page, onUpdateTitle, onOpenEmojiPicker, onUpdateCoverColor
}) => {
  const [iconHovered, setIconHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const coverColor = page.coverColor || getPastelColor(page.id);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatRelativeTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Cover Color Block */}
      <div 
        onMouseEnter={() => setShowColorPicker(true)}
        onMouseLeave={() => setShowColorPicker(false)}
        style={{
          width: '100%',
          height: 120,
          backgroundColor: coverColor,
          position: 'relative',
        }} 
      >
        {showColorPicker && onUpdateCoverColor && (
          <div style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--surface-1)', padding: 8,
            borderRadius: 'var(--radius-md)', border: '1px solid var(--hairline)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex', gap: 6, zIndex: 10,
          }}>
            {PASTEL_COLORS.map(c => (
              <button
                key={c}
                onClick={() => onUpdateCoverColor(c)}
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  backgroundColor: c, border: coverColor === c ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  padding: 0,
                }}
                title={c}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 64px' }}>
        {/* Icon row */}
        <div style={{ marginBottom: 16, minHeight: 64, marginTop: -32 }}>
          {page.icon ? (
            <button
              onClick={onOpenEmojiPicker}
              onMouseEnter={() => setIconHovered(true)}
              onMouseLeave={() => setIconHovered(false)}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--hairline-strong)',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink)',
                transition: 'background 0.1s ease',
              }}
              title="Change icon"
            >
              <PageIcon name={page.icon} size={40} />
              {iconHovered && (
                <span style={{
                  position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 12, color: 'var(--ink)',
                  whiteSpace: 'nowrap', background: 'var(--surface-3)',
                  border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10
                }}>
                  Change icon
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenEmojiPicker}
              style={{
                background: 'var(--surface-1)', border: '1px solid var(--hairline-strong)', cursor: 'pointer',
                fontSize: 14, color: 'var(--ink-subtle)', borderRadius: 'var(--radius-pill)',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', marginTop: 32 /* offset the negative margin since there's no big icon to overlap */
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.color = 'var(--ink)'; 
                e.currentTarget.style.backgroundColor = 'var(--surface-2)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.color = 'var(--ink-subtle)'; 
                e.currentTarget.style.backgroundColor = 'var(--surface-1)'; 
              }}
            >
              <Smile size={16} />
              <span>Add icon</span>
            </button>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          value={page.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Untitled"
          style={{
            width: '100%', background: 'none', border: 'none', outline: 'none',
            fontFamily: 'var(--font)',
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: '-1.8px',
            lineHeight: 1.3,
            color: 'var(--ink)',
            padding: '4px 0 8px 0',
            marginBottom: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        />

        {/* Subtitle / Metadata */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 13, color: 'var(--ink-tertiary)',
          marginBottom: 16, fontFamily: 'var(--font)'
        }}>
          <span>Created {formatDate(page.createdAt)}</span>
          <span>•</span>
          <span>Edited {formatRelativeTime(page.updatedAt)}</span>
        </div>
      </div>
    </>
  );
};
