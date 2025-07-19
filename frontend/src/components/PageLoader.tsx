import React from "react";

interface Props {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

const PageLoader: React.FC<Props> = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="spinner-border text-primary me-2" role="status" />
        <strong>Loading...</strong>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">❌ {error}</div>;
  }

  return <>{children}</>;
};

export default PageLoader;
