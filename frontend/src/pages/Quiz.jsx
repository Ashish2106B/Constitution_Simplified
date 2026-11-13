import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function Quiz() {
  const { articleId } = useParams();
  const [articleTitle, setArticleTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setArticleTitle("");
    setQuestions([]);
    setLoading(true);
    setError("");

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
                <li>A. {question.optionA}</li>
                <li>B. {question.optionB}</li>
                <li>C. {question.optionC}</li>
                <li>D. {question.optionD}</li>
              </ul>
            </li>
          ))}
        </ol>
      )}
    </Layout>
  );
}

export default Quiz;
