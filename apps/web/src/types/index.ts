export interface Page {
  id: string;
  parentId: string | null;
  title: string;
  icon?: string | null;
  content: any; // TipTap JSON content
  isFavorite?: boolean;
  isDeleted?: boolean;
  coverColor?: string;
  createdAt: string;
  updatedAt: string;
  position?: number;
  projectId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
}

export interface SlashMenuItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'Text' | 'Lists' | 'Structure' | 'Callout';
  command: (editor: any, createSubpage?: () => void) => void;
}

export type ViewState = 
  | { type: 'page'; id: string }
  | { type: 'my_issues' }
  | { type: 'all_pages' }
  | { type: 'project'; id: string };

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
}

export type IssueStatus = 'Todo' | 'In Progress' | 'Done' | 'Canceled';
export type IssuePriority = 'No Priority' | 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Issue {
  id: string;
  title: string;
  description: string; 
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
