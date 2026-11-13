import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function TopicArticles() {
  const { topicId } = useParams();
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        const response = await get(`/topics/${topicId}/articles`);
        if (isMounted) {
          setTopicData(response);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Failed to load articles");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  return (
    <Layout>
      <h1>{topicData?.topic || "Topic Articles"}</h1>
      {loading && <p>Loading articles...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && topicData?.articles?.length === 0 && (
        <p>No articles are available for this topic yet.</p>
      )}
      {!loading && !error && topicData?.articles?.length > 0 && (
        <ul>
          {topicData.articles.map((article) => (
            <li key={article.id}>
              <Link to={`/articles/${article.id}`}>
                {article.articleNumber}: {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/topics">Back to topics</Link>
    </Layout>
  );
}

export default TopicArticles;
