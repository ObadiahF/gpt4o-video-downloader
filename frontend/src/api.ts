
export async function fetchQueue() {
  const res = await fetch('api/queue');
  if (!res.ok) throw new Error('Failed to fetch queue');
  return await res.json();
}

export async function fetchHistory() {
  const res = await fetch('api/history');
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function addDownload(data: {
  url: string;
  mode: 'direct' | 'segment' | 'm3u8';
  fileName?: string;
  source?: string;
}) {
  const res = await fetch('api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add download');
  return await res.json();
}

export async function cancelQueueItem(id: string) {
  const res = await fetch(`api/queue/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to cancel queue item');
}

export async function deleteHistoryItem(id: string, deleteFile: boolean): Promise<void> {
  const res = await fetch(`api/history/${id}?deleteFile=${deleteFile}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete history item");
}

export function getVideoUrl(videoId: string): string {
  return `api/video/${videoId}`;
}
