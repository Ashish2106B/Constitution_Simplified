import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { get } from "../services/api";

function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTopics = async () => {
      try {
        const response = await get("/topics");
        if (isMounted) {
          setTopics(Array.isArray(response?.topics) ? response.topics : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Failed to load topics");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTopics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Topics</h1>
        {loading && <p>Loading topics...</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {!loading && !error && topics.length === 0 && (
          <p>No topics are available yet.</p>
        )}
        {!loading && !error && topics.length > 0 && (
          <ul>
            {topics.map((topic) => (
              <li className="card" key={topic.id}>
                <h2>
                  <Link to={`/topics/${topic.id}/articles`}>{topic.name}</Link>
                </h2>
                <p>{topic.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default Topics;
