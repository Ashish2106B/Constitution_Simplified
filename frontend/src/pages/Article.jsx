import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function Article() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setArticle(null);
    setLoading(true);
    setError("");
    setNotFound(false);

    const fetchArticle = async () => {
      try {
        const response = await get(`/articles/${articleId}`);
        if (!response?.article) {
          throw new Error("The article response is invalid");
        }

        if (isMounted) {
          setArticle(response.article);
        }
      } catch (requestError) {
        if (isMounted) {
          if (requestError.message === "Article not found") {
            setNotFound(true);
          } else {
            setError(requestError.message || "Failed to load article");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticle();
    return () => {
      isMounted = false;
    };
  }, [articleId]);

  return (
    <Layout>
      <div className="page-container article-detail-container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading article...</p>
          </div>
        )}

        {!loading && notFound && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h1 className="page-title">Article not found</h1>
            <p>The requested article could not be found.</p>
            <Link to="/topics" className="btn btn-outline-blue btn-sm" style={{ marginTop: "14px" }}>
              Back to topics
            </Link>
          </div>
        )}

        {!loading && !notFound && error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {!loading && !notFound && !error && article && (
          <>
            <nav aria-label="Breadcrumb" className="breadcrumb">
              <Link to="/topics">Topics</Link>
              <span className="breadcrumb-separator">›</span>
              {article.topicId && (
                <>
                  <Link to={`/topics/${article.topicId}/articles`}>
                    {article.topic?.name || "Topic"}
                  </Link>
                  <span className="breadcrumb-separator">›</span>
                </>
              )}
              <span>{article.articleNumber}</span>
            </nav>

            <header className="article-header-banner">
              <div className="article-header-meta">
                <span className="article-number-badge">{article.articleNumber}</span>
                {article.topic?.name && (
                  <span className="badge badge-blue">{article.topic.name}</span>
                )}
              </div>
              <h1 className="page-title" style={{ marginBottom: "12px" }}>
                {article.title}
              </h1>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                <Link
                  to={`/articles/${article.id}/quiz`}
                  className="btn btn-secondary btn-sm"
                >
                  Start Article Quiz ✍️
                </Link>
                <Link
                  to={`/articles/${article.id}/ai`}
                  className="btn btn-outline-blue btn-sm"
                >
                  Ask AI Assistant 🤖
                </Link>
              </div>
            </header>

            <section className="article-section article-original-box">
              <h2 className="article-section-title">
                <span>📜</span>
                <span>Original constitutional text</span>
              </h2>
              <p className="article-original-text" style={{ whiteSpace: "pre-wrap" }}>
                {article.originalText}
              </p>
            </section>

            <section className="article-section article-simplified-box">
              <h2 className="article-section-title">
                <span>💡</span>
                <span>Simplified explanation</span>
              </h2>
              <p className="article-simplified-text">{article.simplifiedText}</p>
            </section>

            {article.example && (
              <section className="article-section article-example-box">
                <h2 className="article-section-title">
                  <span>🌱</span>
                  <span>Real-life example</span>
                </h2>
                <p className="article-example-text">{article.example}</p>
              </section>
            )}

            <nav aria-label="Article actions" className="article-nav-actions">
              <Link
                to={`/topics/${article.topicId}/articles`}
                className="btn btn-outline btn-sm"
              >
                ← Back to {article.topic?.name || "topic articles"}
              </Link>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  to={`/articles/${article.id}/quiz`}
                  className="btn btn-secondary btn-sm"
                >
                  Start Article Quiz ✍️
                </Link>
                <Link
                  to={`/articles/${article.id}/ai`}
                  className="btn btn-primary btn-sm"
                >
                  Ask AI 🤖
                </Link>
              </div>
            </nav>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Article;
