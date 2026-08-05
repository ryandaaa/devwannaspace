import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Plus, Trash2, Edit2 } from 'lucide-react';

interface PageContextMenuProps {
  x: number;
  y: number;
  pageId: string;
  pageTitle: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  onCreateSubPage: (parentId: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
}

export const PageContextMenu: React.FC<PageContextMenuProps> = ({
  x, y, pageId, onClose,
  onSelect, onCreateSubPage, onDuplicate, onDelete, onRename,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const getZoomFactor = () => {
    const zoomVal = parseFloat(document.body.style.zoom) || 100;
    return zoomVal / 100;
  };

  const [adjustedPos, setAdjustedPos] = useState(() => {
    const factor = getZoomFactor();
    const targetX = x / factor;
    const targetY = y / factor;
    const sidebarEl = typeof document !== 'undefined' ? document.querySelector('aside') : null;
    const sidebarWidth = sidebarEl ? sidebarEl.getBoundingClientRect().width / factor : 280;
    const menuWidth = 180;
    let posX = targetX;
    if (targetX + menuWidth > sidebarWidth - 8) {
      posX = Math.max(8, targetX - menuWidth);
    }
    return { x: posX, y: targetY };
  });

  useEffect(() => {
    if (ref.current) {
      const zoomFactor = getZoomFactor();
      const rect = ref.current.getBoundingClientRect();
      const vw = window.innerWidth / zoomFactor;
      const vh = window.innerHeight / zoomFactor;

      const targetX = x / zoomFactor;
      const targetY = y / zoomFactor;
      const menuWidth = rect.width / zoomFactor;
      const menuHeight = rect.height / zoomFactor;

      const sidebarEl = document.querySelector('aside');
      const sidebarWidth = sidebarEl ? sidebarEl.getBoundingClientRect().width / zoomFactor : 280;

      let posX = targetX;
      if (targetX + menuWidth > sidebarWidth - 8 || targetX + menuWidth > vw - 8) {
        posX = Math.max(8, targetX - menuWidth);
      }

      let posY = targetY;
      if (targetY + menuHeight > vh - 8) {
        posY = Math.max(8, vh - menuHeight - 8);
      }

      setAdjustedPos({ x: posX, y: posY });
    }
  }, [x, y]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const scrollHandler = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    window.addEventListener('scroll', scrollHandler, { capture: true });
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
      window.removeEventListener('scroll', scrollHandler, { capture: true });
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  const items = [
    { icon: Edit2, label: 'Rename', action: () => { onRename(pageId); onClose(); } },
    { icon: Copy, label: 'Duplicate', action: () => { onDuplicate(pageId); onClose(); } },
    { icon: Plus, label: 'Add sub-page', action: () => { onCreateSubPage(pageId); onSelect(pageId); onClose(); } },
    { divider: true },
    { icon: Trash2, label: 'Delete', action: () => { onDelete(pageId); onClose(); }, danger: true },
  ];

  return createPortal(
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: adjustedPos.y,
        left: adjustedPos.x,
        zIndex: 999999,
        minWidth: 180,
        backgroundColor: 'var(--surface-1)',
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        padding: 4,
      }}
    >
      {items.map((item, idx) => {
        if ('divider' in item) {
          return <div key={idx} style={{ height: 1, backgroundColor: 'var(--hairline)', margin: '4px 0' }} />;
        }
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={item.action}
            style={{
              width: '100%', padding: '7px 10px',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, borderRadius: 'var(--radius-sm)',
              color: item.danger ? 'var(--tag-red)' : 'var(--ink)',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = item.danger ? 'rgba(255,80,80,0.1)' : 'var(--surface-2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Icon size={14} style={{ flexShrink: 0, opacity: 0.8 }} />
            {item.label}
          </button>
        );
      })}
    </div>,
    document.body
  );
};
