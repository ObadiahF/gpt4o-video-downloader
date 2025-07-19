/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { deleteHistoryItem, fetchHistory } from "../api";
import { useToast } from "../components/ToastManager";

import SearchBar from "../components/SearchBar";
import DataList from "../components/DataList";

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { showToast } = useToast();


  useEffect(() => {
    fetchHistory()
      .then((data) => setHistory(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter((item) =>
    item.fileName?.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async (id: string, deleteFile: boolean) => {
    try {
      await deleteHistoryItem(id, deleteFile);
      showToast("Deleted from history!");
      fetchHistory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>History</h2>

      {error && <div className="alert alert-danger">❌ {error}</div>}

      {loading ? (
        <div className="text-muted">⏳ Loading history...</div>
      ) : (
        <>
          <SearchBar query={query} onChange={setQuery} />
          {filtered.length === 0 ? (
            <div className="alert alert-info">
              📭 No completed downloads found.
            </div>
          ) : (
            <DataList
              items={history}
              showStatus={false}
              onDelete={async (id, deleteFile) => {
                await handleDelete(id, deleteFile);
                setHistory(history.filter((item) => item.id !== id));
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
