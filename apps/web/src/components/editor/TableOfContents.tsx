import React from 'react';
import type { Editor } from '@tiptap/react';

interface TableOfContentsProps {
  editor: Editor | null;
}

interface HeadingItem {
  text: string;
  level: number;
  pos: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ editor }) => {
  if (!editor) return null;

  const headings: HeadingItem[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      headings.push({
        text: node.textContent,
        level: node.attrs.level,
        pos
      });
    }
  });

  if (headings.length < 2) return null;

  const handleHeadingClick = (pos: number) => {
    editor.commands.focus();
    // Resolve DOM node for position
    const dom = editor.view.nodeDOM(pos) as HTMLElement;
    if (dom) {
      dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="nb-toc">
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-tertiary)', marginBottom: 8 }}>
        On this page
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {headings.map((h, idx) => (
          <div
            key={idx}
            onClick={() => handleHeadingClick(h.pos)}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--ink-subtle)',
              cursor: 'pointer',
              paddingLeft: (h.level - 1) * 8,
              lineHeight: 1.3,
              transition: 'color 0.1s ease',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-subtle)'}
            title={h.text}
          >
            {h.text || 'Heading'}
          </div>
        ))}
      </div>
    </div>
  );
};
