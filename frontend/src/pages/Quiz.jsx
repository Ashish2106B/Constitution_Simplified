import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { get, post } from "../services/api";
import { Icon } from "../components/Icons";

function Quiz() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [articleTitle, setArticleTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState("focus"); // "focus" or "all"
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const submissionLock = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        const response = await get(`/quiz/article/${articleId}`);
        if (!Array.isArray(response?.questions)) {
          throw new Error("The quiz questions response is invalid");
        }

        if (isMounted) {
          setArticleTitle(response.articleTitle || "");
          setQuestions(response.questions);
          setSelectedAnswers({});
          setCurrentQuestionIndex(0);
          setError("");
          setSubmissionError("");
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

  const handleSelectOption = useCallback((questionId, optionLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  }, []);

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

  const currentQ = questions[currentQuestionIndex];

  return (
    <Layout>
      <div className="page-container quiz-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/topics" className="breadcrumb-link">Topics</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to={`/articles/${articleId}`} className="breadcrumb-link">
            {articleTitle ? articleTitle : `Article ${articleId}`}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Knowledge Quiz</span>
        </nav>

        {/* Page Header */}
        <header className="page-header">
          <div className="page-header-row">
            <div>
              <div className="badge-row" style={{ marginBottom: "6px" }}>
                <span className="badge badge-navy">Comprehension Check</span>
                <span className="badge badge-teal">60% Required to Pass</span>
              </div>
              <h1 className="page-title">
                {articleTitle ? `Quiz: ${articleTitle}` : "Quiz"}
              </h1>
              <p className="page-subtitle">
                Test your knowledge of this constitutional provision. Score 60% or above to mark the article complete.
              </p>
            </div>

            <div className="header-action-group">
              <Link to={`/articles/${articleId}`} className="btn btn-outline btn-sm">
                <Icon name="arrow-left" size={14} />
                <span>Back to Article</span>
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading quiz questions...</p>
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

        {!loading && !error && questions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Icon name="trophy" size={40} />
            </div>
            <h3 className="empty-state-title">No Questions Available</h3>
            <p className="empty-state-text">No questions are available for this article yet.</p>
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
            {/* Quiz Progress & Navigation Palette */}
            <div className="quiz-progress-bar-container">
              <div className="quiz-progress-meta">
                <div className="quiz-progress-meta-left">
                  <span className="quiz-progress-text">
                    <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions answered
                  </span>
                  <span className="quiz-percent-pill">{progressPercent}% Completed</span>
                </div>

                {/* View Mode Toggle */}
                <div className="view-mode-tabs">
                  <button
                    type="button"
                    className={`view-mode-btn ${quizMode === "focus" ? "active" : ""}`}
                    onClick={() => setQuizMode("focus")}
                  >
                    Focus Mode
                  </button>
                  <button
                    type="button"
                    className={`view-mode-btn ${quizMode === "all" ? "active" : ""}`}
                    onClick={() => setQuizMode("all")}
                  >
                    All Questions
                  </button>
                </div>
              </div>

              {/* Progress Track */}
              <div className="quiz-progress-track">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Question Number Jump Palette */}
              <div className="question-palette">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = quizMode === "focus" && currentQuestionIndex === idx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`palette-dot ${isAnswered ? "answered" : ""} ${
                        isCurrent ? "current" : ""
                      }`}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        if (quizMode !== "focus") setQuizMode("focus");
                      }}
                      title={`Question ${idx + 1}: ${isAnswered ? "Answered" : "Unanswered"}`}
                    >
                      {idx + 1}
                      {isAnswered && <span className="palette-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FOCUS MODE: One Question at a Time */}
            {quizMode === "focus" && currentQ && (
              <div className="quiz-focus-card card">
                <div className="quiz-question-header">
                  <span className="badge badge-blue">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  {currentQ.difficulty && (
                    <span className="badge badge-teal">{currentQ.difficulty}</span>
                  )}
                </div>

                <h2 className="quiz-question-title">{currentQ.questionText}</h2>

                <ul className="quiz-options-list">
                  {[
                    { value: "A", text: currentQ.optionA },
                    { value: "B", text: currentQ.optionB },
                    { value: "C", text: currentQ.optionC },
                    { value: "D", text: currentQ.optionD },
                  ].map((option) => {
                    const isSelected = selectedAnswers[currentQ.id] === option.value;
                    return (
                      <li key={option.value}>
                        <label
                          className={`quiz-option-label ${isSelected ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQ.id}`}
                            value={option.value}
                            checked={isSelected}
                            disabled={isSubmitting}
                            className="quiz-radio-input"
                            onChange={() => handleSelectOption(currentQ.id, option.value)}
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

                {/* Focus mode navigation buttons */}
                <div className="focus-nav-bar">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  >
                    <Icon name="arrow-left" size={14} />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(questions.length - 1, prev + 1)
                        )
                      }
                    >
                      <span>Next Question</span>
                      <Icon name="arrow-right" size={14} />
                    </button>
                  ) : (
                    <span className="focus-last-indicator">Last Question</span>
                  )}
                </div>
              </div>
            )}

            {/* ALL QUESTIONS MODE */}
            {quizMode === "all" && (
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
                                className="quiz-radio-input"
                                onChange={() =>
                                  handleSelectOption(question.id, option.value)
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
            )}

            {/* Quiz Submit Card */}
            <div className="quiz-submit-card">
              <div className="quiz-submit-icon-wrap">
                <Icon name={allQuestionsAnswered ? "check-circle" : "trophy"} size={32} />
              </div>

              <div className="quiz-submit-info">
                <h3 className="quiz-submit-title">
                  {allQuestionsAnswered ? "Ready to Submit Your Quiz" : "Incomplete Quiz"}
                </h3>
                <p className="quiz-submit-desc">
                  {allQuestionsAnswered
                    ? "All questions answered! Click below to calculate your score, update progress, and review detailed explanations."
                    : `Please answer all questions (${questions.length - answeredCount} remaining) before submitting.`}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg btn-glow quiz-submit-action-btn"
                onClick={submitQuiz}
                disabled={!allQuestionsAnswered || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner-inline" />
                    <span>Grading & Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Quiz Answers</span>
                    <Icon name="arrow-right" size={16} />
                  </>
                )}
              </button>

              {submissionError && (
                <div className="alert alert-error quiz-submit-alert" role="alert">
                  <span className="alert-icon">⚠️</span>
                  <div className="alert-content">
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
