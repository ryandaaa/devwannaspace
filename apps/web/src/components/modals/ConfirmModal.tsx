import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, message, 
  confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="nb-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--overlay)', backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        className="nb-modal-card"
        style={{
        position: 'relative', width: 400, background: 'var(--canvas)', 
        border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-lg)', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--hairline)'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            {isDestructive && <AlertTriangle size={18} color="var(--danger)" />}
            {title}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 14, color: 'var(--ink-subtle)', lineHeight: 1.5 }}>
            {message}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px', background: 'var(--surface-1)', color: 'var(--ink)',
                border: '1px solid var(--hairline)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              style={{
                padding: '8px 16px', background: isDestructive ? 'var(--danger)' : 'var(--primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = isDestructive ? 'var(--danger-hover, #ff7875)' : 'var(--primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = isDestructive ? 'var(--danger)' : 'var(--primary)'}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
