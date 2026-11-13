import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function Games() {
  const [token] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [games, setGames] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadGamesData = async () => {
      try {
        if (token) {
          const [gamesRes, historyRes] = await Promise.all([
            get("/games").catch(() => null),
            get("/games/history").catch(() => null),
          ]);

          if (isMounted) {
            setGames(Array.isArray(gamesRes?.games) ? gamesRes.games : []);
            setHistory(Array.isArray(historyRes?.history) ? historyRes.history : []);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load educational games");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadGamesData();
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <Layout>
      <div className="page-container">
        <header className="page-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1 className="page-title">Games</h1>
              <p className="page-subtitle">
                Available games and scores will appear here. Learn constitutional principles through engaging, interactive games.
              </p>
            </div>
            <Link to="/topics" className="btn btn-outline btn-sm">
              Explore Topics →
            </Link>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading games catalog...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {!loading && !token && (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <h2 className="empty-state-title">Sign In to Play Games</h2>
            <p style={{ maxWidth: "520px", margin: "0 auto 16px auto" }}>
              Educational games and score recording require an active citizen account.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <Link to="/login" className="btn btn-primary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-outline-blue btn-sm">
                Register
              </Link>
            </div>
          </div>
        )}

        {!loading && token && games.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🎲</div>
            <h2 className="empty-state-title">Games Coming Soon</h2>
            <p style={{ maxWidth: "540px", margin: "0 auto 16px auto" }}>
              The educational games database is currently being prepared with interactive Preamble Puzzles and Constitution Matchups.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
              <Link to="/topics" className="btn btn-primary btn-sm">
                Browse Articles & Quizzes
              </Link>
              <Link to="/dashboard" className="btn btn-outline-blue btn-sm">
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {!loading && token && games.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 className="section-title">Available Interactive Games</h2>
            <div className="topics-grid">
              {games.map((game) => (
                <div key={game.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span className="badge badge-teal">{game.gameType || "Quiz Game"}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ID #{game.id}</span>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", margin: "0 0 8px 0", color: "var(--navy)" }}>
                    {game.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
                    {game.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && token && history.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <h2 className="section-title">Your Game Score History</h2>
            <div className="progress-table-card">
              <table className="progress-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Played At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 600, color: "var(--navy)" }}>
                        {record.game?.title || `Game #${record.id}`}
                      </td>
                      <td>
                        <span className="badge badge-navy">
                          {record.game?.gameType || "Standard"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--blue)" }}>
                          {record.score} / {record.totalScore}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {new Date(record.playedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Games;
