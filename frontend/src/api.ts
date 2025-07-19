import { API_BASE_URL } from './constants';

export async function fetchQueue() {
  const res = await fetch(`${API_BASE_URL}/queue`);
  if (!res.ok) throw new Error('Failed to fetch queue');
  return await res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE_URL}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function addDownload(data: {
  url: string;
  mode: 'direct' | 'segment' | 'm3u8';
  fileName?: string;
  source?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add download');
  return await res.json();
}

export async function cancelQueueItem(id: string) {
  const res = await fetch(`${API_BASE_URL}/queue/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to cancel queue item');
}

export async function deleteHistoryItem(id: string, deleteFile: boolean): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/history/${id}?deleteFile=${deleteFile}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete history item");
}

export function getVideoUrl(videoId: string): string {
  return `${API_BASE_URL}/video/${videoId}`;
}
