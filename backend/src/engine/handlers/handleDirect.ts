import { DownloadItem } from '../../models/DownloadItem';
import { log } from '../../utils/Logger';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { DOWNLOAD_DIR } from '../../config';

const mimeToExt: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
  'video/x-matroska': '.mkv',
  'video/quicktime': '.mov',
  'video/x-msvideo': '.avi',
};

export async function handleDirect(item: DownloadItem): Promise<void> {
  const response = await axios.get(item.url, { responseType: 'stream' });
  const contentType = response.headers['content-type'] || '';
  const ext = mimeToExt[contentType] || '.mp4';

  let fileName = item.fileName;

  // Append extension if not already included
  if (!path.extname(fileName)) {
    fileName += ext;
  }

  const outPath = path.join(DOWNLOAD_DIR, fileName);

  const totalSize = parseInt(response.headers['content-length'] || '0', 10);
  let downloaded = 0;
  let lastLogged = Date.now();
  const writer = fs.createWriteStream(outPath);

  response.data.on('data', (chunk: Buffer) => {
    downloaded += chunk.length;
    const now = Date.now();
    if (now - lastLogged >= 5000) {
      const percent = totalSize > 0 ? ((downloaded / totalSize) * 100).toFixed(2) : '?';
      log('download', `Progress [${fileName}]: ${percent}% (${(downloaded / 1e6).toFixed(2)} MB)`);
      lastLogged = now;
    }
  });

  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
    response.data.pipe(writer);
  });

  log('download', `✅ Direct download complete: ${fileName}`);
}