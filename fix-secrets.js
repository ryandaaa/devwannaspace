const fs = require('fs');
const { execSync } = require('child_process');

const c = fs.readFileSync('apps/api/.dev.vars', 'utf8');
const d = c.match(/DATABASE_URL="(.*)"/)[1];
const p = c.match(/CLERK_PUBLISHABLE_KEY="(.*)"/)[1];
const s = c.match(/CLERK_SECRET_KEY="(.*)"/)[1];

console.log("Updating DATABASE_URL...");
execSync('npx wrangler secret put DATABASE_URL', { cwd: 'apps/api', stdio: ['pipe', 'inherit', 'inherit'], input: d });

console.log("Updating CLERK_PUBLISHABLE_KEY...");
execSync('npx wrangler secret put CLERK_PUBLISHABLE_KEY', { cwd: 'apps/api', stdio: ['pipe', 'inherit', 'inherit'], input: p });

console.log("Updating CLERK_SECRET_KEY...");
execSync('npx wrangler secret put CLERK_SECRET_KEY', { cwd: 'apps/api', stdio: ['pipe', 'inherit', 'inherit'], input: s });

console.log("Done!");
