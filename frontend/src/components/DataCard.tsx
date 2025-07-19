import React, { useState } from "react";

interface DataCardProps {
  item: {
    id: string;
    fileName: string;
    status?: string;
    url?: string;
    source?: string;
    retries?: number;
    lastTried?: number;
    mode?: string;
  };
  showStatus?: boolean;
  onCancel?: (id: string) => void;
  onDelete?: (id: string, deleteFile?: boolean) => void;
}

const DataCard: React.FC<DataCardProps> = ({
  item,
  showStatus = true,
  onCancel,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const toggle = () => setExpanded((prev) => !prev);
  const isHistoryItem = item.status === "completed";

  const confirmDelete = (deleteFile: boolean) => {
    setShowDeleteModal(false);
    onDelete?.(item.id, deleteFile);
  };

  return (
    <>
      <li className="list-group-item">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{item.fileName}</strong>
            {showStatus ? (
              <span className="badge bg-secondary ms-2">{item.status}</span>
            ) : (
              <span className="text-success ms-2">✅</span>
            )}
          </div>

          <div className="d-flex align-items-center">
            {item.status === "scheduled" && onCancel && (
              <button
                className="btn btn-sm btn-danger me-2"
                onClick={() => onCancel(item.id)}
              >
                Cancel
              </button>
            )}
            {isHistoryItem && (
              <>
                <button
                  className="btn btn-sm btn-outline-light me-2"
                  onClick={() => setShowVideoModal(true)}
                >
                  ▶
                </button>
                {onDelete && (
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={toggle}
            >
              {expanded ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 small border-top pt-2 text-light-emphasis">
            {item.mode && (
              <div>
                <strong>Mode:</strong> {item.mode}
              </div>
            )}
            {item.source && (
              <div>
                <strong>Source:</strong> {item.source}
              </div>
            )}
            {item.url && (
              <div>
                <strong>URL:</strong>{" "}
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  [open]
                </a>
              </div>
            )}
            {typeof item.retries === "number" && (
              <div>
                <strong>Retries:</strong> {item.retries}
              </div>
            )}
            {item.lastTried && (
              <div>
                <strong>Last Tried:</strong>{" "}
                {new Date(item.lastTried).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </li>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Delete Download</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Do you want to delete this item from history?</p>
                <p>
                  <strong>{item.fileName}</strong>
                </p>
                <p className="text-warning">
                  You can also delete the file from disk.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-light"
                  onClick={() => confirmDelete(false)}
                >
                  Just remove from history
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => confirmDelete(true)}
                >
                  Delete from disk too
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {showVideoModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.75)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Preview Video</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowVideoModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <video
                  controls
                  autoPlay
                  style={{ width: "100%", borderRadius: "4px" }}
                  src={`/api/video/${item.id}`}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowVideoModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataCard;
