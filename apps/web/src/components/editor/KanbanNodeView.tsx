import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

export const KanbanNodeView: React.FC<any> = ({ node, updateAttributes, deleteNode }) => {
  let columns = node.attrs.columns as { id: string, title: string, cards: { id: string, text: string }[] }[];
  if (typeof columns === 'string') {
    try { columns = JSON.parse(columns); } catch (e) { columns = []; }
  }
  if (!Array.isArray(columns)) {
    columns = [
      { id: 'todo', title: 'To Do', cards: [{ id: 'c1', text: 'Draft proposal' }] },
      { id: 'in-progress', title: 'In Progress', cards: [{ id: 'c2', text: 'Review designs' }] },
      { id: 'done', title: 'Done', cards: [{ id: 'c3', text: 'Kickoff meeting' }] }
    ];
  }
  
  const [draggingCard, setDraggingCard] = useState<{ colId: string, cardId: string } | null>(null);

  const handleAddCard = (colId: string) => {
    const text = "New task";
    const newCols = columns.map(c => {
      if (c.id === colId) {
        return { ...c, cards: [...c.cards, { id: `c-${Date.now()}`, text }] };
      }
      return c;
    });
    updateAttributes({ columns: newCols });
  };

  const handleUpdateCard = (colId: string, cardId: string, text: string) => {
    const newCols = columns.map(c => {
      if (c.id === colId) {
        return { ...c, cards: c.cards.map(card => card.id === cardId ? { ...card, text } : card) };
      }
      return c;
    });
    updateAttributes({ columns: newCols });
  };

  const handleDeleteCard = (colId: string, cardId: string) => {
    const newCols = columns.map(c => {
      if (c.id === colId) {
        return { ...c, cards: c.cards.filter(card => card.id !== cardId) };
      }
      return c;
    });
    updateAttributes({ columns: newCols });
  };

  const handleDragStart = (e: React.DragEvent, colId: string, cardId: string) => {
    e.stopPropagation();
    setDraggingCard({ colId, cardId });
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggingCard) return;
    
    if (draggingCard.colId === targetColId) {
      setDraggingCard(null);
      return; 
    }
    
    let movedCard: { id: string, text: string } | null | undefined = null;
    const newCols = columns.map(c => {
      if (c.id === draggingCard.colId) {
        movedCard = c.cards.find(card => card.id === draggingCard.cardId);
        return { ...c, cards: c.cards.filter(card => card.id !== draggingCard.cardId) };
      }
      return c;
    });
    
    if (movedCard) {
      const finalCols = newCols.map(c => {
        if (c.id === targetColId) {
          return { ...c, cards: [...c.cards, movedCard!] };
        }
        return c;
      });
      updateAttributes({ columns: finalCols });
    }
    setDraggingCard(null);
  };

  return (
    <NodeViewWrapper style={{ margin: '32px 0', position: 'relative' }} className="kanban-node-wrapper">
      {/* Delete Board Button - positioned relative to the outer wrapper so it doesn't scroll */}
      <button
        onClick={deleteNode}
        title="Delete Kanban Board"
        style={{
          position: 'absolute', top: -14, right: 16,
          background: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
          color: 'var(--ink-tertiary)', borderRadius: 'var(--radius-sm)',
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 20, transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--danger)';
          e.currentTarget.style.borderColor = 'var(--danger)';
          e.currentTarget.style.background = 'rgba(235, 87, 87, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--ink-tertiary)';
          e.currentTarget.style.borderColor = 'var(--hairline-strong)';
          e.currentTarget.style.background = 'var(--surface-2)';
        }}
      >
        <Trash2 size={14} />
      </button>

      <div 
        contentEditable={false} // Important: prevent TipTap from capturing text selection inside
        style={{
          display: 'flex', gap: 16, overflowX: 'auto', padding: '16px',
          background: 'var(--surface-1)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)', minHeight: 300, position: 'relative',
        }}
      >
        {columns.map(col => (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{
              flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 12,
              background: 'var(--main-panel)', padding: 12, borderRadius: 'var(--radius-md)',
              border: '1px solid var(--hairline-strong)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{col.title}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-subtle)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 12 }}>
                {col.cards.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 40 }}>
              {col.cards.map(card => (
                <div 
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, col.id, card.id)}
                  onDragEnd={() => setDraggingCard(null)}
                  style={{
                    background: 'var(--surface-1)', padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    cursor: 'grab', opacity: draggingCard?.cardId === card.id ? 0.5 : 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <GripVertical size={14} style={{ color: 'var(--ink-tertiary)', flexShrink: 0, marginTop: 4, cursor: 'grab' }} />
                  <input 
                    value={card.text}
                    onChange={(e) => handleUpdateCard(col.id, card.id, e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()} // Allow click inside without dragging
                    style={{
                      flex: 1, background: 'transparent', border: 'none', color: 'var(--ink)',
                      fontSize: 13, outline: 'none', minWidth: 0, padding: 0, margin: 0,
                      lineHeight: 1.5,
                    }}
                  />
                  <button
                    onClick={() => handleDeleteCard(col.id, card.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-tertiary)', cursor: 'pointer', padding: 2, flexShrink: 0 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAddCard(col.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                padding: '6px', background: 'transparent', border: 'none',
                color: 'var(--ink-subtle)', cursor: 'pointer', fontSize: 13,
                borderRadius: 'var(--radius-sm)', justifyContent: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Plus size={14} /> Add Card
            </button>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};
