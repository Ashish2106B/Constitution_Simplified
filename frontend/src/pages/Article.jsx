import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { get } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

function Article() {
  const { articleId } = useParams();
  const { showToast } = useToast();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Reader Preferences
  const [fontSize, setFontSize] = useState("medium"); // "small", "medium", "large"
  const [viewMode, setViewMode] = useState("stacked"); // "stacked", "split"
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Reset speech if changing article
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const fetchArticle = async () => {
      try {
        const response = await get(`/articles/${articleId}`);
        if (!response?.article) {
          throw new Error("The article response is invalid");
        }

        if (isMounted) {
          setArticle(response.article);
          setError("");
          setNotFound(false);
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
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [articleId]);

  const handleCopyText = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`, "success");
    }
  };

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      showToast("Speech synthesis is not supported in your browser.", "info");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${article?.articleNumber}: ${article?.title}. Simplified explanation: ${article?.simplifiedText}. Example: ${article?.example || ""}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast("Reading article explanation aloud...", "info");
    }
  };

  return (
    <Layout>
      <div className={`page-container article-detail-container font-size-${fontSize}`}>
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading constitutional article...</p>
          </div>
        )}

        {!loading && notFound && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="search" size={40} />
            </div>
            <h1 className="page-title">Article not found</h1>
            <p className="empty-state-text">The requested article could not be found.</p>
            <Link to="/topics" className="btn btn-outline-blue btn-sm" style={{ marginTop: "14px" }}>
              Back to topics
            </Link>
          </div>
        )}

        {!loading && !notFound && error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {!loading && !notFound && !error && article && (
          <>
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="breadcrumb">
              <Link to="/topics" className="breadcrumb-link">Topics</Link>
              <span className="breadcrumb-separator">›</span>
              {article.topicId && (
                <>
                  <Link to={`/topics/${article.topicId}/articles`} className="breadcrumb-link">
                    {article.topic?.name || "Topic"}
                  </Link>
                  <span className="breadcrumb-separator">›</span>
                </>
              )}
              <span className="breadcrumb-current">{article.articleNumber}</span>
            </nav>

            {/* Article Header Banner */}
            <header className="article-header-banner">
              <div className="article-header-meta">
                <span className="article-number-badge">{article.articleNumber}</span>
                {article.topic?.name && (
                  <span className="badge badge-blue">{article.topic.name}</span>
                )}
                <span className="badge badge-teal">Constitution of India</span>
              </div>

              <h1 className="page-title article-title-main">
                {article.title}
              </h1>

              {/* Reader Controls Toolbar */}
              <div className="article-toolbar">
                <div className="toolbar-group">
                  <span className="toolbar-label">Reading Mode:</span>
                  <div className="view-mode-tabs">
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "stacked" ? "active" : ""}`}
                      onClick={() => setViewMode("stacked")}
                    >
                      Guided View
                    </button>
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
                      onClick={() => setViewMode("split")}
                    >
                      Side-by-Side Comparison
                    </button>
                  </div>
                </div>

                <div className="toolbar-group">
                  <span className="toolbar-label">Text Size:</span>
                  <div className="font-size-controls">
                    <button
                      type="button"
                      className={`font-btn ${fontSize === "small" ? "active" : ""}`}
                      onClick={() => setFontSize("small")}
                      title="Smaller text"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      className={`font-btn ${fontSize === "medium" ? "active" : ""}`}
                      onClick={() => setFontSize("medium")}
                      title="Medium text"
                    >
                      A
                    </button>
                    <button
                      type="button"
                      className={`font-btn ${fontSize === "large" ? "active" : ""}`}
                      onClick={() => setFontSize("large")}
                      title="Larger text"
                    >
                      A+
                    </button>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm ${isSpeaking ? "btn-danger" : "btn-outline-blue"}`}
                    onClick={toggleSpeech}
                    title={isSpeaking ? "Stop reading" : "Read aloud"}
                  >
                    <Icon name={isSpeaking ? "volume-x" : "volume"} size={15} />
                    <span>{isSpeaking ? "Stop Audio" : "Listen"}</span>
                  </button>
                </div>
              </div>

              {/* Quick Launch Action Pills */}
              <div className="article-header-actions">
                <Link
                  to={`/articles/${article.id}/quiz`}
                  className="btn btn-secondary btn-sm"
                >
                  <Icon name="trophy" size={15} />
                  <span>Start Article Quiz</span>
                </Link>
                <Link
                  to={`/articles/${article.id}/ai`}
                  className="btn btn-outline-blue btn-sm"
                >
                  <Icon name="ai" size={15} />
                  <span>Ask AI Assistant</span>
                </Link>
              </div>
            </header>

            {/* Article Content Display */}
            <div className={`article-content-wrapper ${viewMode === "split" ? "split-layout" : "stacked-layout"}`}>
              {/* Original Text Section */}
              <section className="article-section article-original-box">
                <div className="article-section-header">
                  <h2 className="article-section-title">
                    <span className="section-icon-badge">📜</span>
                    <span>Original constitutional text</span>
                  </h2>
                  <button
                    type="button"
                    className="copy-snippet-btn"
                    onClick={() => handleCopyText(article.originalText, "Original text")}
                    title="Copy original text"
                    aria-label="Copy original text"
                  >
                    <Icon name="copy" size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="article-original-text" style={{ whiteSpace: "pre-wrap" }}>
                  {article.originalText}
                </p>
                <div className="article-section-sub">
                  Official text as adopted by the Constituent Assembly of India
                </div>
              </section>

              {/* Simplified Explanation Section */}
              <section className="article-section article-simplified-box">
                <div className="article-section-header">
                  <h2 className="article-section-title">
                    <span className="section-icon-badge">💡</span>
                    <span>Simplified explanation</span>
                  </h2>
                  <button
                    type="button"
                    className="copy-snippet-btn"
                    onClick={() => handleCopyText(article.simplifiedText, "Simplified explanation")}
                    title="Copy simplified explanation"
                    aria-label="Copy simplified explanation"
                  >
                    <Icon name="copy" size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="article-simplified-text">{article.simplifiedText}</p>
                <div className="article-section-sub">
                  Plain-language breakdown for citizen comprehension
                </div>
              </section>
            </div>

            {/* Real-life Example Section */}
            {article.example && (
              <section className="article-section article-example-box">
                <div className="article-section-header">
                  <h2 className="article-section-title">
                    <span className="section-icon-badge">🌱</span>
                    <span>Real-life example</span>
                  </h2>
                  <button
                    type="button"
                    className="copy-snippet-btn"
                    onClick={() => handleCopyText(article.example, "Example")}
                    title="Copy example"
                    aria-label="Copy example"
                  >
                    <Icon name="copy" size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="article-example-text">{article.example}</p>
              </section>
            )}

            {/* Navigation & Next Actions */}
            <nav aria-label="Article actions" className="article-nav-actions">
              <Link
                to={`/topics/${article.topicId}/articles`}
                className="btn btn-outline btn-sm"
              >
                <Icon name="arrow-left" size={14} />
                <span>Back to {article.topic?.name || "topic articles"}</span>
              </Link>

              <div className="article-nav-right">
                <Link
                  to={`/articles/${article.id}/quiz`}
                  className="btn btn-secondary btn-sm"
                >
                  <Icon name="trophy" size={15} />
                  <span>Take Quiz (Requires 60%)</span>
                </Link>
                <Link
                  to={`/articles/${article.id}/ai`}
                  className="btn btn-primary btn-sm btn-glow"
                >
                  <Icon name="ai" size={15} />
                  <span>Ask AI Tutor</span>
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
