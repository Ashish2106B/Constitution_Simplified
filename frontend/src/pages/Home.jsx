import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <Link to="/" className="navbar-brand">
          <span>🏛️ Nagrik Aur Samvidhan</span>
          <span className="navbar-brand-badge">Citizen Learning</span>
        </Link>

        <nav aria-label="Main navigation" className="navbar-links">
          <Link className="navbar-link" to="/topics">
            Explore Topics
          </Link>
          <Link className="navbar-link" to="/dashboard">
            Dashboard
          </Link>
          <Link className="navbar-link" to="/progress">
            My Progress
          </Link>
          <Link className="navbar-link" to="/games">
            Games
          </Link>
          <Link className="navbar-link" to="/login">
            Login
          </Link>
          <Link className="navbar-link btn-nav-accent" to="/register">
            Register
          </Link>
        </nav>
      </header>

      <main className="landing-hero">
        <span className="landing-badge">Democracy & Constitutional Literacy</span>
        <h1 className="landing-title">Nagrik Aur Samvidhan</h1>
        <p className="landing-desc">
          Explore the Constitution of India through topics, articles, and quizzes.
        </p>

        <div className="landing-actions">
          <Link to="/topics" className="btn btn-primary btn-lg">
            Start Learning Topics →
          </Link>
          <Link to="/dashboard" className="btn btn-outline btn-lg">
            Citizen Dashboard
          </Link>
        </div>
      </main>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📜</div>
          <h2 className="feature-title">Original & Simplified Text</h2>
          <p className="feature-desc">
            Read authentic constitutional provisions side-by-side with clear, jargon-free explanations designed for every citizen.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✍️</div>
          <h2 className="feature-title">Knowledge Quizzes</h2>
          <p className="feature-desc">
            Test your comprehension with chapter-based quizzes. Score 60% or higher to master articles and build your civic score.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h2 className="feature-title">AI Assistant Grounding</h2>
          <p className="feature-desc">
            Ask questions in English or Hindi. Our AI assistant provides explanations and real-world examples grounded in verified constitutional text.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔥</div>
          <h2 className="feature-title">Track Daily Streaks</h2>
          <p className="feature-desc">
            Build a consistent habit of learning your rights and duties with daily UTC calendar streaks and article progress tracking.
          </p>
        </div>
      </section>

      <footer
        style={{
          marginTop: "auto",
          background: "var(--navy)",
          color: "rgba(255, 255, 255, 0.75)",
          padding: "28px 24px",
          textAlign: "center",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: "0 0 8px 0", color: "var(--white)" }}>
          Nagrik Aur Samvidhan — Empowering citizens through constitutional literacy.
        </p>
        <p style={{ margin: 0 }}>
          Constitution of India · Adopted November 26, 1949 · In effect January 26, 1950
        </p>
      </footer>
    </div>
  );
}

export default Home;
