import { pgTable, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // We can use clerk or standard UUID
  username: text('username').notNull().unique(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const issues = pgTable('issues', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull(), // 'Todo' | 'In Progress' | 'Done' | 'Canceled'
  priority: text('priority').notNull(), // 'No Priority' | 'Low' | 'Medium' | 'High' | 'Urgent'
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    projectIdx: index('issues_project_idx').on(table.projectId),
    createdIdx: index('issues_created_idx').on(table.createdAt),
  };
});

export const pages = pgTable('pages', {
  id: text('id').primaryKey(),
  parentId: text('parent_id'), // self-referential
  title: text('title').notNull(),
  icon: text('icon'),
  content: jsonb('content'),
  isFavorite: boolean('is_favorite').default(false),
  isDeleted: boolean('is_deleted').default(false),
  coverColor: text('cover_color'),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  position: integer('position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    parentIdx: index('pages_parent_idx').on(table.parentId),
    projectIdx: index('pages_project_idx').on(table.projectId),
    positionIdx: index('pages_position_idx').on(table.position),
  };
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  issues: many(issues),
  pages: many(pages),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
}));

export const pagesRelations = relations(pages, ({ one }) => ({
  project: one(projects, {
    fields: [pages.projectId],
    references: [projects.id],
  }),
}));
