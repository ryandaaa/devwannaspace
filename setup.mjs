import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as p from '@clack/prompts';
import color from 'picocolors';

async function main() {
  console.clear();
  p.intro(`${color.bgCyan(color.black(' DevWannaSpace CLI '))} Welcome to the interactive self-host setup!`);

  const dbUrl = await p.text({
    message: 'What is your Neon Postgres Database URL?',
    placeholder: 'postgres://user:pass@ep-cool-db.region.aws.neon.tech/neondb',
    validate: (value) => {
      if (!value) return 'Please enter a URL';
      if (!value.startsWith('postgres://') && !value.startsWith('postgresql://')) return 'URL must start with postgres:// or postgresql://';
    }
  });

  if (p.isCancel(dbUrl)) return p.cancel('Operation cancelled.');

  const clerkPublishable = await p.text({
    message: 'What is your Clerk Publishable Key?',
    placeholder: 'pk_test_...',
    validate: (value) => {
      if (!value) return 'Please enter a key';
    }
  });

  if (p.isCancel(clerkPublishable)) return p.cancel('Operation cancelled.');

  const clerkSecret = await p.text({
    message: 'What is your Clerk Secret Key?',
    placeholder: 'sk_test_...',
    validate: (value) => {
      if (!value) return 'Please enter a key';
    }
  });

  if (p.isCancel(clerkSecret)) return p.cancel('Operation cancelled.');

  const s = p.spinner();

  try {
    // 0. Verify Clerk Credentials
    s.start('Verifying Clerk credentials...');
    const clerkRes = await fetch('https://api.clerk.com/v1/users?limit=1', {
      headers: { 'Authorization': `Bearer ${clerkSecret}` }
    });
    
    if (!clerkRes.ok) {
      s.stop('❌ Clerk verification failed');
      p.log.error('The Clerk Secret Key provided is invalid or does not have access.');
      process.exit(1);
    }
    s.stop('✅ Clerk credentials verified successfully!');

    // 1. Setup Backend (.dev.vars for local, and push secrets to Cloudflare)
    s.start('Configuring backend secrets...');
    const apiDir = path.join(process.cwd(), 'apps', 'api');
    
    // Save to .dev.vars for local testing
    const devVars = `DATABASE_URL="${dbUrl}"
CLERK_PUBLISHABLE_KEY="${clerkPublishable}"
CLERK_SECRET_KEY="${clerkSecret}"`;
    fs.writeFileSync(path.join(apiDir, '.dev.vars'), devVars);
    s.stop('Backend secrets configured locally (.dev.vars)');

    // 2. Push database schema to Neon
    s.start('Pushing database schema to Neon via Drizzle...');
    execSync('npx drizzle-kit push', { cwd: apiDir, stdio: 'ignore' });
    s.stop('Database schema synced successfully');

    // 3. Deploy to Cloudflare
    s.start('Deploying API to Cloudflare Workers (this may take a minute)...');
    // First put secrets to Cloudflare
    execSync('npx wrangler secret put DATABASE_URL', { cwd: apiDir, stdio: ['pipe', 'ignore', 'ignore'], input: dbUrl });
    execSync('npx wrangler secret put CLERK_PUBLISHABLE_KEY', { cwd: apiDir, stdio: ['pipe', 'ignore', 'ignore'], input: clerkPublishable });
    execSync('npx wrangler secret put CLERK_SECRET_KEY', { cwd: apiDir, stdio: ['pipe', 'ignore', 'ignore'], input: clerkSecret });
    
    // Then deploy
    const deployOutput = execSync('npx wrangler deploy', { cwd: apiDir }).toString();
    
    // Extract the deployed URL
    const urlMatch = deployOutput.match(/https:\/\/[a-zA-Z0-9.-]+\.workers\.dev/);
    const apiUrl = urlMatch ? `${urlMatch[0]}/api` : 'http://localhost:8787/api';
    s.stop(`API deployed to: ${color.green(apiUrl)}`);

    // 4. Configure Web/Desktop Client
    s.start('Configuring Web / Desktop client...');
    const webDir = path.join(process.cwd(), 'apps', 'web');
    const webEnv = `VITE_CLERK_PUBLISHABLE_KEY="${clerkPublishable}"
VITE_API_URL="${apiUrl}"`;
    fs.writeFileSync(path.join(webDir, '.env'), webEnv);
    s.stop('Web/Desktop client configured (.env)');

    // 5. Configure Mobile Client (if exists)
    const mobileDir = path.join(process.cwd(), 'apps', 'mobile');
    if (fs.existsSync(mobileDir)) {
      const mobileEnv = `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="${clerkPublishable}"
EXPO_PUBLIC_API_URL="${apiUrl}"`;
      fs.writeFileSync(path.join(mobileDir, '.env'), mobileEnv);
      p.log.success('Mobile client configured');
    }

    p.outro(color.green('🎉 All done! Your self-hosted DevWannaSpace is ready.'));
    p.note(`Next steps:
1. Run "npm run dev" in apps/web to start the web app
2. Or run "wails dev" in the root to start the desktop app
3. Your database and backend are fully live!`);

  } catch (error) {
    s.stop('Failed during setup');
    p.log.error(error.message);
    process.exit(1);
  }
}

main();
