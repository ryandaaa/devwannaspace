import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import { Node } from '@tiptap/core';
import { marked } from 'marked';
import { SlashMenu } from './SlashMenu';
import { MentionMenu } from './MentionMenu';
import { TableOfContents } from './TableOfContents';
import type { SlashMenuItem, Page } from '../../types';
import { PageIcon } from '../ui/PageIcon';
import { FileCode2, Edit3 } from 'lucide-react';

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },
  renderHTML() {
    return ['div', { 'data-type': 'callout', class: 'callout-block' }, 0];
  },
  addCommands() {
    return {
      setCallout: () => ({ commands }: any) => {
        return commands.wrapIn(this.name);
      },
    } as any;
  },
});

const ToggleBlock = Node.create({
  name: 'toggleBlock',
  group: 'block',
  content: 'block+',
  defining: true,
  parseHTML() {
    return [{ tag: 'details[data-type="toggle"]' }];
  },
  renderHTML() {
    return [
      'details', 
      { 'data-type': 'toggle', class: 'toggle-block' },
      ['summary', { class: 'toggle-summary' }, 'Toggle'],
      ['div', { class: 'toggle-content' }, 0]
    ];
  },
  addCommands() {
    return {
      setToggleBlock: () => ({ commands }: any) => {
        return commands.wrapIn(this.name);
      },
    } as any;
  },
});

interface TipTapEditorProps {
  currentPageId: string;
  content: any;
  onChange: (json: any) => void;
  onCreateSubpage: () => void;
  header?: React.ReactNode;
  allPages: Page[];
  onSelectPage: (id: string) => void;
}

interface SlashState {
  open: boolean;
  top: number;
  left: number;
  filter: string;
  from: number;        // position of '/' in the doc
}

interface MentionState {
  open: boolean;
  top: number;
  left: number;
  filter: string;
  from: number;        // position of '@' in the doc
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ currentPageId, content, onChange, onCreateSubpage, header, allPages, onSelectPage }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [slash, setSlash] = useState<SlashState>({ open: false, top: 0, left: 0, filter: '', from: -1 });
  const [mention, setMention] = useState<MentionState>({ open: false, top: 0, left: 0, filter: '', from: -1 });
  const [isRawMode, setIsRawMode] = useState(false);
  const [rawText, setRawText] = useState('');

  const backlinks = React.useMemo(() => {
    if (!currentPageId || !allPages) return [];
    return allPages.filter(p => {
      if (p.id === currentPageId) return false;
      const contentStr = JSON.stringify(p.content || '');
      return contentStr.includes(currentPageId);
    });
  }, [allPages, currentPageId]);

  const closeSlash = useCallback(() => {
    setSlash((s) => ({ ...s, open: false, filter: '', from: -1 }));
  }, []);

  const closeMention = useCallback(() => {
    setMention((s) => ({ ...s, open: false, filter: '', from: -1 }));
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "Type '/' for block commands, or start writing..." }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ transformPastedText: true, transformCopiedText: true }),
      Callout,
      ToggleBlock,
    ],
    content: content || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON());
      const { selection: { $from } } = ed.state;
      const text = $from.parent.textContent;
      const offset = $from.parentOffset;

      const slashIdx = text.lastIndexOf('/', offset - 1);
      const mentionIdx = text.lastIndexOf('@', offset - 1);

      if (slashIdx !== -1 && (slashIdx === 0 || text.charAt(slashIdx - 1) === ' ') && slashIdx === offset - 1) {
        const domAt = ed.view.domAtPos($from.pos);
        const el = (domAt.node as HTMLElement).closest?.('p, li, div') ?? domAt.node as HTMLElement;
        const rect = el.getBoundingClientRect?.() ?? { bottom: 0, left: 0 };
        const wrap = wrapRef.current?.getBoundingClientRect() ?? { top: 0, left: 0 };
        const filter = text.slice(slashIdx + 1, offset);
        setSlash({
          open: true,
          top: rect.bottom - wrap.top + 4,
          left: Math.min(rect.left - wrap.left, 300),
          filter,
          from: $from.pos - filter.length - 1,
        });
        closeMention();
      } else if (mentionIdx !== -1 && (mentionIdx === 0 || text.charAt(mentionIdx - 1) === ' ') && mentionIdx === offset - 1) {
        const domAt = ed.view.domAtPos($from.pos);
        const el = (domAt.node as HTMLElement).closest?.('p, li, div') ?? domAt.node as HTMLElement;
        const rect = el.getBoundingClientRect?.() ?? { bottom: 0, left: 0 };
        const wrap = wrapRef.current?.getBoundingClientRect() ?? { top: 0, left: 0 };
        const filter = text.slice(mentionIdx + 1, offset);
        setMention({
          open: true,
          top: rect.bottom - wrap.top + 4,
          left: Math.min(rect.left - wrap.left, 300),
          filter,
          from: $from.pos - filter.length - 1,
        });
        closeSlash();
      } else {
        if (slash.open) {
          const textBeforeCursor = text.slice(0, offset);
          const lastSlash = textBeforeCursor.lastIndexOf('/');
          if (lastSlash !== -1) {
            const filter = textBeforeCursor.slice(lastSlash + 1);
            if (!filter.includes(' ')) {
              setSlash((s) => ({ ...s, filter }));
            } else {
              closeSlash();
            }
          } else {
            closeSlash();
          }
        } else if (mention.open) {
          const textBeforeCursor = text.slice(0, offset);
          const lastMention = textBeforeCursor.lastIndexOf('@');
          if (lastMention !== -1) {
            const filter = textBeforeCursor.slice(lastMention + 1);
            if (!filter.includes(' ')) {
              setMention((m) => ({ ...m, filter }));
            } else {
              closeMention();
            }
          } else {
            closeMention();
          }
        }
      }
    },
  });

  // Sync content on page switch
  useEffect(() => {
    if (!editor || !content) return;
    const curr = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(content);
    if (curr !== next) {
      editor.commands.setContent(content, { emitUpdate: false });
      closeSlash();
    }
  }, [content, editor, closeSlash]);

  useEffect(() => {
    if (editor && isRawMode) {
      // Sync raw mode string when component mounts/remounts if needed, though state handles it.
    }
  }, [editor, isRawMode]);

  const toggleRawMode = () => {
    if (!editor) return;
    if (!isRawMode) {
      setRawText((editor.storage as any).markdown.getMarkdown());
      setIsRawMode(true);
    } else {
      const html = marked.parse(rawText) as string;
      editor.commands.setContent(html);
      setIsRawMode(false);
    }
  };

  const handleRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    if (!editor) return;
    const html = marked.parse(val) as string;
    editor.commands.setContent(html, { emitUpdate: false });
    onChange(editor.getJSON());
  };

  const handleSelectSlashItem = useCallback((item: SlashMenuItem) => {
    if (!editor) return;
    closeSlash();

    // Delete '/<filter>' text typed
    const { selection: { $from } } = editor.state;
    const offset = $from.parentOffset;
    const text = $from.parent.textContent.slice(0, offset);
    const slashIdx = text.lastIndexOf('/');
    if (slashIdx !== -1) {
      const deleteFrom = $from.pos - (offset - slashIdx);
      const deleteTo = $from.pos;
      editor.chain().focus().deleteRange({ from: deleteFrom, to: deleteTo }).run();
    }

    // Execute command
    if (item.id === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editor.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      item.command(editor, onCreateSubpage);
    }
  }, [editor, closeSlash, onCreateSubpage]);

  const handleSelectMentionItem = useCallback((page: Page) => {
    if (!editor) return;
    closeMention();

    // Delete '@<filter>' text typed
    const { selection: { $from } } = editor.state;
    const offset = $from.parentOffset;
    const text = $from.parent.textContent.slice(0, offset);
    const mentionIdx = text.lastIndexOf('@');
    if (mentionIdx !== -1) {
      const deleteFrom = $from.pos - (offset - mentionIdx);
      const deleteTo = $from.pos;
      editor.chain().focus().deleteRange({ from: deleteFrom, to: deleteTo })
        .insertContent(`<a href="/pages/${page.id}" class="mention-chip" data-page-id="${page.id}">@${page.title || 'Untitled'}</a> `)
        .run();
    }
  }, [editor, closeMention]);

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const mentionLink = target.closest('.mention-chip') as HTMLElement;
    if (mentionLink) {
      e.preventDefault();
      const pageId = mentionLink.getAttribute('data-page-id');
      if (pageId) {
        onSelectPage(pageId);
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest?.('.nb-slash-menu')) closeSlash();
        if (!(e.target as HTMLElement).closest?.('.nb-mention-menu')) closeMention();
        handleEditorClick(e);
      }}
    >
      {/* Mode Toggle Button */}
      <div style={{ position: 'absolute', top: 16, left: 24, zIndex: 5 }}>
        <button
          onClick={toggleRawMode}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 'var(--radius-md)',
            backgroundColor: isRawMode ? 'var(--surface-3)' : 'var(--surface-1)',
            border: '1px solid var(--hairline-strong)',
            color: isRawMode ? 'var(--ink)' : 'var(--ink-subtle)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.1s ease'
          }}
          title="Toggle Markdown Mode"
        >
          {isRawMode ? <Edit3 size={14} /> : <FileCode2 size={14} />}
          {isRawMode ? 'WYSIWYG' : 'Raw Markdown'}
        </button>
      </div>

      {/* Editor scroll area */}
      <div className="nb-editor-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {header}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div className="nb-editor-inner" style={{ flex: 1, maxWidth: 900, minWidth: 0 }}>
          {isRawMode ? (
            <textarea
              value={rawText}
              onChange={handleRawChange}
              className="nb-editor-raw"
              placeholder="Write your markdown here..."
              autoFocus
            />
          ) : (
            <>
              <EditorContent editor={editor} />
              
              {/* Backlinks panel */}
              {backlinks.length > 0 && (
                <div style={{
                  marginTop: 32,
                  padding: '16px 0',
                  borderTop: '1px solid var(--hairline)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-tertiary)', marginBottom: 8 }}>
                    Backlinks ({backlinks.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {backlinks.map(page => (
                      <div 
                        key={page.id}
                        onClick={() => onSelectPage(page.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                          color: 'var(--ink-subtle)',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          alignSelf: 'flex-start',
                          transition: 'background 0.1s ease, color 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                          e.currentTarget.style.color = 'var(--ink)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--ink-subtle)';
                        }}
                      >
                        <PageIcon name={page.icon || 'FileText'} size={14} color="var(--ink-subtle)" />
                        <span style={{ fontWeight: 500 }}>{page.title || 'Untitled'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline toolbar hint */}
              <div style={{
                marginTop: 24,
                padding: '16px 0',
                borderTop: '1px solid var(--hairline)',
                display: 'flex', gap: 24,
                fontSize: 13, color: 'var(--ink-tertiary)',
              }}>
                <span><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>/ </span>Commands</span>
                <span><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>⌘B </span>Bold</span>
                <span><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>⌘I </span>Italic</span>
                <span><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>⌘E </span>Code</span>
                <span><span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>⌘K </span>Search</span>
              </div>
            </>
          )}
          </div>
          {!isRawMode && (
            <div style={{ width: 220, flexShrink: 0, paddingTop: 24, paddingRight: 32 }}>
              <div style={{ position: 'sticky', top: 32 }}>
                <TableOfContents editor={editor} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slash command menu */}
      <div className="nb-slash-menu" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%' }}>
        <div style={{ position: 'relative', pointerEvents: 'all' }}>
          <SlashMenu
            isOpen={slash.open}
            position={{ top: slash.top, left: slash.left + 64 }}
            filterText={slash.filter}
            onClose={closeSlash}
            onSelectItem={handleSelectSlashItem}
          />
        </div>
      </div>

      {/* Mention menu */}
      <div className="nb-mention-menu" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%' }}>
        <div style={{ position: 'relative', pointerEvents: 'all' }}>
          <MentionMenu
            isOpen={mention.open}
            position={{ top: mention.top, left: mention.left + 64 }}
            filterText={mention.filter}
            pages={allPages}
            onClose={closeMention}
            onSelectItem={handleSelectMentionItem}
          />
        </div>
      </div>
    </div>
  );
};
