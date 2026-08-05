<div align="center">
  <h1>🌌 DevWannaSpace</h1>
  <p>A minimalist, high-performance workspace combining document editing, infinite nested pages, and kanban boards. Built with a highly polished aesthetic inspired by Linear and Notion.</p>
  <p><strong><a href="https://space.devwanna.tech">Website & Live Demo</a></strong> | <strong><a href="https://github.com/ryandaaa/devwannaspace/releases">Download Desktop App</a></strong></p>
</div>

## ✨ Features

- **Rich Text Editor**: Powered by Tiptap. Supports markdown shortcuts, slash commands (`/`), image pasting, and syntax highlighting.
- **Infinite Nested Pages**: Create pages within pages indefinitely. Drag and drop to reorder.
- **Kanban Boards**: Integrated boards for task management with drag-and-drop capability.
- **Command Palette**: Press `Ctrl+K` to search anything or instantly create new pages on the fly.
- **True Cross-Platform**: Run as a Web App (Cloudflare Pages), a Desktop App (Mac/Windows/Linux via Wails), or Mobile (coming soon).
- **Easy Self-Hosting**: Completely serverless backend (Cloudflare Workers + Neon Postgres).
- **Custom Server Support**: Download the official Desktop App and connect it to your own self-hosted backend right from the Login screen!

## 🚀 One-Command Setup (Self-Host)

We've built an interactive CLI tool that automatically deploys the backend to your own Cloudflare account and syncs your database.

### Prerequisites
- Node.js v20+
- A [Neon Postgres](https://neon.tech) Database URL
- A [Clerk](https://clerk.com) account (for Auth)
- A [Cloudflare](https://cloudflare.com) account

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ryandaaa/devwannaspace.git
   cd devwannaspace
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the interactive setup:
   ```sh
   npm run setup
   ```
   *This script will ask for your Neon DB URL and Clerk Keys, push the database schema, deploy the backend to Cloudflare Workers, and configure your local `.env` files automatically!*

## 💻 Running the App

### Web App
```sh
npm run dev -w web
```
Open `http://localhost:5173`.

### Desktop App (Wails)
Make sure you have [Go](https://go.dev/doc/install) installed.
```sh
wails dev
```
To build the executable:
```sh
wails build
```

*(Note: We also provide pre-built executables for Windows, Mac, and Linux via GitHub Actions in the Releases tab!)*

## 🏗️ Architecture & Tech Stack

This project is a monorepo containing:
- **Frontend (`apps/web`)**: React 18, Vite, Tiptap, Clerk Auth, Vanilla CSS.
- **Desktop (`/`)**: Wails v2 (Go) wrapping the Vite frontend with native titlebars.
- **Backend (`apps/api`)**: Cloudflare Workers, Hono, Drizzle ORM.
- **Database**: Neon (Serverless Postgres).

For a deep dive into the architecture, design philosophy, and complete feature set, please read the [Comprehensive Project Documentation](PROJECT_DOCUMENTATION.md).

## 🎨 Custom Server / Self-Hosting via Official Desktop App

Don't want to compile the desktop app yourself?
1. Download the pre-built `.exe` / `.app` from our GitHub Releases.
2. Open the app. At the Login screen, click **"⚙️ Custom Server / Self-Host"**.
3. Enter your deployed Cloudflare API URL and Clerk Publishable Key.
4. Boom! You are now using the official app with your own private, self-hosted data.

## License
MIT
