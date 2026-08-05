import React from 'react';
import { X, RotateCcw, Clock } from 'lucide-react';

interface Snapshot {
  timestamp: string;
  content: any;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: Snapshot[];
  onRestore: (content: any) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  onRestore
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="nb-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        backgroundColor: 'var(--overlay)',
        backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: 24
      }}
      onClick={onClose}
    >
      <div
        className="nb-modal-card"
        style={{
          width: '100%', maxWidth: 400,
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--hairline)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} style={{ color: 'var(--ink-subtle)' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Version History</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--ink-tertiary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              padding: 4, borderRadius: 'var(--radius-sm)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-tertiary)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '50vh', overflowY: 'auto' }}>
          {snapshots.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-tertiary)', fontSize: 13 }}>
              No history versions recorded yet. Updates are saved every minute of active editing.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {snapshots.map((snap, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', border: '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-1)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      Version #{snapshots.length - idx}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-subtle)' }}>
                      {new Date(snap.timestamp).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore this version? This will overwrite current changes.')) {
                        onRestore(snap.content);
                        onClose();
                      }
                    }}
                    style={{
                      height: 28, padding: '0 10px',
                      backgroundColor: 'var(--surface-2)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12, fontWeight: 500, color: 'var(--ink)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-3)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                  >
                    <RotateCcw size={12} /> Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
