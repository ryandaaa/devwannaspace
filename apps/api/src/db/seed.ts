import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { resolve, join } from 'path';

// Load .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding Starter Pack into Neon Database...');

  const projectId = `proj-${Date.now()}`;
  const welcomePageId = `page-${Date.now()}-1`;
  const getStartedPageId = `page-${Date.now()}-2`;

  console.log('Inserting Project...');
  await db.insert(schema.projects).values({
    id: projectId,
    name: 'Starter Project',
    color: '#5e6ad2',
    description: 'A place to get started with devwannaspace.',
    createdAt: new Date(),
  });

  console.log('Inserting Pages...');
  await db.insert(schema.pages).values([
    {
      id: welcomePageId,
      title: 'Welcome to devwannaspace',
      icon: 'Heart',
      parentId: null,
      projectId: projectId,
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Welcome to devwannaspace! 👋' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'This is your new favorite workspace. It combines the power of structured pages, real-time collaboration, and issue tracking in one sleek package.' }] },
          { type: 'callout', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'You can use the Command Palette (Cmd+K) to navigate anywhere.' }] }] },
        ]
      },
      isFavorite: true,
      isDeleted: false,
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: getStartedPageId,
      title: 'Getting Started',
      icon: 'Rocket',
      parentId: null,
      projectId: projectId,
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Quick Tips' }] },
          { type: 'bulletList', content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Type `/` in the editor to open slash commands.' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Toggle the sidebar with Cmd+\\' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Organize pages into projects!' }] }] }
          ] }
        ]
      },
      isFavorite: false,
      isDeleted: false,
      position: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  console.log('Inserting Issues...');
  await db.insert(schema.issues).values([
    {
      id: `issue-${Date.now()}-1`,
      projectId: projectId,
      title: 'Explore the workspace',
      description: 'Try creating a new page, assigning an icon, and writing some Markdown.',
      status: 'Todo',
      priority: 'High',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `issue-${Date.now()}-2`,
      projectId: projectId,
      title: 'Setup Custom Profile',
      description: 'Go to Account Settings to update your name and avatar image.',
      status: 'Todo',
      priority: 'Medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  console.log('✅ Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
