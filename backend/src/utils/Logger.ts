import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../data/logs');

export type LogCategory = 'api' | 'queue' | 'download' | 'system';

function ensureLogFile(filePath: string) {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '');
}

export function log(category: LogCategory, message: string) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  const logFile = path.join(logDir, `${category}.log`);

  ensureLogFile(logFile);

  console.log(`[${category.toUpperCase()}] ${entry}`);
  fs.appendFileSync(logFile, entry + '\n');
}
