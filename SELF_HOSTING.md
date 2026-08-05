# ☁️ Self-Hosting Guide (Bring Your Own Cloud)

DevWannaSpace is designed with a **BYOC (Bring Your Own Cloud)** philosophy. 

Instead of paying expensive SaaS subscriptions or managing complicated Docker clusters, you can deploy your own instance of the backend using **100% free serverless infrastructure**.

The architecture uses:
- **Cloudflare Workers** (Backend API, free 100k requests/day)
- **Neon DB** (Serverless Postgres, free 0.5 GB)
- **Clerk** (Authentication, free 10,000 monthly active users)

Total cost to self-host: **$0.00 / month.**

---

## 🛠️ Step 1: Get Your Free API Keys

1. **Clerk (Auth)**: Go to [clerk.com](https://clerk.com), create a new app, and copy the **Publishable Key** and **Secret Key**.
2. **Neon DB (Database)**: Go to [neon.tech](https://neon.tech), create a new free project, and copy the **Postgres Connection String** (it starts with `postgresql://`).
3. **Cloudflare**: Go to [cloudflare.com](https://cloudflare.com) and create a free account (if you don't have one).

## 🚀 Step 2: Deploy Your Backend

Open your terminal and configure the backend:

```bash
# 1. Masuk ke folder API
cd apps/api

# 2. Copy file environment
cp .dev.vars.example .dev.vars
```

Open `.dev.vars` and paste your keys from Step 1:
```env
DATABASE_URL=postgresql://...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Run the deployment script:
```bash
# Install dependencies
npm install

# Push database schema (create tables)
npm run db:push

# Deploy to Cloudflare Workers
node deploy.js
```

When it finishes, it will print your unique API URL (e.g. `https://api.your-username.workers.dev`). **Copy this URL!**

## 🔗 Step 3: Connect the App to Your Cloud

1. Open the DevWannaSpace Desktop, Web, or Mobile app.
2. At the login screen, click the **"Custom Server / Self-Host"** button at the bottom.
3. Paste your **Cloudflare Worker API URL**.
4. Paste your **Clerk Publishable Key**.
5. Click **Connect**.

🎉 **Boom! You are now fully connected to your own $0 cloud!** All your data is privately yours.
