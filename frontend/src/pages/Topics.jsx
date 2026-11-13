import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function Topics() {
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTopics = async () => {
      try {
        const response = await get("/topics");
        if (isMounted) {
          setTopics(Array.isArray(response?.topics) ? response.topics : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Failed to load topics");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTopics();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTopics = topics.filter((topic) => {
    const term = searchTerm.toLowerCase();
    return (
      topic.name?.toLowerCase().includes(term) ||
      topic.description?.toLowerCase().includes(term)
    );
  });

  return (
    <Layout>
      <div className="page-container">
        <header className="page-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 className="page-title">Constitution Topics</h1>
              <p className="page-subtitle">
                Explore key pillars, articles, and foundational principles of the Constitution of India in simple, accessible language.
              </p>
            </div>
            {topics.length > 0 && (
              <div style={{ minWidth: "260px" }}>
                <input
                  type="search"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--white)",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxShadow: "var(--shadow-sm)"
                  }}
                />
              </div>
            )}
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading topics...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <div>
              <strong>Error loading topics:</strong> {error}
            </div>
          </div>
        )}

        {!loading && !error && topics.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No Topics Available</h3>
            <p>No topics are available yet.</p>
          </div>
        )}

        {!loading && !error && topics.length > 0 && filteredTopics.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No Matching Topics</h3>
            <p>No topics matched your search for "{searchTerm}".</p>
            <button
              type="button"
              className="btn btn-outline-blue btn-sm"
              onClick={() => setSearchTerm("")}
              style={{ marginTop: "12px" }}
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && !error && filteredTopics.length > 0 && (
          <ul className="topics-grid">
            {filteredTopics.map((topic, index) => (
              <li className="topic-card card" key={topic.id}>
                <div>
                  <div className="topic-card-header">
                    <span className="topic-card-badge">
                      Module 0{index + 1}
                    </span>
                    <h2 className="topic-card-title">
                      <Link to={`/topics/${topic.id}/articles`}>
                        {topic.name}
                      </Link>
                    </h2>
                  </div>
                  <p className="topic-card-desc">{topic.description}</p>
                </div>

                <div className="topic-card-footer">
                  <span style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>
                    Structured Learning
                  </span>
                  <Link
                    to={`/topics/${topic.id}/articles`}
                    className="btn btn-sm btn-outline-blue"
                  >
                    <span>View Articles</span>
                    <span>→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default Topics;
