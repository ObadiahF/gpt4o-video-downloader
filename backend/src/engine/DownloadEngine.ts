import { DownloadItem } from '../models/DownloadItem';
import { log } from '../utils/Logger';
import { handleDirect } from './handlers/handleDirect';
import { handleM3U8 } from './handlers/handleM3U8';
import { handleSegment } from './handlers/handleSegment';

export async function startDownload(item: DownloadItem): Promise<void> {
  log('download', `⏬ Starting ${item.mode} download: ${item.fileName}`);

  try {
    if (item.mode === 'direct') {
      await handleDirect(item);
    } else if (item.mode === 'm3u8') {
      await handleM3U8(item);
    } else if (item.mode === 'segment') {
      await handleSegment(item);
    } else {
      throw new Error(`Unsupported mode: ${item.mode}`);
    }
  } catch (error: any) {
    log('download', `❌ Download failed: ${item.fileName} - ${error.message || error}`);
    throw error;
  }
}
