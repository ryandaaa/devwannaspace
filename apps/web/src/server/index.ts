import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'online', system: 'Nebula Docs Engine', timestamp: new Date().toISOString() });
});

// Workspace info
app.get('/api/workspace', (c) => {
  return c.json({
    id: 'nebula-workspace-1',
    name: 'Nebula Docs',
    icon: '⚡',
  });
});

export default app;
