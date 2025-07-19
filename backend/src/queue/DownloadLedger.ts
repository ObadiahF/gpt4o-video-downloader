import fs from 'fs';
import path from 'path';
import { DownloadItem, DownloadStatus } from '../models/DownloadItem';
import { log } from '../utils/Logger';

const dataDir = path.join(__dirname, '../../data');
const queuePath = path.join(dataDir, 'queue.json');
const historyPath = path.join(dataDir, 'history.json');

let ledger: DownloadItem[] = [];
let history: DownloadItem[] = [];

function loadJSON<T>(filePath: string): T[] {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveJSON(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const DownloadLedger = {
  init: () => {
    fs.mkdirSync(dataDir, { recursive: true });
    ledger = loadJSON<DownloadItem>(queuePath);
    history = loadJSON<DownloadItem>(historyPath);
    log('queue', '📄 Queue and history initialized from disk');
  },

  getAll: (): DownloadItem[] => ledger,

  add: async (item: DownloadItem) => {
    ledger.push(item);
    saveJSON(queuePath, ledger);
    log('queue', `➕ Added to ledger: ${item.fileName}`);
  },

  updateStatus: async (id: string, status: DownloadStatus) => {
    const item = ledger.find(i => i.id === id);
    if (item) {
      item.status = status;
      item.lastTried = Date.now();
      item.retries = (item.retries ?? 0) + 1;
      saveJSON(queuePath, ledger);
      log('queue', `🔄 Updated status: ${item.fileName} → ${status}`);
    }
  },

  remove: async (id: string) => {
    ledger = ledger.filter(i => i.id !== id);
    saveJSON(queuePath, ledger);
    log('queue', `🗑️ Removed from queue: ${id}`);
    return true;
  },

  markFailed: async (id: string) => {
    const item = ledger.find(i => i.id === id);
    if (item) {
      item.status = 'failed';
      saveJSON(queuePath, ledger);
    }
  },

  saveToHistory: async (item: DownloadItem) => {
    history.push(item);
    saveJSON(historyPath, history);
    log('queue', `📦 Saved to history: ${item.fileName}`);
  },

  getNextScheduled: (): DownloadItem | undefined => {
    return ledger.find(i => i.status === 'scheduled');
  },

  getQueue: (): DownloadItem[] => ledger.filter(i => i.status !== 'completed'),

  getHistory: (): DownloadItem[] => history,

  deleteFromHistory: (id: string) => {
    const index = history.findIndex(i => i.id === id && i.status === 'completed');
    if (index >= 0) {
      history.splice(index, 1);
      saveJSON(historyPath, history);
      return true;
    }
    return false;
  }

};
