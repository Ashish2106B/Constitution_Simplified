import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { get, post } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

function AIAssistant() {
  const { articleId } = useParams();
  const { showToast } = useToast();
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
  const textareaRef = useRef(null);

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

  const handleCopyMessage = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast("Response copied to clipboard!", "success");
    }
  };

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
    textareaRef.current?.focus();
  };

  // Helper to format basic markdown (bold text, lists)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split("\n");
    return lines.map((line, idx) => {
      // Check for bullet line
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ");
      const content = isBullet ? trimmed.replace(/^[-*•]\s+/, "") : line;

      // Simple parser for bold **text**
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="bubble-list-item">
            {formattedParts}
          </li>
        );
      }

      return (
        <p key={idx} className="bubble-paragraph">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <Layout>
      <div className="page-container chat-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/topics" className="breadcrumb-link">Topics</Link>
          <span className="breadcrumb-separator">›</span>
          {article && (
            <>
              <Link to={`/articles/${articleId}`} className="breadcrumb-link">
                {article.articleNumber}: {article.title}
              </Link>
              <span className="breadcrumb-separator">›</span>
            </>
          )}
          <span className="breadcrumb-current">AI Assistant</span>
        </nav>

        {/* Chat Header Card */}
        <header className="chat-header-card">
          <div className="chat-header-top">
            <div>
              <div className="chat-badge-row">
                <span className="badge badge-navy">
                  <Icon name="ai" size={14} />
                  <span>AI Constitutional Tutor</span>
                </span>
                {article && <span className="badge badge-blue">{article.articleNumber}</span>}
              </div>
              <h1 className="page-title chat-title">
                {article ? `Ask AI: ${article.title}` : "AI Constitutional Assistant"}
              </h1>
              <p className="page-subtitle chat-subtitle">
                Grounded strictly in verified constitutional provisions. Ask about citizen rights, duties, or court precedents.
              </p>
            </div>

            <Link to={`/articles/${articleId}`} className="btn btn-outline btn-sm">
              <Icon name="arrow-left" size={14} />
              <span>Return to Article</span>
            </Link>
          </div>

          <div className="chat-controls-row">
            <div className="chat-control-group">
              <label htmlFor="ai-language">
                <Icon name="institution" size={14} />
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
                <Icon name="sparkles" size={14} />
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
            <span className="alert-icon">💡</span>
            <div className="alert-content">
              <strong>Account Required:</strong> The AI Assistant requires citizen authentication.{" "}
              <Link to="/login" style={{ textDecoration: "underline", fontWeight: "bold" }}>
                Log in
              </Link>{" "}
              or{" "}
              <Link to="/register" style={{ textDecoration: "underline", fontWeight: "bold" }}>
                Register
              </Link>{" "}
              to ask questions and explore explanations.
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
          </div>
        )}

        {/* Chat Messages Display */}
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
                {msg.sender === "user" ? (
                  <Icon name="user" size={18} />
                ) : (
                  <Icon name="chakra" size={20} />
                )}
              </div>
              <div
                className={`message-bubble ${
                  msg.sender === "user" ? "bubble-user" : "bubble-assistant"
                }`}
                style={msg.isError ? { borderColor: "#f8c8c8", background: "#fdf0f0" } : {}}
              >
                <div className="message-text">
                  {renderFormattedText(msg.text)}
                </div>

                <div className="message-footer-meta">
                  <span className="message-timestamp">{msg.timestamp}</span>
                  {msg.sender === "assistant" && !msg.isError && (
                    <button
                      type="button"
                      className="message-copy-btn"
                      onClick={() => handleCopyMessage(msg.text)}
                      title="Copy response"
                    >
                      <Icon name="copy" size={13} />
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-item message-assistant">
              <div className="message-avatar avatar-ai">
                <Icon name="chakra" size={20} />
              </div>
              <div className="message-bubble bubble-assistant">
                <div className="ai-typing-indicator">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="ai-typing-text">
                    Consulting verified constitutional text with Gemini...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input & Suggested Prompts Card */}
        <div className="chat-input-card">
          <div className="suggested-prompts-section">
            <span className="suggested-prompts-label">
              <Icon name="sparkles" size={13} />
              <span>Suggested Citizen Questions:</span>
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
              ref={textareaRef}
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
              className="btn btn-primary chat-send-btn"
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-inline" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Icon name="send" size={16} />
                </>
              )}
            </button>
          </form>

          <div className="chat-input-meta">
            <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line</span>
            <span className={`char-count ${question.length >= 950 ? "char-count-warning" : ""}`}>
              {question.length} / 1000
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AIAssistant;
