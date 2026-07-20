# devwannaspace

A minimalist, high-performance workspace combining document editing and issue tracking. Built with a dark-mode first, utilitarian aesthetic.

## Architecture

This project is structured as a monorepo containing both the frontend web application and the serverless API backend.

### Tech Stack
- **Frontend (`apps/web`)**: React 19, Vite, Tiptap (Rich Text Editor), Vanilla CSS.
- **Backend (`apps/api`)**: Cloudflare Workers, Hono (Routing), Drizzle ORM.
- **Database**: Neon (Serverless Postgres).
- **Deployment**: Cloudflare Pages (Frontend) & Cloudflare Workers (Backend).

## Repository Structure

```text
.
├── apps/
│   ├── api/          # Cloudflare Workers backend (Hono + Drizzle)
│   └── web/          # React frontend (Vite)
├── DESIGN.md         # Strict design system tokens and rules
├── mobile_app_context.md # API and Architecture context for mobile ports
└── package.json      # Workspace root
```

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm workspace support
- A Neon Postgres database URL

### 1. Environment Setup

Configure the backend environment variables:

```sh
cd apps/api
cp .env.example .env
```
Update `.env` with your Neon database connection string:
`DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`

### 2. Install Dependencies

From the root directory:
```sh
npm install
```

### 3. Database Initialization

Push the database schema to your Neon instance and seed it with the starter pack:

```sh
# Push schema
npm run db:push -w api

# Seed initial data (Starter project, Welcome page, sample issues)
npm run db:seed -w api
```

### 4. Running Locally

You can run both the API and Web frontend concurrently from the root directory:

```sh
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8787

## Deployment

### Backend (Cloudflare Workers)
Deploy the Hono API to Cloudflare Workers:
```sh
npm run deploy -w api
```
*Note: You must configure the `DATABASE_URL` secret in Cloudflare for production via `npx wrangler secret put DATABASE_URL`.*

### Frontend (Cloudflare Pages)
Build the frontend and deploy to Cloudflare Pages:
```sh
npm run build:web
npx wrangler pages deploy apps/web/dist --project-name=devwannaspace
```
*(The frontend automatically resolves the API base URL based on the hostname).*

## Design System

The application strictly follows a custom, brutalist UI system defined in `tokens.css`. All interactive elements utilize precise `cubic-bezier` micro-animations. 

For future extensions or mobile app ports, refer directly to `DESIGN.md` for exact hex codes, 0px border-radii constraints, and keyframe specifications. Do not deviate from these tokens.

## License
MIT
