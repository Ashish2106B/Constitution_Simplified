import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { get } from "../services/api";
import { Icon } from "../components/Icons";

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
        {/* Page Header */}
        <header className="page-header">
          <div className="page-header-row">
            <div>
              <div className="section-kicker">Constitutional Modules</div>
              <h1 className="page-title">Constitution Topics</h1>
              <p className="page-subtitle">
                Explore key pillars, articles, and foundational principles of the Constitution of India in simple, accessible language.
              </p>
            </div>

            {topics.length > 0 && (
              <div className="topics-search-wrapper">
                <div className="search-input-box">
                  <Icon name="search" size={17} className="search-icon" />
                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search topics by keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search topics"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {loading && (
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <strong>Error loading topics:</strong> {error}
            </div>
          </div>
        )}

        {!loading && !error && topics.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="book" size={40} />
            </div>
            <h3 className="empty-state-title">No Topics Available</h3>
            <p className="empty-state-text">No constitutional topics are available yet.</p>
          </div>
        )}

        {!loading && !error && topics.length > 0 && filteredTopics.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="search" size={40} />
            </div>
            <h3 className="empty-state-title">No Matching Topics</h3>
            <p className="empty-state-text">No topics matched your search for "{searchTerm}".</p>
            <button
              type="button"
              className="btn btn-outline-blue btn-sm"
              onClick={() => setSearchTerm("")}
              style={{ marginTop: "14px" }}
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {!loading && !error && filteredTopics.length > 0 && (
          <ul className="topics-grid">
            {filteredTopics.map((topic, index) => (
              <li className="topic-card card" key={topic.id}>
                <div className="topic-card-body">
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
                  <div className="topic-card-meta">
                    <Icon name="constitution" size={14} />
                    <span>Structured Learning</span>
                  </div>
                  <Link
                    to={`/topics/${topic.id}/articles`}
                    className="btn btn-sm btn-outline-blue topic-card-link-btn"
                  >
                    <span>View Articles</span>
                    <Icon name="arrow-right" size={13} />
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
