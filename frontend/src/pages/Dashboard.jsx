import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function Dashboard() {
  const [token] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [user] = useState(() => {
    try {
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [progressData, setProgressData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // Fetch topics (public)
        const topicsRes = await get("/topics").catch(() => null);
        if (isMounted && topicsRes?.topics) {
          setTopics(topicsRes.topics);
        }

        // Fetch user progress and streak if authenticated
        if (token) {
          const [progRes, streakRes] = await Promise.all([
            get("/progress").catch(() => null),
            get("/streak").catch(() => null),
          ]);

          if (isMounted) {
            if (progRes) setProgressData(progRes);
            if (streakRes) setStreakData(streakRes);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const totalArticles = progressData?.totalArticles || 0;
  const completedArticles = progressData?.completedArticles || 0;
  const completionPercent =
    totalArticles > 0 ? Math.round((completedArticles / totalArticles) * 100) : 0;

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
              gap: "16px",
            }}
          >
            <div>
              <h1 className="page-title">
                {user?.username ? `Welcome back, ${user.username}!` : "Dashboard"}
              </h1>
              <p className="page-subtitle">
                Your learning overview will appear here. Track your constitutional study progress, daily streaks, and topic mastery.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/topics" className="btn btn-primary btn-sm">
                Explore Topics →
              </Link>
              <Link to="/games" className="btn btn-outline-blue btn-sm">
                Play Games 🎮
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading your dashboard...</p>
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
          <div className="alert alert-info" style={{ marginBottom: "28px" }}>
            <span>👤</span>
            <div>
              <strong>Guest Citizen Mode:</strong> You are currently browsing as a guest.{" "}
              <Link to="/login" style={{ textDecoration: "underline", fontWeight: 700 }}>
                Sign In
              </Link>{" "}
              or{" "}
              <Link to="/register" style={{ textDecoration: "underline", fontWeight: 700 }}>
                Create an Account
              </Link>{" "}
              to save completed articles, activity streaks, and quiz badges.
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Real Metrics Grid */}
            <div className="dashboard-grid">
              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-blue">📖</div>
                <div>
                  <div className="stat-value">{topics.length}</div>
                  <div className="stat-label">Constitution Topics</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-teal">✅</div>
                <div>
                  <div className="stat-value">
                    {token ? `${completedArticles}/${totalArticles}` : "--"}
                  </div>
                  <div className="stat-label">Articles Completed</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-orange">🔥</div>
                <div>
                  <div className="stat-value">
                    {token ? `${streakData?.currentStreak ?? 0} d` : "--"}
                  </div>
                  <div className="stat-label">Current Streak</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-navy">🏆</div>
                <div>
                  <div className="stat-value">
                    {token ? `${streakData?.longestStreak ?? 0} d` : "--"}
                  </div>
                  <div className="stat-label">Best Streak</div>
                </div>
              </div>
            </div>

            {/* Layout Columns */}
            <div className="dashboard-sections-layout">
              {/* Left Column: Topics / In-progress */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h2 className="section-title" style={{ margin: 0 }}>
                      Study Modules
                    </h2>
                    <Link to="/topics" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                      View All ({topics.length}) →
                    </Link>
                  </div>

                  {topics.length === 0 ? (
                    <p style={{ color: "var(--text-muted)" }}>No topics available yet.</p>
                  ) : (
                    <ul className="dashboard-card-list">
                      {topics.slice(0, 4).map((topic, index) => (
                        <li key={topic.id} className="dashboard-list-item">
                          <div>
                            <span className="badge badge-navy" style={{ marginBottom: "4px" }}>
                              Module 0{index + 1}
                            </span>
                            <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.98rem" }}>
                              {topic.name}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                              {topic.description?.slice(0, 90)}...
                            </div>
                          </div>
                          <Link
                            to={`/topics/${topic.id}/articles`}
                            className="btn btn-outline-blue btn-sm"
                            style={{ flexShrink: 0, marginLeft: "12px" }}
                          >
                            Explore →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {token && progressData?.progress && progressData.progress.length > 0 && (
                  <div className="card">
                    <h2 className="section-title">Your Article Progress</h2>
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.88rem",
                          marginBottom: "6px",
                          fontWeight: 600,
                        }}
                      >
                        <span>Overall Syllabus Completion</span>
                        <span>{completionPercent}%</span>
                      </div>
                      <div className="quiz-progress-track">
                        <div
                          className="quiz-progress-fill"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>

                    <ul className="dashboard-card-list">
                      {progressData.progress.slice(0, 5).map((item) => (
                        <li key={item.articleId} className="dashboard-list-item">
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>{item.completed ? "✅" : "⏳"}</span>
                            <div>
                              <div style={{ fontWeight: 600, color: "var(--navy)" }}>
                                {item.articleNumber}: {item.articleTitle}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                {item.completed
                                  ? `Completed on ${new Date(item.completedAt).toLocaleDateString()}`
                                  : "Not yet completed (requires 60% on quiz)"}
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/articles/${item.articleId}`}
                            className="btn btn-sm btn-outline"
                          >
                            {item.completed ? "Review" : "Study"}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Quick shortcuts & Constitution Tips */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="card" style={{ background: "var(--navy)", color: "var(--white)" }}>
                  <h3 style={{ color: "var(--white)", fontSize: "1.1rem", marginBottom: "8px" }}>
                    🏛️ Quick Citizen Actions
                  </h3>
                  <p style={{ fontSize: "0.88rem", opacity: 0.85, lineHeight: 1.5, marginBottom: "16px" }}>
                    Test your knowledge, review fundamental duties, or play constitutional games.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Link
                      to="/topics"
                      className="btn"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white", justifyContent: "flex-start" }}
                    >
                      📖 Browse All Topics
                    </Link>
                    <Link
                      to="/progress"
                      className="btn"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white", justifyContent: "flex-start" }}
                    >
                      🎯 Check Detailed Progress
                    </Link>
                    <Link
                      to="/games"
                      className="btn"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white", justifyContent: "flex-start" }}
                    >
                      🎮 Play Learning Games
                    </Link>
                  </div>
                </div>

                <div className="card" style={{ background: "var(--teal-soft)", border: "1px solid var(--light-teal)" }}>
                  <h3 style={{ color: "var(--navy)", fontSize: "1.05rem", marginBottom: "8px" }}>
                    📜 Preamble Reflection
                  </h3>
                  <blockquote
                    style={{
                      margin: 0,
                      fontStyle: "italic",
                      fontSize: "0.88rem",
                      color: "#1e3c36",
                      lineHeight: 1.6,
                    }}
                  >
                    "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC..."
                  </blockquote>
                  <div style={{ marginTop: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Adopted 26 November 1949
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
