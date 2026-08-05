import React from 'react';
import { Trash2, RotateCcw, X } from 'lucide-react';
import type { Page } from '../../types';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedPages: Page[];
  onRestorePage: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  deletedPages,
  onRestorePage,
  onPermanentDelete,
  onEmptyTrash,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="nb-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="nb-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxHeight: '80vh',
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--hairline-strong)',
          borderRadius: 'var(--radius-lg, 8px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trash2 size={18} style={{ color: 'var(--ink-subtle)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
              Trash
            </h3>
            <span
              style={{
                fontSize: 12,
                color: 'var(--ink-tertiary)',
                backgroundColor: 'var(--surface-2)',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {deletedPages.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {deletedPages.length > 0 && (
              <button
                onClick={onEmptyTrash}
                style={{
                  fontSize: 12,
                  color: 'var(--tag-red, #ff4d4f)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Empty Trash
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 12, overflowY: 'auto', flex: 1, minHeight: 200 }}>
          {deletedPages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                color: 'var(--ink-tertiary)',
                gap: 8,
              }}
            >
              <Trash2 size={32} style={{ opacity: 0.3 }} />
              <span style={{ fontSize: 14 }}>Trash is empty</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {deletedPages.map((page) => (
                <div
                  key={page.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-2)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: 'var(--ink)',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 280,
                    }}
                  >
                    {page.title || 'Untitled'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => onRestorePage(page.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        fontSize: 12,
                        borderRadius: 'var(--radius-xs, 4px)',
                        border: '1px solid var(--hairline-strong)',
                        backgroundColor: 'var(--surface-1)',
                        color: 'var(--ink)',
                        cursor: 'pointer',
                      }}
                      title="Restore Page"
                    >
                      <RotateCcw size={12} />
                      Restore
                    </button>
                    <button
                      onClick={() => onPermanentDelete(page.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 8px',
                        fontSize: 12,
                        borderRadius: 'var(--radius-xs, 4px)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--tag-red, #ff4d4f)',
                        cursor: 'pointer',
                      }}
                      title="Delete Permanently"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
