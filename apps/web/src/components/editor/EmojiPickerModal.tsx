import React from 'react';
import { X } from 'lucide-react';
import { PageIcon } from '../ui/PageIcon';

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (iconName: string | null) => void;
}

const ICON_CATEGORIES = [
  {
    name: 'Development & Core',
    icons: ['FileText', 'Code', 'FileCode', 'Terminal', 'Zap', 'Database', 'Cpu', 'Layers', 'Command', 'Hash'],
  },
  {
    name: 'Structure & System',
    icons: ['Folder', 'Box', 'Package', 'Layout', 'Grid', 'Sliders', 'Wrench', 'Shield', 'Key', 'Settings'],
  },
  {
    name: 'Essentials & Meta',
    icons: ['Sparkles', 'Flame', 'Rocket', 'Globe', 'Activity', 'Bookmark', 'Tag', 'Compass', 'BookOpen', 'Feather'],
  },
];

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isOpen, onClose, onSelectEmoji,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="nb-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 99998,
        backgroundColor: 'var(--overlay)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="nb-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          backgroundColor: 'var(--canvas)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          padding: 20,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Select Page Icon</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => { onSelectEmoji(null); onClose(); }}
              style={{
                background: 'none', border: '1px solid var(--hairline-strong)',
                color: 'var(--ink-subtle)', fontSize: 12, borderRadius: 'var(--radius-sm)',
                padding: '4px 10px', cursor: 'pointer', transition: 'background 0.1s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-1)'; e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ink-subtle)' }}
            >
              Remove
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Icon grid by category */}
        <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
          {ICON_CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <div className="nb-eyebrow" style={{ padding: '0 0 8px 0', fontSize: 11, color: 'var(--ink-subtle)' }}>
                {cat.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {cat.icons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => { onSelectEmoji(iconName); onClose(); }}
                    title={iconName}
                    style={{
                      backgroundColor: 'var(--surface-1)',
                      border: '1px solid var(--hairline)',
                      cursor: 'pointer',
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--ink)',
                      transition: 'all 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-1)';
                      e.currentTarget.style.borderColor = 'var(--hairline)';
                      e.currentTarget.style.color = 'var(--ink)';
                    }}
                  >
                    <PageIcon name={iconName} size={20} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
