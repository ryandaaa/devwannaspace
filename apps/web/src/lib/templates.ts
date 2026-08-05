export interface PageTemplate {
  id: string;
  name: string;
  iconName: string;
  description: string;
  content: any; // TipTap JSON
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Page',
    iconName: 'File',
    description: 'Start a blank page from scratch',
    content: { type: 'doc', content: [{ type: 'paragraph' }] }
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    iconName: 'Users',
    description: 'Agenda, discussion notes, and action items',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Meeting Notes' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Date: ' }, { type: 'text', text: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), marks: [{ type: 'bold' }] }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Agenda' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '• Write main discussion topics here' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Discussion' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Capture key notes, decisions, and discussions...' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Action Items' }] },
        {
          type: 'taskList',
          content: [
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Assign task 1' }] }] },
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Assign task 2' }] }] }
          ]
        }
      ]
    }
  },
  {
    id: 'prd',
    name: 'Product Spec (PRD)',
    iconName: 'Box',
    description: 'Problem, goal, functional requirements, and releases',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Product Requirement Document' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '1. Objective & Problem' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'What problem does this solve and why are we building it?' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '2. User Personas' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Describe target users for this product or feature.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '3. Functional Requirements' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'List the detailed workflow requirements.' }] }
      ]
    }
  },
  {
    id: 'weekly',
    name: 'Weekly Review',
    iconName: 'Calendar',
    description: 'Progress, blockers, wins, and next week plan',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Weekly Review' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Wins' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'What did we accomplish successfully this week?' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Blockers' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'What issues or blockers are currently active?' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Next Week Focus' }] },
        {
          type: 'taskList',
          content: [
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Goal 1' }] }] }
          ]
        }
      ]
    }
  }
];
