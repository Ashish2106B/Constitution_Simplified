import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { get } from "../services/api";
import { Icon } from "../components/Icons";

function TopicArticles() {
  const { topicId } = useParams();
  const [topicName, setTopicName] = useState("");
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        const response = await get(`/topics/${topicId}/articles`);
        if (!Array.isArray(response?.articles)) {
          throw new Error("The topic articles response is invalid");
        }

        if (isMounted) {
          setTopicName(response.topic || "Topic Articles");
          setArticles(response.articles);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Failed to load articles");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  const filteredArticles = articles.filter((art) => {
    const term = searchTerm.toLowerCase();
    return (
      art.articleNumber?.toLowerCase().includes(term) ||
      art.title?.toLowerCase().includes(term) ||
      art.simplifiedText?.toLowerCase().includes(term)
    );
  });

  return (
    <Layout>
      <div className="page-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <Icon name="pillar" size={14} />
            <span>Home</span>
          </Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/topics" className="breadcrumb-link">
            <span>Topics</span>
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{topicName || "Topic Articles"}</span>
        </nav>

        {/* Header */}
        <header className="page-header">
          <div className="page-header-row">
            <div>
              <span className="section-kicker">Articles in this Chapter</span>
              <h1 className="page-title">{topicName || "Topic Articles"}</h1>
              <p className="page-subtitle">
                Explore individual constitutional articles under this topic with simplified breakdowns, examples, and knowledge checks.
              </p>
            </div>
            <div className="header-action-group">
              <Link to="/topics" className="btn btn-outline btn-sm">
                <Icon name="arrow-left" size={14} />
                <span>Back to topics</span>
              </Link>
            </div>
          </div>

          {articles.length > 0 && (
            <div className="article-filter-bar">
              <div className="search-input-box" style={{ maxWidth: "340px" }}>
                <Icon name="search" size={16} className="search-icon" />
                <input
                  type="search"
                  className="search-input"
                  placeholder="Filter articles by number or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Filter articles"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear filter"
                  >
                    <Icon name="close" size={13} />
                  </button>
                )}
              </div>
              <span className="filter-count-badge">
                Showing {filteredArticles.length} of {articles.length} articles
              </span>
            </div>
          )}
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading constitutional articles...</p>
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

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="book" size={40} />
            </div>
            <h3 className="empty-state-title">No Articles Found</h3>
            <p className="empty-state-text">No articles are available for this topic yet.</p>
            <Link to="/topics" className="btn btn-outline-blue btn-sm" style={{ marginTop: "14px" }}>
              Back to topics
            </Link>
          </div>
        )}

        {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="search" size={40} />
            </div>
            <h3 className="empty-state-title">No Matching Articles</h3>
            <p className="empty-state-text">No articles matched "{searchTerm}".</p>
            <button
              type="button"
              className="btn btn-outline-blue btn-sm"
              onClick={() => setSearchTerm("")}
              style={{ marginTop: "12px" }}
            >
              Clear Filter
            </button>
          </div>
        )}

        {!loading && !error && filteredArticles.length > 0 && (
          <ul className="article-list">
            {filteredArticles.map((article) => (
              <li key={article.id} className="article-card card">
                <div className="article-card-header">
                  <div className="article-badge-group">
                    <span className="article-number-badge">
                      {article.articleNumber}
                    </span>
                    <span className="badge badge-teal">Official Provision</span>
                  </div>
                </div>

                <h2 className="article-card-title">
                  <Link to={`/articles/${article.id}`}>
                    {article.articleNumber}: {article.title}
                  </Link>
                </h2>

                {article.simplifiedText && (
                  <p className="article-card-snippet">{article.simplifiedText}</p>
                )}

                <div className="article-card-actions">
                  <Link
                    to={`/articles/${article.id}`}
                    className="btn btn-primary btn-sm btn-glow"
                  >
                    <Icon name="book" size={15} />
                    <span>Read Explanation</span>
                  </Link>
                  <Link
                    to={`/articles/${article.id}/quiz`}
                    className="btn btn-secondary btn-sm"
                  >
                    <Icon name="trophy" size={15} />
                    <span>Take Quiz</span>
                  </Link>
                  <Link
                    to={`/articles/${article.id}/ai`}
                    className="btn btn-outline-blue btn-sm"
                  >
                    <Icon name="ai" size={15} />
                    <span>Ask AI Tutor</span>
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

export default TopicArticles;
