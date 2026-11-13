import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { get, post } from "../services/api";

function AIAssistant() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState("simple");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "assistant",
      text: "Namaste! I am your AI Constitutional Assistant. Ask any question about this article, and I will explain it using simplified explanations, examples, or Hindi translations.",
      timestamp: "Today",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasToken] = useState(() =>
    typeof window !== "undefined" ? Boolean(localStorage.getItem("token")) : false
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchArticleInfo = async () => {
      try {
        const response = await get(`/articles/${articleId}`);
        if (isMounted && response?.article) {
          setArticle(response.article);
        }
      } catch {
        // Fallback gracefully if article metadata cannot be fetched
      }
    };

    if (articleId) {
      fetchArticleInfo();
    }
    return () => {
      isMounted = false;
    };
  }, [articleId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    setError("");
    const userMessage = {
      id: String(Date.now()),
      sender: "user",
      text: trimmedQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await post("/ai/explain", {
        articleId: Number(articleId),
        question: trimmedQuestion,
        language,
        style,
      });

      const explanation =
        response?.explanation || "I have analyzed the article text, but no detailed explanation was returned.";

      const aiMessage = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: explanation,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (requestError) {
      const errorMsg = requestError.message || "Failed to generate AI explanation.";
      setError(errorMsg);
      const aiErrorNotice = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: `⚠️ ${errorMsg}${
          !hasToken ? " (Please ensure you are logged in to use the AI assistant.)" : ""
        }`,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiErrorNotice]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setQuestion(promptText);
  };

  return (
    <Layout>
      <div className="page-container chat-container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/topics">Topics</Link>
          <span className="breadcrumb-separator">›</span>
          {article && (
            <>
              <Link to={`/articles/${articleId}`}>
                {article.articleNumber}: {article.title}
              </Link>
              <span className="breadcrumb-separator">›</span>
            </>
          )}
          <span>AI Assistant</span>
        </nav>

        <header className="chat-header-card">
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="badge badge-navy">AI Constitutional Tutor</span>
                {article && <span className="badge badge-blue">{article.articleNumber}</span>}
              </div>
              <h1 className="page-title" style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                {article ? `Ask AI: ${article.title}` : "AI Constitutional Assistant"}
              </h1>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>
                Ask questions to understand provisions, real-life applications, or historical intent.
              </p>
            </div>
            <Link to={`/articles/${articleId}`} className="btn btn-outline btn-sm">
              ← Return to Article
            </Link>
          </div>

          <div className="chat-controls-row">
            <div className="chat-control-group">
              <label htmlFor="ai-language">
                <strong>Language:</strong>
              </label>
              <select
                id="ai-language"
                className="chat-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>

            <div className="chat-control-group">
              <label htmlFor="ai-style">
                <strong>Explanation Style:</strong>
              </label>
              <select
                id="ai-style"
                className="chat-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="simple">Simple (Plain English)</option>
                <option value="example-based">Example-based</option>
                <option value="short">Short & Concise</option>
                <option value="detailed">In-depth Analysis</option>
              </select>
            </div>
          </div>
        </header>

        {!hasToken && (
          <div className="alert alert-info">
            <span>💡</span>
            <div>
              <strong>Note:</strong> The AI Assistant requires authentication.{" "}
              <Link to="/login" style={{ textDecoration: "underline", fontWeight: "bold" }}>
                Log in
              </Link>{" "}
              or{" "}
              <Link to="/register" style={{ textDecoration: "underline", fontWeight: "bold" }}>
                Register
              </Link>{" "}
              to submit questions.
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <div className="chat-messages-box">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-item ${
                msg.sender === "user" ? "message-user" : "message-assistant"
              }`}
            >
              <div
                className={`message-avatar ${
                  msg.sender === "user" ? "avatar-user" : "avatar-ai"
                }`}
              >
                {msg.sender === "user" ? "👤" : "🏛️"}
              </div>
              <div
                className={`message-bubble ${
                  msg.sender === "user" ? "bubble-user" : "bubble-assistant"
                }`}
                style={msg.isError ? { borderColor: "#f8c8c8", background: "#fdf0f0" } : {}}
              >
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    opacity: 0.7,
                    marginTop: "6px",
                    textAlign: msg.sender === "user" ? "right" : "left",
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-item message-assistant">
              <div className="message-avatar avatar-ai">🏛️</div>
              <div className="message-bubble bubble-assistant">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="loading-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                  <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    Reviewing constitutional provisions...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-card">
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)" }}>
              Suggested prompts:
            </span>
            <div className="quick-prompts">
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleQuickPrompt("Explain this article in simple words that a high school student would understand.")
                }
              >
                💡 Explain in simple terms
              </button>
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleQuickPrompt("Give me a real-life court case or practical daily life example of this article.")
                }
              >
                🌱 Give a practical example
              </button>
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleQuickPrompt("What are the key rights or duties conferred by this article?")
                }
              >
                ⚖️ Key rights & duties
              </button>
            </div>
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <textarea
              className="chat-textarea"
              placeholder="Ask anything about this article (up to 1,000 characters)..."
              value={question}
              maxLength={1000}
              rows={2}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !question.trim()}
              style={{ minHeight: "52px", padding: "0 20px" }}
            >
              {loading ? "Thinking..." : "Ask AI →"}
            </button>
          </form>

          <div className="chat-input-meta">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{question.length} / 1000</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AIAssistant;
