import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddDownload from "./pages/AddDownload";
import Queue from "./pages/Queue";
import History from "./pages/History";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./dark.css"; // Import dark mode styles

const App: React.FC = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Downloader
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/add">
                  Add Download
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/queue">
                  Queue
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">
                  History
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<AddDownload />} />
          <Route path="/add" element={<AddDownload />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
