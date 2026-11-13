import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      navigate("/quiz/result", { state: { result } });
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
      <h1>{articleTitle ? `Quiz: ${articleTitle}` : "Quiz"}</h1>
      {loading && <p>Loading quiz questions...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && questions.length === 0 && (
        <p>No questions are available for this article yet.</p>
      )}
      {!loading && !error && questions.length > 0 && (
        <ol>
          {questions.map((question) => (
            <li key={question.id}>
              <h2>{question.questionText}</h2>
              <ul>
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
                      <label>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          checked={isSelected}
                          disabled={isSubmitting}
                          onChange={() =>
                            setSelectedAnswers((currentAnswers) => ({
                              ...currentAnswers,
                              [question.id]: option.value,
                            }))
                          }
                        />
                        {option.value}. {option.text}
                        {isSelected && <strong> (Selected)</strong>}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
      {!loading && !error && questions.length > 0 && (
        <>
          <button
            type="button"
            onClick={submitQuiz}
            disabled={!allQuestionsAnswered || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
          {submissionError && <p role="alert">{submissionError}</p>}
        </>
      )}
    </Layout>
  );
}

export default Quiz;
