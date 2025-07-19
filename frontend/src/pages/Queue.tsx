/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useToast } from "../components/ToastManager";
import { cancelQueueItem, fetchQueue } from "../api";
import DataList from "../components/DataList";
import SearchBar from "../components/SearchBar";

export default function Queue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { showToast } = useToast();


  useEffect(() => {
    fetchQueue()
      .then((data) => setQueue(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = queue.filter((item) =>
    item.fileName?.toLowerCase().includes(query.toLowerCase())
  );

  const handleCancel = async (id: string) => {
    await cancelQueueItem(id);
    setQueue(queue.filter((item) => item.id !== id));
    showToast("Removed from queue!");
  }

  return (
    <div className="container mt-4">
      <h2>Queue</h2>

      {error && <div className="alert alert-danger">❌ {error}</div>}
      {loading ? (
        <div className="text-muted">⏳ Loading queue...</div>
      ) : (
        <>
          <SearchBar query={query} onChange={setQuery} />
          {filtered.length === 0 ? (
            <div className="alert alert-info">
              📭 No matching downloads found.
            </div>
          ) : (
            <DataList
              items={queue}
              showStatus={true}
              onDelete={async (id) => {
                handleCancel(id);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
