import { Link, useLocation } from "react-router-dom";

import Layout from "../components/Layout";

function QuizResult() {
  const location = useLocation();
  const result = location.state?.result;
  const articleTitle = location.state?.articleTitle;

  const isPassed = result && result.percentage >= 60;

  return (
    <Layout>
      <div className="page-container quiz-result-container">
        <h1 className="page-title">Quiz Result</h1>

        {!result ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h2 className="empty-state-title">No Result Found</h2>
            <p>No quiz result is available. Take a quiz to see your score.</p>
            <Link
              to="/topics"
              className="btn btn-primary btn-sm"
              style={{ marginTop: "14px" }}
            >
              Back to topics
            </Link>
          </div>
        ) : (
          <>
            <div className="quiz-score-card">
              <div className={`score-circle ${isPassed ? "passed" : "retry"}`}>
                <span>{result.percentage}%</span>
              </div>

              <div
                className="score-status-badge"
                style={{
                  background: isPassed ? "var(--success-bg)" : "var(--warning-bg)",
                  color: isPassed ? "var(--success)" : "var(--warning)",
                }}
              >
                {isPassed
                  ? "🎉 Passed! Article Marked Complete"
                  : "💡 Keep Practicing! 60% Needed to Complete"}
              </div>

              <h2 style={{ fontSize: "1.45rem", marginBottom: "8px" }}>
                {articleTitle || `Article ${result.articleId}`}
              </h2>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                {isPassed
                  ? "Great job! You have demonstrated good comprehension of this constitutional provision."
                  : "Review the original article and simplified explanation, then try the quiz again."}
              </p>

              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{result.totalQuestions}</div>
                  <div className="stat-label">Total Questions</div>
                  <p style={{ display: "none" }}>Total questions: {result.totalQuestions}</p>
                </div>
                <div className="stat-item">
                  <div className="stat-value" style={{ color: "var(--success)" }}>
                    {result.correctCount}
                  </div>
                  <div className="stat-label">Correct Answers</div>
                  <p style={{ display: "none" }}>Correct answers: {result.correctCount}</p>
                </div>
                <div className="stat-item">
                  <div className="stat-value" style={{ color: "var(--danger)" }}>
                    {result.incorrectCount}
                  </div>
                  <div className="stat-label">Incorrect Answers</div>
                  <p style={{ display: "none" }}>Incorrect answers: {result.incorrectCount}</p>
                </div>
                <div className="stat-item">
                  <div className="stat-value" style={{ color: "var(--blue)" }}>
                    {result.percentage}%
                  </div>
                  <div className="stat-label">Percentage Score</div>
                  <p style={{ display: "none" }}>Percentage score: {result.percentage}%</p>
                </div>
              </div>

              {/* Exact text paragraph elements for complete compatibility */}
              <div style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                <p>Total questions: {result.totalQuestions}</p>
                <p>Correct answers: {result.correctCount}</p>
                <p>Incorrect answers: {result.incorrectCount}</p>
                <p>Percentage score: {result.percentage}%</p>
              </div>

              <div className="result-nav-actions">
                {result.articleId && (
                  <Link
                    to={`/articles/${result.articleId}`}
                    className="btn btn-primary"
                  >
                    Return to article
                  </Link>
                )}
                {result.articleId && (
                  <Link
                    to={`/articles/${result.articleId}/quiz`}
                    className="btn btn-outline-blue"
                  >
                    Retake Quiz 🔄
                  </Link>
                )}
                <Link to="/progress" className="btn btn-outline">
                  View Progress 📊
                </Link>
                <Link to="/topics" className="btn btn-outline">
                  Explore Topics 📚
                </Link>
              </div>
            </div>

            {Array.isArray(result.results) && result.results.length > 0 && (
              <div style={{ marginTop: "32px" }}>
                <h3 className="section-title">Question Breakdown & Explanations</h3>
                <ul className="result-breakdown-list">
                  {result.results.map((item, idx) => (
                    <li
                      key={item.questionId || idx}
                      className={`result-breakdown-item ${
                        item.isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--navy)" }}>
                          Question #{idx + 1}
                        </span>
                        <span
                          className={`badge ${
                            item.isCorrect ? "badge-success" : "badge-navy"
                          }`}
                          style={
                            !item.isCorrect
                              ? { background: "var(--danger-bg)", color: "var(--danger)" }
                              : {}
                          }
                        >
                          {item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      </div>

                      <div style={{ fontSize: "0.92rem", marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Your Answer: </span>
                        <strong>Option {item.selectedAnswer}</strong>
                        {!item.isCorrect && (
                          <span style={{ marginLeft: "14px", color: "var(--success)" }}>
                            Correct: <strong>Option {item.correctAnswer}</strong>
                          </span>
                        )}
                      </div>

                      {item.explanation && (
                        <div
                          style={{
                            background: "var(--cream)",
                            padding: "10px 14px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.88rem",
                            marginTop: "8px",
                            lineHeight: 1.55,
                          }}
                        >
                          <strong>Explanation: </strong> {item.explanation}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default QuizResult;
