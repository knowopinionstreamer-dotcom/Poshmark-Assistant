import fs from 'fs';
import path from 'path';

const VAULT_DIR = '/app/obsidian/Poshmark Assistant';
const FILES_TO_SYNC = [
  'HOMELAB_MANUAL.md',
  'CHANGELOG.md',
  'HOMELAB_RECOVERY.md',
  'package.json',
  'Dockerfile',
  'docker-compose.yml',
  'prisma/schema.prisma'
];

async function syncToObsidian() {
  console.log('🔮 Obsidian Agent: Backing up Blueprints...');

  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }

  for (const fileName of FILES_TO_SYNC) {
    if (fs.existsSync(fileName)) {
      const content = fs.readFileSync(fileName, 'utf-8');
      const targetName = fileName.includes('/') ? fileName.split('/').pop()! : fileName;
      
      const obsidianContent = `--- 
tag: [poshmark, backup, stable-1.0]
last_synced: ${new Date().toISOString()}
---
${fileName.endsWith('.json') || fileName.endsWith('.yml') || fileName.endsWith('.prisma') || fileName === 'Dockerfile' 
  ? '```' + (fileName.split('.').pop() || 'text') + '\n' + content + '\n```' 
  : content}`;

      fs.writeFileSync(path.join(VAULT_DIR, `${targetName}.md`), obsidianContent);
      console.log(`✅ Synced ${fileName} to Obsidian`);
    }
  }
}

syncToObsidian();
