/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { addDownload } from "../api";

const AddDownload: React.FC = () => {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"direct" | "m3u8" | "segment">("direct");
  const [fileName, setFileName] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [pattern, setPattern] = useState("{i}");
  const [source, setSource] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload: any = {
      url,
      mode,
      fileName,
      source,
    };

    if (mode === "segment") {
      payload.segmentConfig = {
        startIndex,
        variablePattern: pattern,
      };
    }

    try {
      await addDownload(payload);
      setMessage("✅ Download started successfully!");
      setUrl("");
      setFileName("");
      setSource("");
      setStartIndex(1);
      setPattern("{i}");
    } catch (err: any) {
      setMessage("❌ Failed to start download: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Download</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Download URL</label>
          <input
            type="text"
            className="form-control"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">File Name</label>
          <input
            type="text"
            className="form-control"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Source (optional)</label>
          <input
            type="text"
            className="form-control"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mode</label>
          <select
            className="form-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="direct">Direct</option>
            <option value="m3u8">M3U8</option>
            <option value="segment">Segmented</option>
          </select>
        </div>

        {mode === "segment" && (
          <>
            <div className="mb-3">
              <label className="form-label">Start Index</label>
              <input
                type="number"
                className="form-control"
                value={startIndex}
                onChange={(e) => setStartIndex(Number(e.target.value))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Variable Pattern (e.g. {"{i}"})
              </label>
              <input
                type="text"
                className="form-control"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </div>
          </>
        )}

        <button className="btn btn-primary" type="submit">
          Start Download
        </button>
      </form>

      {message && <div className="alert mt-4 alert-info">{message}</div>}
    </div>
  );
};

export default AddDownload;
