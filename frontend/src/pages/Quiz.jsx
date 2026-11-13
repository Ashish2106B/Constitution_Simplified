import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { get, post } from "../services/api";

function Quiz() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [articleTitle, setArticleTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const submissionLock = useRef(false);

  useEffect(() => {
    let isMounted = true;
    setArticleTitle("");
    setQuestions([]);
    setSelectedAnswers({});
    setLoading(true);
    setError("");
    setSubmissionError("");

    const fetchQuestions = async () => {
      try {
        const response = await get(`/quiz/article/${articleId}`);
        if (!Array.isArray(response?.questions)) {
          throw new Error("The quiz questions response is invalid");
        }

        if (isMounted) {
          setArticleTitle(response.articleTitle || "");
          setQuestions(response.questions);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Failed to load quiz questions");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const allQuestionsAnswered =
    questions.length > 0 &&
    questions.every((question) => selectedAnswers[question.id]);

  const answeredCount = questions.filter(
    (q) => selectedAnswers[q.id] !== undefined
  ).length;
  const progressPercent =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const submitQuiz = async () => {
    if (!allQuestionsAnswered || submissionLock.current) {
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setSubmissionError("");

    const answers = questions.map((question) => ({
      questionId: question.id,
      answer: selectedAnswers[question.id],
    }));

    try {
      const result = await post(`/quiz/article/${articleId}/submit`, {
        answers,
      });
      navigate("/quiz/result", { state: { result, articleTitle } });
    } catch (requestError) {
      setSubmissionError(
        requestError.message || "Failed to submit quiz answers"
      );
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container quiz-container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/topics">Topics</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to={`/articles/${articleId}`}>
            {articleTitle ? articleTitle : `Article ${articleId}`}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span>Knowledge Quiz</span>
        </nav>

        <header className="page-header">
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
              <span className="badge badge-navy" style={{ marginBottom: "6px" }}>
                Comprehension Check
              </span>
              <h1 className="page-title">
                {articleTitle ? `Quiz: ${articleTitle}` : "Quiz"}
              </h1>
              <p className="page-subtitle">
                Test your knowledge of this constitutional provision. Score 60% or above to mark the article complete.
              </p>
            </div>
            <Link to={`/articles/${articleId}`} className="btn btn-outline btn-sm">
              ← Back to Article
            </Link>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading quiz questions...</p>
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

        {!loading && !error && questions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✍️</div>
            <h3 className="empty-state-title">No Questions Available</h3>
            <p>No questions are available for this article yet.</p>
            <Link
              to={`/articles/${articleId}`}
              className="btn btn-outline-blue btn-sm"
              style={{ marginTop: "14px" }}
            >
              Return to Article
            </Link>
          </div>
        )}

        {!loading && !error && questions.length > 0 && (
          <>
            <div className="quiz-progress-bar-container">
              <div className="quiz-progress-meta">
                <span>Progress: {answeredCount} of {questions.length} answered</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="quiz-progress-track">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <ol className="quiz-questions-list">
              {questions.map((question, qIndex) => (
                <li key={question.id} className="quiz-question-card">
                  <div className="quiz-question-header">
                    <span className="badge badge-blue">
                      Question {qIndex + 1} of {questions.length}
                    </span>
                    {question.difficulty && (
                      <span className="badge badge-teal">
                        {question.difficulty}
                      </span>
                    )}
                  </div>
                  <h2 className="quiz-question-title">{question.questionText}</h2>
                  <ul className="quiz-options-list">
                    {[
                      { value: "A", text: question.optionA },
                      { value: "B", text: question.optionB },
                      { value: "C", text: question.optionC },
                      { value: "D", text: question.optionD },
                    ].map((option) => {
                      const isSelected =
                        selectedAnswers[question.id] === option.value;

                      return (
                        <li key={option.value}>
                          <label
                            className={`quiz-option-label ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.value}
                              checked={isSelected}
                              disabled={isSubmitting}
                              style={{ width: "16px", height: "16px", cursor: "pointer" }}
                              onChange={() =>
                                setSelectedAnswers((currentAnswers) => ({
                                  ...currentAnswers,
                                  [question.id]: option.value,
                                }))
                              }
                            />
                            <span className="quiz-option-letter">{option.value}</span>
                            <span className="quiz-option-text">
                              {option.value}. {option.text}
                              {isSelected && <strong> (Selected)</strong>}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>

            <div className="quiz-submit-card">
              <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-muted)" }}>
                {allQuestionsAnswered
                  ? "All questions answered! Click below to calculate your score and review explanations."
                  : `Please answer all questions (${questions.length - answeredCount} remaining) before submitting.`}
              </p>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={submitQuiz}
                disabled={!allQuestionsAnswered || isSubmitting}
                style={{ minWidth: "220px" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>

              {submissionError && (
                <div className="alert alert-error" role="alert" style={{ width: "100%", marginTop: "12px", textAlign: "left" }}>
                  <span>⚠️</span>
                  <div>
                    <strong>Submission Error:</strong> {submissionError}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Quiz;
