const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Reading .dev.vars...");
  const envVars = fs.readFileSync('.dev.vars', 'utf8').split('\n');

  for (const line of envVars) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=');
    
    console.log(`\n🔑 Mengunggah secret: ${key}...`);
    try {
      execSync(`npx wrangler secret put ${key}`, { 
        input: value, 
        stdio: ['pipe', 'pipe', 'pipe'] 
      });
      console.log(`✅ Secret ${key} berhasil diunggah.`);
    } catch (e) {
      console.log(`⚠️ Gagal mengunggah ${key}:`, e.message);
    }
  }

  console.log("\n🚀 Memulai deployment ke Cloudflare Workers...");
  const deployOut = execSync('npx wrangler deploy', { stdio: 'pipe' }).toString();
  console.log(deployOut);
  
  // Extract URL
  const urlMatch = deployOut.match(/https:\/\/[^\s]+/);
  if (urlMatch) {
    console.log(`\n🎉 DEPLOY BERHASIL! URL API: ${urlMatch[0]}`);
  }
} catch (err) {
  console.error("Terjadi kesalahan:", err.message);
}
