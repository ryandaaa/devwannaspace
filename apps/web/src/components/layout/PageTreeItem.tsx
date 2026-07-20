import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { Page } from '../../types';
import { PageIcon } from '../ui/PageIcon';

interface PageTreeItemProps {
  page: Page;
  allPages: Page[];
  activePageId: string | null;
  depth?: number;
  onSelectPage: (id: string) => void;
  onCreatePage: (parentId?: string) => void;
  onDeletePage: (id: string) => void;
}

export const PageTreeItem: React.FC<PageTreeItemProps> = ({
  page, allPages, activePageId, depth = 0,
  onSelectPage, onCreatePage, onDeletePage,
}) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const [isHovered, setIsHovered] = useState(false);

  const children = allPages.filter((p) => p.parentId === page.id && !p.isDeleted);
  const hasChildren = children.length > 0;
  const isActive = activePageId === page.id;

  return (
    <div>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelectPage(page.id)}
        className={`nb-sidebar-item${isActive ? ' active' : ''}`}
        style={{
          paddingLeft: depth * 12 + 8,
          paddingRight: 8,
          height: 32, /* Increased height */
          fontSize: 14,
          gap: 6,
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
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronRight size={12} />
        </button>

        {/* Icon */}
        <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0, width: 16, textAlign: 'center' }}>
          <PageIcon name={page.icon} size={15} color={isActive ? 'var(--sidebar-active-color)' : 'var(--ink-subtle)'} />
        </span>

        {/* Title */}
        <span style={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', fontSize: 14,
        }}>
          {page.title || 'Untitled'}
        </span>

        {/* Actions (hover only) */}
        {isHovered && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
          >
            <button
              onClick={() => onCreatePage(page.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                color: 'var(--ink-tertiary)', display: 'flex', alignItems: 'center',
                borderRadius: 'var(--radius-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.backgroundColor = 'var(--surface-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Add sub-page"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => onDeletePage(page.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                color: 'var(--ink-tertiary)', display: 'flex', alignItems: 'center',
                borderRadius: 'var(--radius-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--tag-red)'; e.currentTarget.style.backgroundColor = 'var(--surface-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Delete page"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <PageTreeItem
              key={child.id} page={child} allPages={allPages}
              activePageId={activePageId} depth={depth + 1}
              onSelectPage={onSelectPage} onCreatePage={onCreatePage}
              onDeletePage={onDeletePage}
            />
          ))}
        </div>
      )}
    </div>
  );
};
