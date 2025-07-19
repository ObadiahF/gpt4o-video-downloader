import { DownloadLedger } from '../queue/DownloadLedger';
import { DownloadItem } from '../models/DownloadItem';
import { startDownload } from '../engine/DownloadEngine';
import { log } from '../utils/Logger';

let isWorking = false;

async function processNext(): Promise<void> {
  if (isWorking) return;

  const nextItem: DownloadItem | undefined = DownloadLedger.getNextScheduled();

  if (!nextItem) {
    return; // nothing to do
  }

  isWorking = true;
  log('download', `🚀 Starting download for: ${nextItem.fileName}`);

  try {
    await DownloadLedger.updateStatus(nextItem.id, 'downloading');
    await startDownload(nextItem);
    await DownloadLedger.updateStatus(nextItem.id, 'completed');
    await DownloadLedger.saveToHistory(nextItem);
    await DownloadLedger.remove(nextItem.id);
    log('download', `✅ Finished: ${nextItem.fileName}`);
  } catch (err: any) {
    log('download', `❌ Download failed: ${nextItem.fileName} - ${err.message}`);
    await DownloadLedger.markFailed(nextItem.id);
  } finally {
    isWorking = false;
  }
}

export const DownloadWorker = {
  start: () => {
    log('system', '🟢 Download worker started.');
    setInterval(processNext, 2000); // Check every 2 seconds
  }
};
