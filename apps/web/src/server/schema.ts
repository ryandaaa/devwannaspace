import { pgTable, uuid, text, timestamp, boolean, real, jsonb } from 'drizzle-orm/pg-core';

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().default('My Workspace'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  parentId: uuid('parent_id'),
  title: text('title').notNull().default('Untitled'),
  icon: text('icon'),
  content: jsonb('content'),
  position: real('position').default(0),
  isFavorite: boolean('is_favorite').default(false),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
