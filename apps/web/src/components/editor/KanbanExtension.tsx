import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { KanbanNodeView } from './KanbanNodeView';

export const KanbanExtension = Node.create({
  name: 'kanbanBoard',
  group: 'block',
  atom: true, // Treat as a single isolated block

  addAttributes() {
    return {
      columns: {
        default: [
          { id: 'todo', title: 'To Do', cards: [{ id: 'c1', text: 'Draft proposal' }] },
          { id: 'in-progress', title: 'In Progress', cards: [{ id: 'c2', text: 'Review designs' }] },
          { id: 'done', title: 'Done', cards: [{ id: 'c3', text: 'Kickoff meeting' }] }
        ],
        parseHTML: element => {
          const cols = element.getAttribute('data-columns');
          if (cols) {
            try { return JSON.parse(cols); } catch (e) { return null; }
          }
          return null;
        },
        renderHTML: attributes => {
          if (!attributes.columns) return {};
          return { 'data-columns': JSON.stringify(attributes.columns) };
        }
      }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="kanban-board"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'kanban-board' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KanbanNodeView);
  },

  addCommands() {
    return {
      insertKanbanBoard: () => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
        });
      },
    } as any;
  }
});
