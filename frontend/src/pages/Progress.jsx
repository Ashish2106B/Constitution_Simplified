import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { get, post, patch } from "../services/api";

function Progress() {
  const [token] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [progressData, setProgressData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "completed", "incomplete"
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [activityMessage, setActivityMessage] = useState("");
  const [recordingActivity, setRecordingActivity] = useState(false);

  const fetchProgressAndStreak = async () => {
    try {
      const [progRes, streakRes] = await Promise.all([
        get("/progress"),
        get("/streak"),
      ]);
      setProgressData(progRes);
      setStreakData(streakRes);
    } catch (reqError) {
      setError(reqError.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProgressAndStreak();
    }
  }, [token]);

  const handleRecordActivity = async () => {
    setRecordingActivity(true);
    setActivityMessage("");
    try {
      const response = await post("/streak/activity");
      setActivityMessage(response.message || "Daily activity logged!");
      if (response.streak) {
        setStreakData(response.streak);
      }
    } catch (err) {
      setActivityMessage(err.message || "Failed to record activity");
    } finally {
      setRecordingActivity(false);
    }
  };

  const handleMarkComplete = async (articleId) => {
    try {
      await patch(`/progress/article/${articleId}/complete`);
      fetchProgressAndStreak();
    } catch (err) {
      setError(err.message || "Failed to update article status");
    }
  };

  const total = progressData?.totalArticles || 0;
  const completed = progressData?.completedArticles || 0;
  const remaining = progressData?.remainingArticles || 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressList = progressData?.progress || [];
  const filteredList = progressList.filter((item) => {
    if (filter === "completed") return item.completed;
    if (filter === "incomplete") return !item.completed;
    return true;
  });

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
              <h1 className="page-title">Progress</h1>
              <p className="page-subtitle">
                Your completed articles will appear here. Track your constitutional journey and maintain your daily learning streak.
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
            <p>Loading your progress...</p>
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
            <div className="empty-state-icon">🔒</div>
            <h2 className="empty-state-title">Sign in to Track Progress</h2>
            <p style={{ maxWidth: "540px", margin: "0 auto 18px auto" }}>
              Progress tracking, streak counters, and article completion records require an account so your achievements are saved securely.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-outline-blue btn-sm">
                Create Free Account
              </Link>
            </div>
          </div>
        )}

        {!loading && token && (
          <>
            {/* Streak Highlight Banner */}
            <div className="streak-banner-card">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "1.4rem" }}>🔥</span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                    {streakData?.currentStreak || 0} Day Learning Streak!
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                  Longest record: <strong>{streakData?.longestStreak || 0} days</strong>. Complete a quiz or review an article daily to keep your streak alive.
                </p>
                {activityMessage && (
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "var(--light-teal)" }}>
                    {activityMessage}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="btn btn-sm"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.4)" }}
                onClick={handleRecordActivity}
                disabled={recordingActivity}
              >
                {recordingActivity ? "Checking in..." : "⚡ Check In Today"}
              </button>
            </div>

            {/* Progress Stats Grid */}
            <div className="progress-stats-grid">
              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                  Completion Rate
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy)", margin: "4px 0" }}>
                  {percent}%
                </div>
                <div className="quiz-progress-track">
                  <div className="quiz-progress-fill" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                  Completed Articles
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--success)", margin: "4px 0" }}>
                  {completed}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Out of {total} total syllabus articles
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0 }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                  Remaining Articles
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy)", margin: "4px 0" }}>
                  {remaining}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  To achieve complete mastery
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
              <div className="progress-filter-tabs">
                <button
                  type="button"
                  className={`filter-tab-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All Articles ({progressList.length})
                </button>
                <button
                  type="button"
                  className={`filter-tab-btn ${filter === "completed" ? "active" : ""}`}
                  onClick={() => setFilter("completed")}
                >
                  Completed ({completed})
                </button>
                <button
                  type="button"
                  className={`filter-tab-btn ${filter === "incomplete" ? "active" : ""}`}
                  onClick={() => setFilter("incomplete")}
                >
                  In Progress ({remaining})
                </button>
              </div>

              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Articles are automatically completed when you score ≥ 60% on their quiz.
              </span>
            </div>

            {/* Progress Table */}
            {filteredList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">No Articles Found</h3>
                <p>No articles match the "{filter}" filter.</p>
              </div>
            ) : (
              <div className="progress-table-card">
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Completed Date</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((item) => (
                      <tr key={item.articleId}>
                        <td>
                          <span className="badge badge-navy">
                            {item.articleNumber}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/articles/${item.articleId}`}
                            style={{ fontWeight: 600, color: "var(--navy)" }}
                          >
                            {item.articleTitle}
                          </Link>
                        </td>
                        <td>
                          {item.completed ? (
                            <span className="badge badge-success">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="badge badge-blue">
                              ⏳ In Progress
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {item.completedAt
                            ? new Date(item.completedAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <Link
                              to={`/articles/${item.articleId}`}
                              className="btn btn-sm btn-outline"
                            >
                              Read
                            </Link>
                            <Link
                              to={`/articles/${item.articleId}/quiz`}
                              className="btn btn-sm btn-outline-blue"
                            >
                              Quiz
                            </Link>
                            {!item.completed && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleMarkComplete(item.articleId)}
                                title="Mark completed manually"
                              >
                                Mark Done
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Progress;
