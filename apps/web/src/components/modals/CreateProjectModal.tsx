import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

import type { Project } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string, id?: string) => void;
  initialProject?: Project;
}

// Nord Theme and vibrant colors
const COLORS = [
  '#81A1C1', // Frost Blue
  '#88C0D0', // Cyan
  '#A3BE8C', // Aurora Green
  '#EBCB8B', // Aurora Yellow
  '#D08770', // Aurora Orange
  '#BF616A', // Aurora Red
  '#B48EAD', // Aurora Purple
  '#5E81AC', // Deep Frost
  '#F472B6', // Vibrant Pink
  '#34D399', // Vibrant Emerald
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit, initialProject }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isHoveringColor, setIsHoveringColor] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialProject) {
        setName(initialProject.name);
        setSelectedColor(initialProject.color);
      } else {
        setName('');
        setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      }
    }
  }, [isOpen, initialProject]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), selectedColor, initialProject?.id);
    onClose();
  };

  return (
    <div 
      className="nb-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--overlay)', backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="nb-modal-card"
        style={{
        position: 'relative', width: 420, background: 'var(--main-panel)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Solid Color Top Border */}
        <div style={{
          height: 4, width: '100%',
          backgroundColor: selectedColor,
          transition: 'background-color 0.3s ease'
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 28px 16px',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
            {initialProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'var(--surface-1)', border: 'none', color: 'var(--ink-subtle)', 
              cursor: 'pointer', padding: 6, borderRadius: '50%', display: 'flex',
              transition: 'background 0.1s ease, color 0.1s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface-1)'; e.currentTarget.style.color = 'var(--ink-subtle)'; }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '8px 28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)' }}>Project Name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              style={{
                width: '100%', padding: '12px 14px', background: 'var(--main-panel)', 
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontSize: 14, outline: 'none', 
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = selectedColor;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${selectedColor}33`;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--hairline-strong)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.05)';
              }}
            />
          </div>

          {/* Color Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-subtle)' }}>Theme Color</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  onMouseEnter={() => setIsHoveringColor(color)}
                  onMouseLeave={() => setIsHoveringColor(null)}
                  style={{
                    position: 'relative',
                    width: 32, height: 32, borderRadius: '50%', backgroundColor: color, border: 'none', cursor: 'pointer',
                    transform: selectedColor === color || isHoveringColor === color ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {selectedColor === color && (
                    <Check size={16} color="#ffffff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--ink-subtle)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                transition: 'all 0.1s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ink-subtle)'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: '10px 20px', backgroundColor: name.trim() ? selectedColor : 'var(--surface-3)', 
                border: 'none', color: '#ffffff',
                fontSize: 14, fontWeight: 500, cursor: name.trim() ? 'pointer' : 'not-allowed', borderRadius: 'var(--radius-sm)',
                opacity: name.trim() ? 1 : 0.6,
                boxShadow: name.trim() ? `0 4px 12px ${selectedColor}40` : 'none',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: 8
              }}
              onMouseEnter={e => {
                if (name.trim()) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                if (name.trim()) e.currentTarget.style.transform = 'none';
              }}
            >
              <Check size={16} />
              {initialProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
