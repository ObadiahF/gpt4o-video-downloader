import { DownloadItem } from '../../models/DownloadItem';
import { log } from '../../utils/Logger';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Only this directory is externally mounted in Docker
const downloadPath = process.env.DOWNLOAD_DIR || '/app/data/downloads';

// Keep temp internal
const tempRoot = path.join(__dirname, '../../../data/temp');

export async function handleSegment(item: DownloadItem): Promise<void> {
  const tempDir = path.join(tempRoot, item.id);

  // Ensure filename ends with .mp4
  const finalFileName = item.fileName.endsWith('.mp4') ? item.fileName : `${item.fileName}.mp4`;
  const outPath = path.join(downloadPath, finalFileName);

  const segmentConfig = item.segmentConfig || { startIndex: 1, variablePattern: '{i}' };
  const { startIndex, variablePattern } = segmentConfig;

  // Create temp dir
  fs.mkdirSync(tempDir, { recursive: true });
  log('download', `📁 Temp dir created: ${tempDir}`);

  let i = startIndex;
  const segmentFiles: string[] = [];

  try {
    while (true) {
      const segUrl = item.url.replace(variablePattern, i.toString());
      const segmentFileName = `segment${i}.ts`;
      const segmentPath = path.join(tempDir, segmentFileName);

      const startTime = Date.now();
      const response = await axios.get(segUrl, {
        responseType: 'arraybuffer',
        validateStatus: () => true,
        timeout: 5000,
      });
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      log('download', `🌐 Segment ${i} responded with status: ${response.status} in ${elapsed}s`);

      if (![200, 206].includes(response.status)) {
        log('download', `🛑 Stopping loop — segment ${i} status: ${response.status}`);
        break;
      }

      fs.writeFileSync(segmentPath, Buffer.from(response.data));
      segmentFiles.push(`file '${segmentFileName.replace(/'/g, "'\\''")}'`);
      log('download', `✅ Segment ${i} saved: ${segmentFileName} (${(response.data.byteLength / 1e6).toFixed(2)} MB)`);

      i++;
    }

    if (segmentFiles.length === 0) {
      throw new Error('No segments downloaded.');
    }

    const listPath = path.join(tempDir, 'segments.txt');
    fs.writeFileSync(listPath, segmentFiles.join('\n'));

    log('download', `🎬 Concatenating ${segmentFiles.length} segments via FFmpeg`);

    const ffmpegCmd = `ffmpeg -f concat -safe 0 -i segments.txt -c copy "${outPath}"`;
    await execAsync(ffmpegCmd, { cwd: tempDir });

    log('download', `✅ Final video created: ${finalFileName}`);
  } catch (err: any) {
    log('download', `❌ Segment download failed: ${item.fileName} - ${err.message}`);
    throw err;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
    log('download', `🧹 Cleaned up temp dir: ${tempDir}`);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
