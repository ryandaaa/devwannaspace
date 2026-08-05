import React, { useState, useRef } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { Page } from '../../types';
import { PageIcon } from '../ui/PageIcon';
import { PageContextMenu } from '../ui/PageContextMenu';

interface PageTreeItemProps {
  page: Page;
  allPages: Page[];
  activePageId: string | null;
  depth?: number;
  onSelectPage: (id: string) => void;
  onCreatePage: (parentId?: string) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onRenamePage: (id: string, title: string) => void;
  onMovePage?: (dragId: string, targetId: string) => void;
}

export const PageTreeItem: React.FC<PageTreeItemProps> = React.memo(({
  page, allPages, activePageId, depth = 0,
  onSelectPage, onCreatePage, onDeletePage, onDuplicatePage, onRenamePage, onMovePage,
}) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(page.title || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const children = allPages.filter((p) => p.parentId === page.id && !p.isDeleted);
  const hasChildren = children.length > 0;
  const isActive = activePageId === page.id;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRenameStart = (id: string) => {
    setRenameValue(page.title || '');
    setIsRenaming(true);
    setTimeout(() => renameInputRef.current?.select(), 30);
  };

  const handleRenameCommit = () => {
    if (renameValue.trim()) onRenamePage(page.id, renameValue.trim());
    setIsRenaming(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('pageId', page.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dragId = e.dataTransfer.getData('pageId');
    if (dragId && dragId !== page.id && onMovePage) {
      onMovePage(dragId, page.id);
    }
    setIsDragOver(false);
  };

  return (
    <div>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsDragOver(false); }}
        onClick={() => !isRenaming && onSelectPage(page.id)}
        onContextMenu={handleContextMenu}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`nb-sidebar-item${isActive ? ' active' : ''}`}
        style={{
          paddingLeft: depth * 14 + 4,
          paddingRight: 8,
          height: 32,
          fontSize: 14,
          gap: 4,
          outline: isDragOver ? '2px solid var(--primary)' : undefined,
          outlineOffset: -2,
          cursor: 'grab',
        }}
      >
        {/* Expand toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          style={{
            background: 'none', border: 'none', padding: '2px', cursor: 'pointer',
            color: 'var(--ink-tertiary)', display: 'flex', alignItems: 'center',
            visibility: hasChildren ? 'visible' : 'hidden',
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.12s ease',
            flexShrink: 0,
            borderRadius: 'var(--radius-sm)',
            marginLeft: -2,
            marginRight: -2,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronRight size={12} />
        </button>

        {/* Icon */}
        <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0, width: 16, textAlign: 'center' }}>
          <PageIcon name={page.icon} size={14} color={isActive ? 'var(--sidebar-active-color)' : 'var(--ink-subtle)'} />
        </span>

        {/* Title / Rename input */}
        {isRenaming ? (
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameCommit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameCommit();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1, fontSize: 14, background: 'var(--surface-2)',
              border: '1px solid var(--primary)', borderRadius: 4,
              color: 'var(--ink)', padding: '1px 4px', outline: 'none',
            }}
          />
        ) : (
          <span 
            onDoubleClick={(e) => { e.stopPropagation(); handleRenameStart(page.id); }}
            style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}
          >
            {page.title || 'Untitled'}
          </span>
        )}

        {/* Actions (hover only) */}
        {isHovered && !isRenaming && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
          >
            <button
              onClick={() => onCreatePage(page.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--ink-tertiary)', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.backgroundColor = 'var(--surface-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Add sub-page"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => onDeletePage(page.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--ink-tertiary)', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--tag-red)'; e.currentTarget.style.backgroundColor = 'var(--surface-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Delete page"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <PageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          pageId={page.id}
          pageTitle={page.title || 'Untitled'}
          onClose={() => setContextMenu(null)}
          onSelect={onSelectPage}
          onCreateSubPage={onCreatePage}
          onDuplicate={onDuplicatePage}
          onDelete={onDeletePage}
          onRename={handleRenameStart}
        />
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <PageTreeItem
              key={child.id} page={child} allPages={allPages}
              activePageId={activePageId} depth={depth + 1}
              onSelectPage={onSelectPage} onCreatePage={onCreatePage}
              onDeletePage={onDeletePage} onDuplicatePage={onDuplicatePage}
              onRenamePage={onRenamePage} onMovePage={onMovePage}
            />
          ))}
        </div>
      )}
    </div>
  );
}, (prev, next) => {
  if (prev.page.id !== next.page.id) return false;
  if (prev.page.title !== next.page.title) return false;
  if (prev.page.icon !== next.page.icon) return false;
  if (prev.activePageId !== next.activePageId) return false;
  const prevChildren = prev.allPages.filter(p => p.parentId === prev.page.id && !p.isDeleted);
  const nextChildren = next.allPages.filter(p => p.parentId === next.page.id && !p.isDeleted);
  if (prevChildren.length !== nextChildren.length) return false;
  return true;
});
