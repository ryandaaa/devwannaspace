# DevWannaSpace — Technical & System Documentation

> **Complete System Architecture, API Specifications, Data Models, Self-Hosting Mechanics, and Developer Guide.**  
> *This document serves as the single source of truth for building the official documentation website and for onboarding contributors.*

---

## 📋 Table of Contents

1. [Executive Summary & Product Philosophy](#1-executive-summary--product-philosophy)
2. [Monorepo & Project Structure](#2-monorepo--project-structure)
3. [Technology Stack Reference](#3-technology-stack-reference)
4. [Database Schema & Data Model (Neon Postgres + Drizzle ORM)](#4-database-schema--data-model-neon-postgres--drizzle-orm)
5. [Backend API Endpoint Specifications (Cloudflare Workers + Hono)](#5-backend-api-endpoint-specifications-cloudflare-workers--hono)
6. [Data Synchronization & Differential Engine (`smartSync`)](#6-data-synchronization--differential-engine-smartsync)
7. [Self-Hosting & BYOC (Bring Your Own Cloud) Mechanics](#7-self-hosting--byoc-bring-your-own-cloud-mechanics)
8. [UI/UX Design System & Custom Tokens](#8-uiux-design-system--custom-tokens)
9. [Frontend Components & Editor Architecture](#9-frontend-components--editor-architecture)
10. [Desktop Native Application (Wails v2 + Go)](#10-desktop-native-application-wails-v2--go)
11. [Error Resilience & Edge Case Handling](#11-error-resilience--edge-case-handling)
12. [Development, Build & Deployment Workflows](#12-development-build--deployment-workflows)

---

## 1. Executive Summary & Product Philosophy

**DevWannaSpace** is an all-in-one digital workspace engineered for developers and power users. It combines document editing (Tiptap Notion-parity), nested hierarchical pages, Kanban boards, project management, and a high-density, brutalist-inspired user interface.

### Core Principles:
- **BYOC (Bring Your Own Cloud) Philosophy**: Zero lock-in. Users can run on our managed infra or self-host their entire backend on free-tier serverless services ($0/month hosting via Cloudflare Workers + Neon DB + Clerk Auth).
- **High-Density Brutalist Aesthetic**: $0.5\text{px}$ to $1\text{px}$ hairlines, zero border-radius (`border-radius: 0`), rich dark themes, and high contrast typography inspired by Linear.app.
- **Instant Responsiveness**: Optimistic UI updates, local state caching, smart differential sync, and keyboard-first navigation (Command Palette `Ctrl+K`).
- **True Multi-Platform**: Shared core frontend compiled to Web (Cloudflare Pages), Desktop (Wails v2 native binaries for Windows/macOS/Linux), and Mobile (Expo React Native).

---

## 2. Monorepo & Project Structure

The project is structured as an NPM Monorepo using workspace routing:

```
devwannaspace/
├── apps/
│   ├── api/                  # Backend: Cloudflare Workers + Hono + Drizzle ORM
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   └── schema.ts # PostgreSQL Database Schema
│   │   │   └── index.ts      # Hono HTTP routes & Clerk Auth Middleware
│   │   ├── wrangler.jsonc    # Cloudflare Worker configuration
│   │   └── drizzle.config.ts # Drizzle Kit configuration
│   ├── web/                  # Frontend Web & Wails UI: React 18 + Vite + Tiptap
│   │   ├── src/
│   │   │   ├── components/   # UI Layouts, Modals, Views, Editor
│   │   │   ├── contexts/     # Auth & Language Contexts
│   │   │   ├── lib/          # API Client (`api.ts`), Smart Sync Engine
│   │   │   ├── styles/       # Design System Tokens (`tokens.css`, `index.css`)
│   │   │   └── types.ts      # TypeScript interfaces
│   │   └── package.json
│   └── mobile/               # Mobile App: Expo / React Native
├── setup.mjs                 # Interactive CLI wizard (@clack/prompts) for 1-command deployment
├── main.go                   # Wails v2 Desktop entrypoint (Go)
├── wails.json                # Wails v2 Application configuration
├── package.json              # Monorepo root configuration
└── README.md
```

---

## 3. Technology Stack Reference

| Tier | Component | Technology | Purpose |
|---|---|---|---|
| **Frontend** | Framework | React 18 + TypeScript | UI component hierarchy and state management |
| | Bundler / HMR | Vite 8 / Rolldown | Ultra-fast local dev server & production bundling |
| | Editor Engine | Tiptap (ProseMirror) | Headless block-based Markdown/Rich-Text editor |
| | Icons | Lucide React | Clean, scalable vector icons |
| | Styling | Vanilla CSS + CSS Variables | Zero runtime CSS overhead, real-time theme swapping |
| **Desktop** | Runtime | Wails v2 (Go 1.20+) | Embeds Vite web frontend in native webview window |
| **Backend** | Runtime | Cloudflare Workers | Edge serverless compute execution |
| | Framework | Hono v4 | Lightweight Web standards-compliant API router |
| | Authentication | Clerk (@hono/clerk-auth) | JWT Verification, User Sessions, Multi-tenant isolation |
| **Database** | Database | Neon Serverless Postgres | Cloud serverless PostgreSQL with WebSocket connection pooling |
| | ORM | Drizzle ORM | Type-safe SQL builder & migration tool |

---

## 4. Database Schema & Data Model (Neon Postgres + Drizzle ORM)

Source File: [`apps/api/src/db/schema.ts`](file:///D:/Dokumen/project/new-web/apps/api/src/db/schema.ts)

### 4.1. Tables Overview

#### `users`
Stores user profile information.
- `id` (`text`, PK): Clerk User ID (`user_...`) or UUID.
- `username` (`text`, Unique, Not Null)
- `avatarUrl` (`text`, Optional)
- `createdAt` (`timestamp`, Default `now()`)

#### `projects`
Workspaces or categories grouping issues and pages.
- `id` (`text`, PK)
- `userId` (`text`, Not Null, Indexed): Foreign key to Clerk User.
- `name` (`text`, Not Null)
- `color` (`text`, Not Null)
- `description` (`text`, Optional)
- `createdAt` (`timestamp`, Default `now()`)
- `updatedAt` (`timestamp`, Default `now()`)

#### `issues`
Kanban board task items.
- `id` (`text`, PK)
- `userId` (`text`, Not Null, Indexed)
- `title` (`text`, Not Null)
- `description` (`text`, Not Null)
- `status` (`text`, Not Null): `'Todo' | 'In Progress' | 'Done' | 'Canceled'`
- `priority` (`text`, Not Null): `'No Priority' | 'Low' | 'Medium' | 'High' | 'Urgent'`
- `projectId` (`text`, FK -> `projects.id` on delete CASCADE)
- `dueDate` (`timestamp`, Optional)
- `createdAt` (`timestamp`, Default `now()`, Indexed)
- `updatedAt` (`timestamp`, Default `now()`)

#### `pages`
Document pages supporting infinite nesting.
- `id` (`text`, PK)
- `userId` (`text`, Not Null, Indexed)
- `parentId` (`text`, Self-Referential FK, Indexed): ID of parent page for recursive nesting.
- `title` (`text`, Not Null)
- `icon` (`text`, Optional): Emoji string or icon name.
- `content` (`jsonb`, Optional): Raw JSON array or Tiptap JSON node document structure.
- `isFavorite` (`boolean`, Default `false`)
- `isDeleted` (`boolean`, Default `false`): Soft-delete flag for Trash Bin.
- `coverColor` (`text`, Optional)
- `projectId` (`text`, FK -> `projects.id` on delete SET NULL)
- `position` (`integer`, Indexed): Sort order index within sidebar / parent.
- `createdAt` (`timestamp`, Default `now()`)
- `updatedAt` (`timestamp`, Default `now()`)

#### `notifications`
System and user activity alerts.
- `id` (`text`, PK)
- `userId` (`text`, Not Null)
- `title` (`text`, Not Null)
- `message` (`text`, Not Null)
- `isRead` (`boolean`, Default `false`)
- `createdAt` (`timestamp`, Default `now()`)
- `updatedAt` (`timestamp`, Default `now()`)

---

## 5. Backend API Endpoint Specifications (Cloudflare Workers + Hono)

All routes require a valid Clerk Bearer JWT Token passed in the HTTP Authorization header (`Authorization: Bearer <clerk_token>`). Cross-Origin Resource Sharing (CORS) is enabled globally.

### 5.1. Common Base URL
- Production Default: `https://api.ryanda-valents3649.workers.dev/api`
- Custom BYOC: `https://<your-worker-subdomain>.workers.dev/api`

### 5.2. Endpoint Reference

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/pages` | Fetch all active pages for current user | None | `Page[]` |
| `POST` | `/api/pages` | Create new page | `Partial<Page>` | `Page` |
| `PUT` | `/api/pages/:id` | Update existing page content/title | `Partial<Page>` | `Page` |
| `DELETE` | `/api/pages/:id` | Permanently delete page | None | `{ success: true }` |
| `GET` | `/api/projects` | Fetch all user projects | None | `Project[]` |
| `POST` | `/api/projects` | Create new project | `Partial<Project>` | `Project` |
| `PUT` | `/api/projects/:id` | Update project metadata | `Partial<Project>` | `Project` |
| `DELETE` | `/api/projects/:id` | Delete project | None | `{ success: true }` |
| `GET` | `/api/issues` | Fetch all user Kanban issues | None | `Issue[]` |
| `POST` | `/api/issues` | Create new Kanban task | `Partial<Issue>` | `Issue` |
| `PUT` | `/api/issues/:id` | Update issue status/priority/title | `Partial<Issue>` | `Issue` |
| `DELETE` | `/api/issues/:id` | Delete issue | None | `{ success: true }` |
| `GET` | `/api/notifications` | Fetch user notifications | None | `NotificationItem[]` |

---

## 6. Data Synchronization & Differential Engine (`smartSync`)

Source File: [`apps/web/src/lib/api.ts`](file:///D:/Dokumen/project/new-web/apps/web/src/lib/api.ts)

Instead of performing expensive full-state replacements on every keystroke, DevWannaSpace uses a client-side differential engine (`smartSync`).

### How `smartSync` Works:
1. **In-Memory Cache**: The client maintains an active state cache (`stateCache.pages`, `stateCache.projects`, etc.).
2. **Delta Calculation**:
   - `added`: Items in new array missing from old array $\rightarrow$ `POST` request.
   - `removed`: Items in old array missing from new array $\rightarrow$ `DELETE` request.
   - `updated`: Items whose `updatedAt` timestamp has changed $\rightarrow$ `PUT` request.
3. **Optimistic Parallel Execution**: All necessary HTTP calls are dispatched in parallel via `Promise.all`.
4. **Status Bar Emission**: Broadcasts `'saving' | 'saved' | 'error'` events to subscribers (updating the UI sync indicator in the top navbar).

---

## 7. Self-Hosting & BYOC (Bring Your Own Cloud) Mechanics

DevWannaSpace supports complete infrastructure self-hosting without modifying source code.

```
+--------------------------------------------------------------------------------+
|                             BYOC Setup Pipeline                                 |
|                                                                                |
|   1. User supplies: Neon DB URL + Clerk Keys + Cloudflare Auth                     |
|   2. `setup.mjs` verifies Clerk API (`api.clerk.com/v1/users`)                 |
|   3. `npx drizzle-kit push` executes schema migrations to Neon DB              |
|   4. `npx wrangler secret put` injects clean secrets via stdin (no quotes)     |
|   5. `npx wrangler deploy` publishes Workers API                               |
|   6. Auto-injects deployed worker URL into `apps/web/.env`                     |
+--------------------------------------------------------------------------------+
```

### 7.1. Automated Setup Wizard (`npm run setup`)
The interactive setup CLI is powered by `@clack/prompts` ([`setup.mjs`](file:///D:/Dokumen/project/new-web/setup.mjs)).

**Key Features of the CLI Setup:**
- **Clerk Verification**: Validates the secret key against Clerk REST API before deploying.
- **Cross-Platform Stdin Secret Streaming**: Pipes secrets into `wrangler secret put` using Node's native `input` buffer stream to eliminate Windows CMD/PowerShell escape code bugs.
- **Regex Subdomain Parser**: Supports multi-level Cloudflare Worker subdomains (e.g. `https://api.username.workers.dev`).

### 7.2. Dynamic Client Endpoint Override
Users can point any pre-compiled Desktop binary or Web app instance to a custom backend without rebuilding:
- **LocalStorage Keys**:
  - `devwannaspace_custom_api_url`: Overrides default `VITE_API_URL`.
  - `devwannaspace_custom_clerk_key`: Overrides `VITE_CLERK_PUBLISHABLE_KEY`.
- **UI Trigger**: Accessible via Settings Modal or Login Screen -> `⚙️ Custom Server / Self-Host`.

### 7.3. Step-by-Step Infrastructure Prerequisites Guide

For users setting up their own self-hosted backend ($0/month tier):

#### 1. Neon Database Setup (PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech).
2. Create a new project (e.g. `devwannaspace-db`).
3. Under the Project Dashboard, copy your **Connection String**.
4. Ensure it starts with `postgresql://` or `postgres://` and includes `?sslmode=require`.

#### 2. Clerk Authentication Setup
1. Sign up at [clerk.com](https://clerk.com).
2. Create a new Application (e.g. `DevWannaSpace`).
3. In the Clerk Dashboard -> **API Keys**:
   - Copy the **Publishable Key** (`pk_test_...` or `pk_live_...`).
   - Copy the **Secret Key** (`sk_test_...` or `sk_live_...`).

#### 3. Cloudflare Account Setup
1. Sign up at [cloudflare.com](https://cloudflare.com).
2. Install Cloudflare Wrangler CLI globally or use the bundled script:
   ```bash
   npx wrangler login
   ```
3. Authorize Wrangler in your web browser. Now `npm run setup` can deploy Workers and push secrets automatically.

---

## 8. UI/UX Design System & Custom Tokens

Source File: [`apps/web/src/styles/tokens.css`](file:///D:/Dokumen/project/new-web/apps/web/src/styles/tokens.css)

### 8.1. Aesthetic Philosophy
- **Hairline Borders**: `1px solid var(--hairline)` with high contrast against dark backgrounds.
- **Square Geometry**: Zero rounded corners (`border-radius: 0px` across modals, cards, inputs).
- **Curated Color Palettes**:
  - `dark` (Default Linear-style dark mode)
  - `midnight` (Deep navy blue gradients)
  - `rose` (Warm luxury rose gold)
  - `forest` (Calming dark evergreen)

---

## 9. Frontend Components & Editor Architecture

### 9.1. Tiptap Block Editor Engine
- **Slash Commands (`/`)**: Triggers dropdown for inserting H1-H3, Bullet Lists, Task Lists, Code Blocks, Tables, Images, and inline Kanban boards.
- **Page Mention (`@`)**: Intercepts `@` symbol to link to another page within the workspace.
- **Lowlight Syntax Highlighting**: Auto-detects language for fenced code blocks.

### 9.2. Infinite Recursive Page Tree
- Pages are rendered recursively in [`Sidebar.tsx`](file:///D:/Dokumen/project/new-web/apps/web/src/components/layout/Sidebar.tsx).
- Supports drag-and-drop reordering, quick creation of sub-pages, favoriting, and moving to Trash.

---

## 10. Desktop Native Application (Wails v2 + Go)

The desktop application wraps `apps/web` inside a native Go executable.

### Key Features:
- **Frameless Window**: Custom HTML/React titlebar ([`DesktopTitleBar.tsx`](file:///D:/Dokumen/project/new-web/apps/web/src/components/layout/DesktopTitleBar.tsx)) with native OS window controls (Close, Minimize, Maximize).
- **Cross-Platform Packages**: Compiled via GitHub Actions to Windows (`.exe` / NSIS Installer), macOS (`.dmg` / `.app`), and Linux (`.AppImage` / `.deb`).

---

## 11. Error Resilience & Edge Case Handling

1. **Vite Unhandled Rejection Safeguard**: Parallel `Promise.all` requests in `AppShell.tsx` have individual `.catch(() => {})` handlers attached prior to `Promise.all` evaluation. This prevents secondary asynchronous network failures from triggering Vite's full-screen Red Error Overlay.
2. **Invalid Key Graceful Fallback**: If invalid Clerk keys or incorrect API URLs are detected at runtime, the application catches the initialization failure and renders a friendly **"Connection Failed"** UI with direct access to the Self-Host settings panel.

---

## 12. Development, Build & Deployment Workflows

### 12.1. Local Development
```bash
# Clone repository
git clone https://github.com/ryandaaa/devwannaspace.git
cd devwannaspace

# Install all dependencies
npm install

# Run interactive setup wizard
npm run setup

# Start Web App dev server
npm run dev:web

# Start Wails Desktop dev server
wails dev
```

### 12.2. Production Deployment Commands
```bash
# Deploy API to Cloudflare Workers
npm run build:api

# Deploy Web App to Cloudflare Pages
npm run build -w web && wrangler pages deploy apps/web/dist --project-name devwannaspace
```

---
*Documentation generated for DevWannaSpace v1.0. Maintained by Ryanda & Antigravity AI.*
