import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';
import { cors } from 'hono/cors';
const app = new Hono();
app.use('*', cors());
app.get('/', (c) => {
    return c.text('API is running!');
});
// Helper to initialize DB
const getDb = (c) => {
    const sql = neon(c.env.DATABASE_URL);
    return drizzle(sql, { schema });
};
// Helper to convert date strings to Date objects for Drizzle
const parseDates = (body) => {
    if (body.createdAt)
        body.createdAt = new Date(body.createdAt);
    if (body.updatedAt)
        body.updatedAt = new Date(body.updatedAt);
    if (body.dueDate)
        body.dueDate = new Date(body.dueDate);
    return body;
};
// --- PROJECTS API ---
app.get('/api/projects', async (c) => {
    const db = getDb(c);
    const allProjects = await db.query.projects.findMany({
        orderBy: (projects, { desc }) => [desc(projects.createdAt)]
    });
    return c.json(allProjects);
});
app.post('/api/projects', async (c) => {
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    const [project] = await db.insert(schema.projects).values(body).returning();
    return c.json(project);
});
app.put('/api/projects/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    const [project] = await db.update(schema.projects).set(body).where(eq(schema.projects.id, id)).returning();
    return c.json(project);
});
app.delete('/api/projects/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
    return c.json({ success: true });
});
// --- ISSUES API ---
app.get('/api/issues', async (c) => {
    const db = getDb(c);
    const allIssues = await db.query.issues.findMany({
        orderBy: (issues, { desc }) => [desc(issues.createdAt)]
    });
    return c.json(allIssues);
});
app.post('/api/issues', async (c) => {
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    const [issue] = await db.insert(schema.issues).values(body).returning();
    return c.json(issue);
});
app.put('/api/issues/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    // Ensure updatedAt is refreshed
    body.updatedAt = new Date();
    const [issue] = await db.update(schema.issues).set(body).where(eq(schema.issues.id, id)).returning();
    return c.json(issue);
});
app.delete('/api/issues/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.issues).where(eq(schema.issues.id, id));
    return c.json({ success: true });
});
// --- PAGES API ---
app.get('/api/pages', async (c) => {
    const db = getDb(c);
    const allPages = await db.query.pages.findMany({
        orderBy: (pages, { asc }) => [asc(pages.position)]
    });
    return c.json(allPages);
});
app.post('/api/pages', async (c) => {
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    const [page] = await db.insert(schema.pages).values(body).returning();
    return c.json(page);
});
app.put('/api/pages/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    body.updatedAt = new Date();
    const [page] = await db.update(schema.pages).set(body).where(eq(schema.pages.id, id)).returning();
    return c.json(page);
});
app.delete('/api/pages/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.pages).where(eq(schema.pages.id, id));
    return c.json({ success: true });
});
// --- NOTIFICATIONS API ---
app.get('/api/notifications', async (c) => {
    const db = getDb(c);
    const allNotifs = await db.query.notifications.findMany({
        orderBy: (notifs, { desc }) => [desc(notifs.createdAt)]
    });
    return c.json(allNotifs);
});
app.post('/api/notifications', async (c) => {
    const db = getDb(c);
    let body = await c.req.json();
    body = parseDates(body);
    const [notif] = await db.insert(schema.notifications).values(body).returning();
    return c.json(notif);
});
app.put('/api/notifications/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    let body = await c.req.json();
    body = parseDates(body);
    const [notif] = await db.update(schema.notifications).set(body).where(eq(schema.notifications.id, id)).returning();
    return c.json(notif);
});
app.delete('/api/notifications/:id', async (c) => {
    const db = getDb(c);
    const id = c.req.param('id');
    await db.delete(schema.notifications).where(eq(schema.notifications.id, id));
    return c.json({ success: true });
});
export default app;
