import { DownloadItem } from '../../models/DownloadItem';
import { log } from '../../utils/Logger';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DOWNLOAD_DIR } from '../../config';

const execAsync = promisify(exec);

export async function handleM3U8(item: DownloadItem): Promise<void> {
  // Remove any existing extension from fileName (like .mp4 or .mkv)
  const baseName = item.fileName.replace(/\.[^/.]+$/, '');
  const outputTemplate = path.join(DOWNLOAD_DIR, `${baseName}.%(ext)s`);

  log('download', `📺 Starting m3u8 download with yt-dlp: ${item.url}`);
  log('download', `📦 Output template: ${outputTemplate}`);

  const command = `yt-dlp "${item.url}" -o "${outputTemplate}" -f best --no-playlist --quiet --no-warnings --merge-output-format mp4`;

  try {
    const { stdout, stderr } = await execAsync(command);
    log('download', `✅ yt-dlp download complete: ${item.fileName}`);
    if (stdout.trim()) log('download', `[yt-dlp stdout] ${stdout.trim()}`);
    if (stderr.trim()) log('download', `[yt-dlp stderr] ${stderr.trim()}`);
  } catch (err: any) {
    log('download', `❌ yt-dlp failed for ${item.fileName}: ${err.message}`);
    throw err;
  }
}
