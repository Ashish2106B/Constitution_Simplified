import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>Nagrik Aur Samvidhan</h1>
      <p>Explore the Constitution of India through topics, articles, and quizzes.</p>

      <nav aria-label="Main navigation">
        <ul>
          <li><Link to="/topics">Explore Topics</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/progress">My Progress</Link></li>
          <li><Link to="/games">Games</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </main>
  );
}

export default Home;
