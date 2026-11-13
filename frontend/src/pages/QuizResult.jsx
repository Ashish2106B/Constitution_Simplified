import { Link, useLocation } from "react-router-dom";

import Layout from "../components/Layout";

function QuizResult() {
  const location = useLocation();
  const result = location.state?.result;
  const articleTitle = location.state?.articleTitle;

  return (
    <Layout>
      <h1>Quiz Result</h1>
      {!result ? (
        <>
          <p>No quiz result is available. Take a quiz to see your score.</p>
          <Link to="/topics">Back to topics</Link>
        </>
      ) : (
        <>
          <h2>{articleTitle || `Article ${result.articleId}`}</h2>
          <p>Total questions: {result.totalQuestions}</p>
          <p>Correct answers: {result.correctCount}</p>
          <p>Incorrect answers: {result.incorrectCount}</p>
          <p>Percentage score: {result.percentage}%</p>
          {result.articleId && (
            <Link to={`/articles/${result.articleId}`}>
              Return to article
            </Link>
          )}
        </>
      )}
    </Layout>
  );
}

export default QuizResult;
