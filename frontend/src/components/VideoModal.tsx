import React from "react";
import { Modal, Button } from "react-bootstrap";

interface VideoModalProps {
  show: boolean;
  onHide: () => void;
  videoId: string | null;
}

const VideoModal: React.FC<VideoModalProps> = ({ show, onHide, videoId }) => {
  if (!videoId) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Preview Video</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <video
          controls
          style={{ width: "100%", borderRadius: "4px" }}
          src={`/api/video/${videoId}`}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoModal;
