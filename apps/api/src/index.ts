import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import { eq, and } from 'drizzle-orm';
import { cors } from 'hono/cors';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

export type Env = {
  DATABASE_URL: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());
// Apply Clerk middleware to all API routes
app.use('/api/*', (c, next) => {
  const middleware = clerkMiddleware({
    secretKey: c.env.CLERK_SECRET_KEY,
    publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
  });
  return middleware(c, next);
});

app.get('/', (c) => {
  return c.text('API is running!');
});

// Helper to initialize DB
const getDb = (c: any) => {
  const sql = neon(c.env.DATABASE_URL);
  return drizzle(sql, { schema });
};

// Helper to convert date strings to Date objects for Drizzle
const parseDates = (body: any) => {
  if (body.createdAt) body.createdAt = new Date(body.createdAt);
  if (body.updatedAt) body.updatedAt = new Date(body.updatedAt);
  if (body.dueDate) body.dueDate = new Date(body.dueDate);
  return body;
};

// Helper to get authenticated userId
const requireAuth = (c: any) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    throw new Error('Unauthorized');
  }
  return auth.userId;
};

// --- PROJECTS API ---
app.get('/api/projects', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const userProjects = await db.query.projects.findMany({
      where: eq(schema.projects.userId, userId),
      orderBy: (projects, { desc }) => [desc(projects.createdAt)]
    });
    return c.json(userProjects);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.post('/api/projects', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    body.userId = userId; // Attach user ID
    const [project] = await db.insert(schema.projects).values(body).returning();
    return c.json(project);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.put('/api/projects/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    const [project] = await db.update(schema.projects)
      .set(body)
      .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, userId)))
      .returning();
    return c.json(project);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.delete('/api/projects/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.projects).where(and(eq(schema.projects.id, id), eq(schema.projects.userId, userId)));
    await db.insert(schema.syncDeletions).values({
      id: `del-${Date.now()}-${id}`,
      userId,
      tableName: 'projects',
      recordId: id,
    });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});


// --- ISSUES API ---
app.get('/api/issues', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const userIssues = await db.query.issues.findMany({
      where: eq(schema.issues.userId, userId),
      orderBy: (issues, { desc }) => [desc(issues.createdAt)]
    });
    return c.json(userIssues);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.post('/api/issues', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    body.userId = userId;
    const [issue] = await db.insert(schema.issues).values(body).returning();
    return c.json(issue);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.put('/api/issues/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    body.updatedAt = new Date();
    const [issue] = await db.update(schema.issues)
      .set(body)
      .where(and(eq(schema.issues.id, id), eq(schema.issues.userId, userId)))
      .returning();
    return c.json(issue);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.delete('/api/issues/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.issues).where(and(eq(schema.issues.id, id), eq(schema.issues.userId, userId)));
    await db.insert(schema.syncDeletions).values({
      id: `del-${Date.now()}-${id}`,
      userId,
      tableName: 'issues',
      recordId: id,
    });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});


// --- PAGES API ---
app.get('/api/pages', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const userPages = await db.query.pages.findMany({
      where: eq(schema.pages.userId, userId),
      orderBy: (pages, { asc }) => [asc(pages.position)]
    });
    return c.json(userPages);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.post('/api/pages', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    body.userId = userId;
    const [page] = await db.insert(schema.pages).values(body).returning();
    return c.json(page);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.put('/api/pages/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    body.updatedAt = new Date();
    const [page] = await db.update(schema.pages)
      .set(body)
      .where(and(eq(schema.pages.id, id), eq(schema.pages.userId, userId)))
      .returning();
    return c.json(page);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.delete('/api/pages/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.pages).where(and(eq(schema.pages.id, id), eq(schema.pages.userId, userId)));
    await db.insert(schema.syncDeletions).values({
      id: `del-${Date.now()}-${id}`,
      userId,
      tableName: 'pages',
      recordId: id,
    });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});


// --- NOTIFICATIONS API ---
app.get('/api/notifications', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const userNotifs = await db.query.notifications.findMany({
      where: eq(schema.notifications.userId, userId),
      orderBy: (notifs, { desc }) => [desc(notifs.createdAt)]
    });
    return c.json(userNotifs);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.post('/api/notifications', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    body.userId = userId;
    const [notif] = await db.insert(schema.notifications).values(body).returning();
    return c.json(notif);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.put('/api/notifications/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    const [notif] = await db.update(schema.notifications)
      .set(body)
      .where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId)))
      .returning();
    return c.json(notif);
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.delete('/api/notifications/:id', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.notifications).where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId)));
    await db.insert(schema.syncDeletions).values({
      id: `del-${Date.now()}-${id}`,
      userId,
      tableName: 'notifications',
      recordId: id,
    });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});


// --- WATERMELONDB SYNC API ---
import { gt } from 'drizzle-orm';

app.get('/api/sync', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const lastPulledAt = parseInt(c.req.query('since') || '0', 10);
    const sinceDate = new Date(lastPulledAt);

    // Helper to fetch created/updated records
    const fetchChanges = async (table: any) => {
      const tableSchema = schema[table as keyof typeof schema] as any;
      const allChanges = await (db.query as any)[table].findMany({
        where: and(eq(tableSchema.userId, userId), gt(tableSchema.updatedAt, sinceDate))
      });
      
      const formatRecord = (item: any) => {
        const mapped: any = { ...item };
        // Map common fields to snake_case for WatermelonDB
        if (item.createdAt) mapped.created_at = item.createdAt.getTime();
        if (item.updatedAt) mapped.updated_at = item.updatedAt.getTime();
        if (item.dueDate) mapped.due_date = item.dueDate.getTime();
        if (item.projectId !== undefined) mapped.project_id = item.projectId;
        if (item.parentId !== undefined) mapped.parent_id = item.parentId;
        if (item.isFavorite !== undefined) mapped.is_favorite = item.isFavorite;
        if (item.isDeleted !== undefined) mapped.is_deleted = item.isDeleted;
        if (item.isRead !== undefined) mapped.is_read = item.isRead;
        if (item.coverColor !== undefined) mapped.cover_color = item.coverColor;
        if (item.content !== undefined && typeof item.content !== 'string') mapped.content = JSON.stringify(item.content);
        return mapped;
      };

      const created = allChanges.filter((item: any) => item.createdAt > sinceDate).map(formatRecord);
      const updated = allChanges.filter((item: any) => item.createdAt <= sinceDate).map(formatRecord);
      
      const deletions = await db.query.syncDeletions.findMany({
        where: and(
          eq(schema.syncDeletions.userId, userId),
          eq(schema.syncDeletions.tableName, table),
          gt(schema.syncDeletions.deletedAt, sinceDate)
        )
      });
      const deleted = deletions.map((d: any) => d.recordId);
      
      return { created, updated, deleted };
    };

    const changes = {
      projects: await fetchChanges('projects'),
      issues: await fetchChanges('issues'),
      pages: await fetchChanges('pages'),
      notifications: await fetchChanges('notifications'),
    };

    return c.json({
      changes,
      timestamp: Date.now()
    });
  } catch (err) {
    return c.json({ error: 'Sync pull failed' }, 500);
  }
});

app.post('/api/sync', async (c) => {
  try {
    const userId = requireAuth(c);
    const db = getDb(c);
    const body = await c.req.json();
    const { changes } = body;

    if (!changes) return c.json({ success: true });

    // Process pushes (last write wins)
    for (const table of ['projects', 'issues', 'pages', 'notifications']) {
      const tableChanges = changes[table];
      if (!tableChanges) continue;
      
      const dbTable = schema[table as keyof typeof schema] as any;

      const unformatRecord = (item: any) => {
        const unmapped: any = { ...item };
        unmapped.userId = userId;
        if (item.created_at) unmapped.createdAt = new Date(item.created_at);
        if (item.updated_at) unmapped.updatedAt = new Date(item.updated_at);
        if (item.due_date) unmapped.dueDate = new Date(item.due_date);
        if (item.project_id !== undefined) unmapped.projectId = item.project_id;
        if (item.parent_id !== undefined) unmapped.parentId = item.parent_id;
        if (item.is_favorite !== undefined) unmapped.isFavorite = item.is_favorite;
        if (item.is_deleted !== undefined) unmapped.isDeleted = item.is_deleted;
        if (item.is_read !== undefined) unmapped.isRead = item.is_read;
        if (item.cover_color !== undefined) unmapped.coverColor = item.cover_color;
        if (typeof item.content === 'string') {
          try {
            unmapped.content = JSON.parse(item.content);
          } catch (e) {
            unmapped.content = null;
          }
        }
        
        // Remove snake_case keys
        delete unmapped.created_at;
        delete unmapped.updated_at;
        delete unmapped.due_date;
        delete unmapped.project_id;
        delete unmapped.parent_id;
        delete unmapped.is_favorite;
        delete unmapped.is_deleted;
        delete unmapped.is_read;
        delete unmapped.cover_color;
        
        return unmapped;
      };

      // Created
      if (tableChanges.created?.length > 0) {
        const insertData = tableChanges.created.map((item: any) => ({
          ...unformatRecord(item),
          createdAt: new Date(item.created_at || Date.now()),
          updatedAt: new Date(item.updated_at || Date.now()),
        }));
        await db.insert(dbTable).values(insertData).onConflictDoNothing();
      }

      // Updated
      if (tableChanges.updated?.length > 0) {
        for (const item of tableChanges.updated) {
          const updateData = {
            ...unformatRecord(item),
            updatedAt: new Date(),
          };
          delete updateData.id; // Don't update primary key
          await db.update(dbTable)
            .set(updateData)
            .where(and(eq(dbTable.id, item.id), eq(dbTable.userId, userId)));
        }
      }

      // Deleted
      if (tableChanges.deleted?.length > 0) {
        for (const id of tableChanges.deleted) {
          await db.delete(dbTable).where(and(eq(dbTable.id, id), eq(dbTable.userId, userId)));
          await db.insert(schema.syncDeletions).values({
            id: `del-${Date.now()}-${id}`,
            userId,
            tableName: table,
            recordId: id,
          });
        }
      }
    }

    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: 'Sync push failed' }, 500);
  }
});

export default app;
