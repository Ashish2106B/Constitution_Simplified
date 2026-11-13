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
      {loading && <p>Loading article...</p>}
      {!loading && notFound && (
        <>
          <h1>Article not found</h1>
          <p>The requested article could not be found.</p>
          <Link to="/topics">Back to topics</Link>
        </>
      )}
      {!loading && !notFound && error && <p role="alert">{error}</p>}
      {!loading && !notFound && !error && article && (
        <>
          <header>
            <p>{article.articleNumber}</p>
            <h1>{article.title}</h1>
          </header>

          <section>
            <h2>Original constitutional text</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{article.originalText}</p>
          </section>

          <section>
            <h2>Simplified explanation</h2>
            <p>{article.simplifiedText}</p>
          </section>

          {article.example && (
            <section>
              <h2>Real-life example</h2>
              <p>{article.example}</p>
            </section>
          )}

          <nav aria-label="Article actions">
            <Link to={`/topics/${article.topicId}/articles`}>
              Back to {article.topic?.name || "topic articles"}
            </Link>
            <Link to={`/articles/${article.id}/quiz`}>Start Article Quiz</Link>
            <Link to={`/articles/${article.id}/ai`}>Ask AI</Link>
          </nav>
        </>
      )}
    </Layout>
  );
}

export default Article;
