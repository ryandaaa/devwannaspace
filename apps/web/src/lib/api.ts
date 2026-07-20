import type { Page, Project, Issue, NotificationItem } from '../types';

const API_BASE = 'http://localhost:8787/api';

const fetchApi = async (path: string, options?: RequestInit) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
};

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';
type SyncListener = (status: SyncStatus) => void;
let statusListeners: SyncListener[] = [];
let statusTimeout: any;

export const subscribeSyncStatus = (fn: SyncListener) => {
  statusListeners.push(fn);
  return () => {
    statusListeners = statusListeners.filter(f => f !== fn);
  };
};

const setSyncStatus = (status: SyncStatus) => {
  statusListeners.forEach(fn => fn(status));
  if (status === 'saved' || status === 'error') {
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      statusListeners.forEach(fn => fn('idle'));
    }, 2000);
  }
};

// Generic smart sync to avoid rewriting AppShell UI handlers
// It compares the new array with the known current array and issues individual CRUD calls.
async function smartSync<T extends { id: string }>(
  currentItems: T[],
  newItems: T[],
  createFn: (item: T) => Promise<any>,
  updateFn: (id: string, item: T) => Promise<any>,
  deleteFn: (id: string) => Promise<any>
) {
  const oldIds = new Set(currentItems.map(i => i.id));
  const newIds = new Set(newItems.map(i => i.id));
  
  const added = newItems.filter(i => !oldIds.has(i.id));
  const removed = currentItems.filter(i => !newIds.has(i.id));
  const updated = newItems.filter(newVal => {
     const oldVal = currentItems.find(o => o.id === newVal.id);
     return oldVal && JSON.stringify(oldVal) !== JSON.stringify(newVal);
  });

  if (added.length === 0 && removed.length === 0 && updated.length === 0) return;

  setSyncStatus('saving');
  try {
    await Promise.all([
       ...added.map(i => createFn(i)),
       ...updated.map(i => updateFn(i.id, i)),
       ...removed.map(i => deleteFn(i.id))
    ]);
    setSyncStatus('saved');
  } catch (e) {
    console.error('Sync failed:', e);
    setSyncStatus('error');
  }
}

let stateCache = {
  pages: [] as Page[],
  projects: [] as Project[],
  issues: [] as Issue[],
  notifications: [] as NotificationItem[],
};

export const api = {
  // Pages
  getPages: async (): Promise<Page[]> => {
    stateCache.pages = await fetchApi('/pages');
    return stateCache.pages;
  },
  savePages: async (pages: Page[]): Promise<void> => {
    await smartSync(stateCache.pages, pages, 
      (p) => fetchApi('/pages', { method: 'POST', body: JSON.stringify(p) }),
      (id, p) => fetchApi(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
      (id) => fetchApi(`/pages/${id}`, { method: 'DELETE' })
    );
    stateCache.pages = [...pages];
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    stateCache.projects = await fetchApi('/projects');
    return stateCache.projects;
  },
  saveProjects: async (projects: Project[]): Promise<void> => {
    await smartSync(stateCache.projects, projects, 
      (p) => fetchApi('/projects', { method: 'POST', body: JSON.stringify(p) }),
      (id, p) => fetchApi(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
      (id) => fetchApi(`/projects/${id}`, { method: 'DELETE' })
    );
    stateCache.projects = [...projects];
  },

  // Issues
  getIssues: async (): Promise<Issue[]> => {
    stateCache.issues = await fetchApi('/issues');
    return stateCache.issues;
  },
  saveIssues: async (issues: Issue[]): Promise<void> => {
    await smartSync(stateCache.issues, issues, 
      (i) => fetchApi('/issues', { method: 'POST', body: JSON.stringify(i) }),
      (id, i) => fetchApi(`/issues/${id}`, { method: 'PUT', body: JSON.stringify(i) }),
      (id) => fetchApi(`/issues/${id}`, { method: 'DELETE' })
    );
    stateCache.issues = [...issues];
  },

  // Notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    stateCache.notifications = await fetchApi('/notifications');
    return stateCache.notifications;
  },
  saveNotifications: async (notifs: NotificationItem[]): Promise<void> => {
    await smartSync(stateCache.notifications, notifs, 
      (n) => fetchApi('/notifications', { method: 'POST', body: JSON.stringify(n) }),
      (id, n) => fetchApi(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(n) }),
      (id) => fetchApi(`/notifications/${id}`, { method: 'DELETE' })
    );
    stateCache.notifications = [...notifs];
  }
};
