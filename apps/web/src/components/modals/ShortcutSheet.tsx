import React from 'react';
import { KbdHint } from '../ui/KbdHint';

interface ShortcutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { section: 'Navigation' },
  { keys: ['Ctrl', 'K'], desc: 'Open command palette' },
  { keys: ['Alt', 'N'], desc: 'New page' },
  { keys: ['Ctrl', '\\'], desc: 'Toggle sidebar' },
  { keys: ['Alt', 'Z'], desc: 'Zen mode' },
  { keys: ['?'], desc: 'Show shortcuts' },

  { section: 'Editor' },
  { keys: ['Ctrl', 'B'], desc: 'Bold' },
  { keys: ['Ctrl', 'I'], desc: 'Italic' },
  { keys: ['Ctrl', 'U'], desc: 'Underline' },
  { keys: ['Ctrl', 'E'], desc: 'Inline code' },
  { keys: ['Ctrl', 'Shift', 'S'], desc: 'Strikethrough' },
  { keys: ['/'], desc: 'Slash commands' },
  { keys: ['@'], desc: 'Mention a page' },
  { keys: ['Ctrl', 'Z'], desc: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo' },

  { section: 'Blocks (via /)' },
  { keys: ['/h1'], desc: 'Heading 1' },
  { keys: ['/h2'], desc: 'Heading 2' },
  { keys: ['/todo'], desc: 'To-do list' },
  { keys: ['/bullet'], desc: 'Bullet list' },
  { keys: ['/code'], desc: 'Code block' },
  { keys: ['/table'], desc: 'Table' },
  { keys: ['/kanban'], desc: 'Kanban board' },
  { keys: ['/callout'], desc: 'Callout' },
  { keys: ['/divider'], desc: 'Divider' },

  { section: 'General' },
  { keys: ['Esc'], desc: 'Close modal / Dismiss' },
];

export const ShortcutSheet: React.FC<ShortcutSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        backgroundColor: 'var(--overlay)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        paddingTop: '8vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560, maxWidth: '90vw', maxHeight: '80vh',
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--hairline-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Keyboard Shortcuts</div>
            <div style={{ fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 2 }}>Press <KbdHint>?</KbdHint> anytime to open this</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-tertiary)', padding: 4, borderRadius: 'var(--radius-sm)',
              fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {SHORTCUTS.map((item, idx) => {
            if ('section' in item) {
              return (
                <div key={idx} style={{
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.5px', color: 'var(--ink-tertiary)',
                  padding: '16px 0 6px',
                  borderBottom: '1px solid var(--hairline-tertiary)',
                  marginBottom: 4,
                }}>
                  {item.section}
                </div>
              );
            }
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 0',
                borderBottom: '1px solid var(--hairline-tertiary)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--ink-subtle)' }}>{item.desc}</span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {item.keys.map((k, ki) => (
                    <KbdHint key={ki}>{k}</KbdHint>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
