import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function TopicArticles() {
  const { topicId } = useParams();
  const [topicName, setTopicName] = useState("");
  const [articles, setArticles] = useState([]);
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

  return (
    <Layout>
      <div className="page-container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/topics">Constitution Topics</Link>
          <span className="breadcrumb-separator">›</span>
          <span>{topicName || "Topic Articles"}</span>
        </nav>

        <header className="page-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <h1 className="page-title">{topicName || "Topic Articles"}</h1>
              <p className="page-subtitle">
                Explore individual constitutional articles under this topic with simplified breakdowns, examples, and knowledge checks.
              </p>
            </div>
            <Link to="/topics" className="btn btn-outline btn-sm">
              ← Back to topics
            </Link>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading articles...</p>
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

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3 className="empty-state-title">No Articles Found</h3>
            <p>No articles are available for this topic yet.</p>
            <Link to="/topics" className="btn btn-outline-blue btn-sm" style={{ marginTop: "14px" }}>
              Back to topics
            </Link>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <ul className="article-list">
            {articles.map((article) => (
              <li key={article.id} className="article-card card">
                <div className="article-card-header">
                  <span className="article-number-badge">
                    {article.articleNumber}
                  </span>
                  <span className="badge badge-teal">Official Provision</span>
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
                    className="btn btn-primary btn-sm"
                  >
                    Read Explanation
                  </Link>
                  <Link
                    to={`/articles/${article.id}/quiz`}
                    className="btn btn-outline-blue btn-sm"
                  >
                    Take Quiz ✍️
                  </Link>
                  <Link
                    to={`/articles/${article.id}/ai`}
                    className="btn btn-outline btn-sm"
                  >
                    Ask AI 🤖
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
