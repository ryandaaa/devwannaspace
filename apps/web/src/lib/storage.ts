import type { Page, Project, Issue, NotificationItem } from '../types';

const STORAGE_KEY = 'nebula_docs_pages_v1';

export const DEFAULT_PAGES: Page[] = [
  {
    id: 'getting-started',
    parentId: null,
    title: 'Getting Started with Nebula Docs',
    icon: '⚡',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Welcome to Nebula Docs' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Nebula Docs is a dense, keyboard-first workspace built for high-performance software engineering teams. Styled in signature ' },
            { type: 'text', marks: [{ type: 'code' }], text: '#08080a' },
            { type: 'text', text: ' canvas dark mode with lavender accents and zero-radius sharp corners.' }
          ]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Press ' },
            { type: 'text', marks: [{ type: 'bold' }], text: '⌘K' },
            { type: 'text', text: ' anywhere to open global search, or type ' },
            { type: 'text', marks: [{ type: 'code' }], text: '/' },
            { type: 'text', text: ' in any empty line to trigger the block creation palette.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Core Capabilities' }]
        },
        {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'TipTap Block Editor with 14+ block types' }] }]
            },
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nested page tree hierarchy with drag & drop feel' }] }]
            },
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Instant ⌘K global search across titles and document body' }] }]
            },
            {
              type: 'taskItem',
              attrs: { checked: false },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Emoji page icons & dark mode design tokens' }] }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Code Block Example' }]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'typescript' },
          content: [
            {
              type: 'text',
              text: `// Hono API Worker Entrypoint
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/pages', async (c) => {
  return c.json({ status: 'active', system: 'Nebula Engine v1.0' });
});

export default app;`
            }
          ]
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '"Density is the protagonist. A working engineer should see structure and content without unnecessary whitespace clutter."' }]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'architecture-spec',
    parentId: 'getting-started',
    title: 'Architecture & Database Specs',
    icon: '🛠️',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Cloudflare Worker + Neon Schema' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Our document engine runs on Hono in Cloudflare Workers and persists to Neon PostgreSQL serverless using Drizzle ORM.' }]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'sql' },
          content: [
            {
              type: 'text',
              text: `CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES pages(id),
  title TEXT NOT NULL DEFAULT 'Untitled',
  icon TEXT,
  content JSONB,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);`
            }
          ]
        }
      ]
    }
  },
  {
    id: 'design-system',
    parentId: null,
    title: 'Nebula Design System Reference',
    icon: '🎨',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Canonical Design Tokens' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The product surface is the darkest surface in the system (#08080a). Border-radius is 0px everywhere.' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Primary Lavender: #5e6ad2' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hover Primary: #828fff' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Main Panel: #0a0a0c' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hairline Divider: #1b1d21' }] }]
            }
          ]
        }
      ]
    }
  }
];

export function getStoredPages(): Page[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PAGES));
      return DEFAULT_PAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored pages', e);
    return DEFAULT_PAGES;
  }
}

export function saveStoredPages(pages: Page[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error('Failed to save pages', e);
  }
}

const PROJECTS_KEY = 'nebula_projects_v1';
const ISSUES_KEY = 'nebula_issues_v1';
const NOTIFICATIONS_KEY = 'nebula_notifications_v1';

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Backend API', color: 'var(--tag-orange)', createdAt: new Date().toISOString() },
  { id: 'proj-2', name: 'Frontend Rewrite', color: 'var(--primary)', createdAt: new Date().toISOString() },
  { id: 'proj-3', name: 'Design System', color: 'var(--tag-purple)', createdAt: new Date().toISOString() }
];

export const DEFAULT_ISSUES: Issue[] = [
  { id: 'iss-1', title: 'Implement WebSocket connections', description: 'Real-time updates for editor', status: 'In Progress', priority: 'High', projectId: 'proj-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'iss-2', title: 'Redesign Sidebar', description: 'Make it collapsible and sleek', status: 'Done', priority: 'Medium', projectId: 'proj-2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'iss-3', title: 'Add dark mode toggle', description: 'Support light mode too?', status: 'Todo', priority: 'Low', projectId: 'proj-2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Welcome to Nebula', message: 'Explore the new features!', isRead: false, createdAt: new Date().toISOString() }
];

export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PROJECTS;
  }
}

export function saveStoredProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getStoredIssues(): Issue[] {
  try {
    const raw = localStorage.getItem(ISSUES_KEY);
    if (!raw) {
      localStorage.setItem(ISSUES_KEY, JSON.stringify(DEFAULT_ISSUES));
      return DEFAULT_ISSUES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_ISSUES;
  }
}

export function saveStoredIssues(issues: Issue[]) {
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: NotificationItem[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
}
