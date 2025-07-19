import React from "react";

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="alert alert-info">📭 {message}</div>
);

export default EmptyState;
