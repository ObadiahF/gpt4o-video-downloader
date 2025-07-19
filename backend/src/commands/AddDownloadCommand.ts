import { v4 as uuidv4 } from 'uuid';
import { DownloadItem, DownloadMode } from '../models/DownloadItem';
import { DownloadLedger } from '../queue/DownloadLedger';
import { log } from '../utils/Logger';

interface AddDownloadInput {
  url: string;
  mode: DownloadMode;
  fileName?: string;
  source?: string;
  segmentConfig?: {
    startIndex: number;
    variablePattern: string;
  };
}

export async function handleAddDownloadCommand(input: AddDownloadInput): Promise<DownloadItem> {
  const id = uuidv4();
  const fileName = input.fileName || `${id}.mp4`;

  const item: DownloadItem = {
    id,
    url: input.url,
    fileName,
    mode: input.mode,
    source: input.source,
    status: 'scheduled',
    retries: 0,
    lastTried: 0,
    segmentConfig: input.segmentConfig,
  };

  log('queue', `➕ New download scheduled: ${fileName}`);
  log('queue', `Details: ${JSON.stringify(item)}`);

  await DownloadLedger.add(item);

  return item;
}
