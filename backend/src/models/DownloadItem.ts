export type DownloadMode = 'direct' | 'm3u8' | 'segment';
export type DownloadStatus =
  | 'scheduled'     // Added but not started
  | 'downloading'   // In progress
  | 'completed'     // Success
  | 'failed';       // Permanent or retryable error

export interface SegmentConfig {
  startIndex: number;         // Where to start counting
  variablePattern: string;    // Placeholder in URL to replace with segment number
}

export interface DownloadItem {
  id: string;
  url: string;
  fileName: string;
  mode: DownloadMode;
  source?: string;
  status: DownloadStatus;
  retries?: number;
  lastTried?: number;
  segmentConfig?: SegmentConfig; // Only for 'segment' mode
}
