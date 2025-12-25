import fs from 'fs';
import path from 'path';

const VAULT_DIR = '/app/obsidian/Poshmark Assistant';
const FILES_TO_SYNC = [
  'HOMELAB_MANUAL.md',
  'CHANGELOG.md',
  'HOMELAB_RECOVERY.md',
  'DOCKER_GUIDE.md',
  'package.json',
  'src/app/schema.ts',
  'Dockerfile',
  'docker-compose.yml',
  'prisma/schema.prisma'
];

function syncFile(fileName: string) {
  if (fs.existsSync(fileName)) {
    try {
      const content = fs.readFileSync(fileName, 'utf-8');
      const targetName = fileName.includes('/') ? fileName.split('/').pop()! : fileName;
      
      const obsidianContent = `--- 
tag: [poshmark, backup, stable-1.2, auto-sync]
last_synced: ${new Date().toISOString()}
---
${fileName.endsWith('.json') || fileName.endsWith('.yml') || fileName.endsWith('.prisma') || fileName === 'Dockerfile' 
  ? '```' + (fileName.split('.').pop() || 'text') + '\n' + content + '\n```' 
  : content}`;

      fs.writeFileSync(path.join(VAULT_DIR, `${targetName}.md`), obsidianContent);
      console.log(`✅ [${new Date().toLocaleTimeString()}] Synced ${fileName}`);
    } catch (err) {
      console.error(`❌ Error syncing ${fileName}:`, err);
    }
  }
}

async function startRealTimeSync() {
  console.log('🔮 Obsidian Agent: Real-time Watcher Active...');

  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }

  // Initial Sync
  FILES_TO_SYNC.forEach(syncFile);

  // Watch for changes
  FILES_TO_SYNC.forEach(file => {
    if (fs.existsSync(file)) {
      fs.watchFile(file, { interval: 1000 }, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          syncFile(file);
        }
      });
    }
  });
}

startRealTimeSync();