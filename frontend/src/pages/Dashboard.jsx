import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { get, post } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

function Dashboard() {
  const { showToast } = useToast();
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
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const topicsRes = await get("/topics").catch(() => null);
        if (isMounted && topicsRes?.topics) {
          setTopics(topicsRes.topics);
        }

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

  const handleQuickCheckIn = async () => {
    if (!token) return;
    setCheckingIn(true);
    try {
      const res = await post("/streak/activity");
      if (res?.streak) {
        setStreakData(res.streak);
      }
      showToast(res?.message || "Daily constitutional check-in recorded! 🔥", "streak");
    } catch (err) {
      showToast(err.message || "Could not log check-in", "error");
    } finally {
      setCheckingIn(false);
    }
  };

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  });

  const totalArticles = progressData?.totalArticles || 0;
  const completedArticles = progressData?.completedArticles || 0;
  const completionPercent =
    totalArticles > 0 ? Math.round((completedArticles / totalArticles) * 100) : 0;

  return (
    <Layout>
      <div className="page-container">
        {/* Page Header */}
        <header className="page-header dashboard-header">
          <div className="dashboard-welcome-row">
            <div>
              <div className="welcome-greeting-badge">
                <span className="live-indicator-dot" />
                <span>{greeting}</span>
              </div>
              <h1 className="page-title">
                {user?.username ? `Welcome, ${user.username}!` : "Citizen Dashboard"}
              </h1>
              <p className="page-subtitle">
                Your learning overview will appear here. Track your constitutional study progress, daily streaks, and topic mastery.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link to="/topics" className="btn btn-primary btn-sm btn-glow">
                <Icon name="topics" size={16} />
                <span>Explore Topics</span>
                <Icon name="arrow-right" size={14} />
              </Link>
              <Link to="/games" className="btn btn-secondary btn-sm">
                <Icon name="games" size={16} />
                <span>Play Games</span>
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading your citizen dashboard...</p>
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
          <div className="guest-banner-card">
            <div className="guest-banner-content">
              <div className="guest-banner-icon">
                <Icon name="user" size={28} />
              </div>
              <div>
                <h3 className="guest-banner-title">Guest Citizen Mode</h3>
                <p className="guest-banner-desc">
                  You are currently exploring as a guest. Sign in or register to record your quiz scores, save article completions, and build your daily streak.
                </p>
              </div>
            </div>
            <div className="guest-banner-buttons">
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-outline-blue btn-sm">
                Create Account
              </Link>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Streak & Daily Check-in Banner (if authenticated) */}
            {token && (
              <div className="streak-banner-card">
                <div className="streak-banner-left">
                  <div className="streak-fire-badge">
                    <Icon name="fire" size={28} />
                  </div>
                  <div>
                    <div className="streak-title">
                      {streakData?.currentStreak ?? 0} Day Constitutional Habit!
                    </div>
                    <p className="streak-subtitle">
                      Personal best: <strong>{streakData?.longestStreak ?? 0} days</strong>. Take a quiz or study an article each day to keep your streak burning.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-streak-checkin"
                  onClick={handleQuickCheckIn}
                  disabled={checkingIn}
                >
                  <Icon name="streak" size={16} />
                  <span>{checkingIn ? "Logging..." : "⚡ Quick Check-in"}</span>
                </button>
              </div>
            )}

            {/* Stat Cards Grid */}
            <div className="dashboard-grid">
              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-blue">
                  <Icon name="topics" size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{topics.length}</div>
                  <div className="stat-label">Constitution Topics</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-teal">
                  <Icon name="check-circle" size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {token ? `${completedArticles}/${totalArticles}` : "--"}
                  </div>
                  <div className="stat-label">Articles Completed</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-orange">
                  <Icon name="fire" size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {token ? `${streakData?.currentStreak ?? 0} d` : "--"}
                  </div>
                  <div className="stat-label">Current Streak</div>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon-wrapper icon-navy">
                  <Icon name="trophy" size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {token ? `${streakData?.longestStreak ?? 0} d` : "--"}
                  </div>
                  <div className="stat-label">Best Streak</div>
                </div>
              </div>
            </div>

            {/* Main Sections Split Layout */}
            <div className="dashboard-sections-layout">
              {/* Left Column: Topics / In-progress */}
              <div className="dashboard-main-col">
                <div className="card">
                  <div className="card-header-row">
                    <div>
                      <h2 className="section-title" style={{ margin: 0 }}>
                        Study Modules
                      </h2>
                      <span className="section-subtitle">
                        Foundational chapters of the Indian Constitution
                      </span>
                    </div>
                    <Link to="/topics" className="card-header-link">
                      <span>View All ({topics.length})</span>
                      <Icon name="arrow-right" size={14} />
                    </Link>
                  </div>

                  {topics.length === 0 ? (
                    <div className="empty-state-mini">
                      <Icon name="book" size={24} />
                      <p>No study modules available yet.</p>
                    </div>
                  ) : (
                    <ul className="dashboard-card-list">
                      {topics.slice(0, 4).map((topic, index) => (
                        <li key={topic.id} className="dashboard-list-item">
                          <div className="module-item-left">
                            <span className="module-badge">
                              Module 0{index + 1}
                            </span>
                            <div className="module-item-title">{topic.name}</div>
                            <div className="module-item-desc">
                              {topic.description?.slice(0, 95)}...
                            </div>
                          </div>
                          <Link
                            to={`/topics/${topic.id}/articles`}
                            className="btn btn-outline-blue btn-sm module-explore-btn"
                          >
                            <span>Explore</span>
                            <Icon name="arrow-right" size={13} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {token && progressData?.progress && progressData.progress.length > 0 && (
                  <div className="card">
                    <div className="card-header-row">
                      <div>
                        <h2 className="section-title" style={{ margin: 0 }}>
                          Your Article Progress
                        </h2>
                        <span className="section-subtitle">
                          Articles completed with ≥ 60% score
                        </span>
                      </div>
                      <Link to="/progress" className="card-header-link">
                        <span>Detailed View</span>
                        <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>

                    <div className="progress-meter-box">
                      <div className="progress-meter-meta">
                        <span>Overall Syllabus Completion</span>
                        <strong>{completionPercent}%</strong>
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
                          <div className="article-progress-row">
                            <span
                              className={`status-icon-pill ${
                                item.completed ? "status-done" : "status-pending"
                              }`}
                            >
                              <Icon
                                name={item.completed ? "check" : "target"}
                                size={14}
                              />
                            </span>
                            <div>
                              <div className="article-item-title">
                                {item.articleNumber}: {item.articleTitle}
                              </div>
                              <div className="article-item-date">
                                {item.completed
                                  ? `Completed on ${new Date(item.completedAt).toLocaleDateString()}`
                                  : "Requires 60% on quiz to complete"}
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

              {/* Right Column: Shortcuts & Daily Wisdom */}
              <div className="dashboard-side-col">
                <div className="card quick-actions-card">
                  <h3 className="quick-actions-title">
                    <Icon name="sparkles" size={18} />
                    <span>Quick Citizen Actions</span>
                  </h3>
                  <p className="quick-actions-desc">
                    Fast access to key constitutional tools and interactive exercises.
                  </p>
                  <div className="quick-actions-list">
                    <Link to="/topics" className="quick-action-btn">
                      <span className="action-icon">
                        <Icon name="topics" size={16} />
                      </span>
                      <span>Browse All Topics</span>
                      <Icon name="arrow-right" size={14} className="action-arrow" />
                    </Link>
                    <Link to="/progress" className="quick-action-btn">
                      <span className="action-icon">
                        <Icon name="progress" size={16} />
                      </span>
                      <span>Detailed Progress Tracker</span>
                      <Icon name="arrow-right" size={14} className="action-arrow" />
                    </Link>
                    <Link to="/games" className="quick-action-btn">
                      <span className="action-icon">
                        <Icon name="games" size={16} />
                      </span>
                      <span>Play Educational Games</span>
                      <Icon name="arrow-right" size={14} className="action-arrow" />
                    </Link>
                  </div>
                </div>

                <div className="card preamble-quote-card">
                  <div className="preamble-quote-header">
                    <Icon name="scale" size={20} />
                    <span className="preamble-quote-title">Preamble Reflection</span>
                  </div>
                  <blockquote className="preamble-quote-body">
                    "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, LIBERTY, EQUALITY, FRATERNITY..."
                  </blockquote>
                  <div className="preamble-quote-date">
                    <span>Adopted 26 November 1949</span>
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
