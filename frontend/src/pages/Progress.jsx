import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { get, post, patch } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

function Progress() {
  const { showToast } = useToast();
  const [token] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [progressData, setProgressData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "completed", "incomplete"
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [activityMessage, setActivityMessage] = useState("");
  const [recordingActivity, setRecordingActivity] = useState(false);
  const [updatingArticleId, setUpdatingArticleId] = useState(null);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    Promise.all([get("/progress"), get("/streak")])
      .then(([progRes, streakRes]) => {
        if (isMounted) {
          setProgressData(progRes);
          setStreakData(streakRes);
          setError("");
          setLoading(false);
        }
      })
      .catch((reqError) => {
        if (isMounted) {
          setError(reqError.message || "Failed to load progress data");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const refreshProgressAndStreak = async () => {
    try {
      const [progRes, streakRes] = await Promise.all([
        get("/progress"),
        get("/streak"),
      ]);
      setProgressData(progRes);
      setStreakData(streakRes);
    } catch {
      // ignore
    }
  };

  const handleRecordActivity = async () => {
    setRecordingActivity(true);
    setActivityMessage("");
    try {
      const response = await post("/streak/activity");
      const msg = response.message || "Daily activity logged!";
      setActivityMessage(msg);
      showToast(msg, "streak");
      if (response.streak) {
        setStreakData(response.streak);
      }
    } catch (err) {
      const errMsg = err.message || "Failed to record activity";
      setActivityMessage(errMsg);
      showToast(errMsg, "error");
    } finally {
      setRecordingActivity(false);
    }
  };

  const handleMarkComplete = async (articleId) => {
    setUpdatingArticleId(articleId);
    try {
      await patch(`/progress/article/${articleId}/complete`);
      showToast("Article marked as complete! ✓", "success");
      await refreshProgressAndStreak();
    } catch (err) {
      showToast(err.message || "Failed to update article status", "error");
    } finally {
      setUpdatingArticleId(null);
    }
  };

  const total = progressData?.totalArticles || 0;
  const completed = progressData?.completedArticles || 0;
  const remaining = progressData?.remainingArticles || 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressList = progressData?.progress || [];
  const filteredList = progressList.filter((item) => {
    const matchesFilter =
      filter === "completed"
        ? item.completed
        : filter === "incomplete"
        ? !item.completed
        : true;

    const term = searchQuery.toLowerCase();
    const matchesSearch =
      !term ||
      item.articleNumber?.toLowerCase().includes(term) ||
      item.articleTitle?.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      <div className="page-container">
        {/* Header */}
        <header className="page-header">
          <div className="page-header-row">
            <div>
              <span className="section-kicker">Citizen Achievement & Streaks</span>
              <h1 className="page-title">Progress</h1>
              <p className="page-subtitle">
                Your completed articles will appear here. Track your constitutional journey and maintain your daily learning streak.
              </p>
            </div>
            <div className="header-action-group">
              <Link to="/topics" className="btn btn-outline btn-sm">
                <Icon name="topics" size={14} />
                <span>Explore Topics</span>
                <Icon name="arrow-right" size={12} />
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading your constitutional progress...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {!loading && !token && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="user" size={40} />
            </div>
            <h2 className="empty-state-title">Sign in to Track Progress</h2>
            <p className="empty-state-text" style={{ maxWidth: "540px", margin: "0 auto 18px auto" }}>
              Progress tracking, streak counters, and article completion records require an account so your achievements are saved securely.
            </p>
            <div className="empty-state-actions">
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
              <div className="streak-banner-left">
                <div className="streak-fire-badge">
                  <Icon name="fire" size={28} />
                </div>
                <div>
                  <div className="streak-title">
                    {streakData?.currentStreak || 0} Day Learning Streak!
                  </div>
                  <p className="streak-subtitle">
                    Longest record: <strong>{streakData?.longestStreak || 0} days</strong>. Complete a quiz or review an article daily to keep your streak alive.
                  </p>
                  {activityMessage && (
                    <p className="streak-activity-message">
                      {activityMessage}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-streak-checkin"
                onClick={handleRecordActivity}
                disabled={recordingActivity}
              >
                <Icon name="streak" size={16} />
                <span>{recordingActivity ? "Checking in..." : "⚡ Check In Today"}</span>
              </button>
            </div>

            {/* Progress Stats Grid */}
            <div className="progress-stats-grid">
              <div className="card stat-highlight-card">
                <div className="stat-card-label">Completion Rate</div>
                <div className="stat-card-value text-navy">{percent}%</div>
                <div className="quiz-progress-track">
                  <div className="quiz-progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="stat-card-sub">Of total constitutional syllabus</div>
              </div>

              <div className="card stat-highlight-card">
                <div className="stat-card-label">Completed Articles</div>
                <div className="stat-card-value text-success">{completed}</div>
                <div className="stat-card-sub">Out of {total} total articles</div>
              </div>

              <div className="card stat-highlight-card">
                <div className="stat-card-label">Remaining Articles</div>
                <div className="stat-card-value text-blue">{remaining}</div>
                <div className="stat-card-sub">To achieve complete mastery</div>
              </div>
            </div>

            {/* Filter Tabs and Search Bar */}
            <div className="progress-controls-bar">
              <div className="progress-filter-tabs">
                <button
                  type="button"
                  className={`filter-tab-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All ({progressList.length})
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

              <div className="search-input-box" style={{ maxWidth: "260px" }}>
                <Icon name="search" size={15} className="search-icon" />
                <input
                  type="search"
                  className="search-input"
                  placeholder="Filter articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter articles in progress"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <Icon name="close" size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Table / List View */}
            {filteredList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Icon name="target" size={36} />
                </div>
                <h3 className="empty-state-title">No Articles Found</h3>
                <p className="empty-state-text">No articles match the current filter criteria.</p>
              </div>
            ) : (
              <div className="progress-table-card">
                {/* Desktop Table View */}
                <table className="progress-table desktop-only-table">
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
                            className="table-article-title-link"
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
                        <td className="table-date-cell">
                          {item.completedAt
                            ? new Date(item.completedAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="table-actions-cell">
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
                                disabled={updatingArticleId === item.articleId}
                                title="Mark completed manually"
                              >
                                {updatingArticleId === item.articleId
                                  ? "..."
                                  : "Mark Done"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Responsive Cards */}
                <div className="progress-mobile-list mobile-only-block">
                  {filteredList.map((item) => (
                    <div key={item.articleId} className="progress-mobile-card">
                      <div className="mobile-card-top">
                        <span className="badge badge-navy">
                          {item.articleNumber}
                        </span>
                        {item.completed ? (
                          <span className="badge badge-success">✓ Completed</span>
                        ) : (
                          <span className="badge badge-blue">⏳ In Progress</span>
                        )}
                      </div>

                      <h4 className="mobile-card-title">
                        <Link to={`/articles/${item.articleId}`}>
                          {item.articleTitle}
                        </Link>
                      </h4>

                      <div className="mobile-card-date">
                        {item.completedAt
                          ? `Completed on ${new Date(item.completedAt).toLocaleDateString()}`
                          : "Not yet completed"}
                      </div>

                      <div className="mobile-card-actions">
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
                          Take Quiz
                        </Link>
                        {!item.completed && (
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleMarkComplete(item.articleId)}
                            disabled={updatingArticleId === item.articleId}
                          >
                            {updatingArticleId === item.articleId ? "..." : "Mark Done"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Progress;
