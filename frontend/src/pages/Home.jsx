import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Icon } from "../components/Icons";

const PREAMBLE_VALUES = [
  {
    key: "SOVEREIGN",
    meaning: "Supreme and independent power; free from external control or foreign interference.",
  },
  {
    key: "SOCIALIST",
    meaning: "Commitment to ending poverty, ignorance, disease, and inequality of opportunity.",
  },
  {
    key: "SECULAR",
    meaning: "Equal respect, protection, and freedom for all religions from the State.",
  },
  {
    key: "DEMOCRATIC",
    meaning: "Government of the people, by the people, and for the people through universal adult suffrage.",
  },
  {
    key: "REPUBLIC",
    meaning: "Head of the State is an elected citizen, not a hereditary monarch.",
  },
  {
    key: "JUSTICE",
    meaning: "Social, economic, and political justice ensuring fairness for all segments of society.",
  },
  {
    key: "LIBERTY",
    meaning: "Freedom of thought, expression, belief, faith, and worship.",
  },
  {
    key: "EQUALITY",
    meaning: "Equal status and opportunity without discrimination before the law.",
  },
  {
    key: "FRATERNITY",
    meaning: "Brotherhood assuring the dignity of the individual and unity of the Nation.",
  },
];

const CURRENT_YEAR = 2026;

function Home() {
  const [activeWord, setActiveWord] = useState(PREAMBLE_VALUES[0]);

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <main className="landing-hero-section">
        <div className="landing-hero-content">
          <div className="landing-tricolor-badge">
            <span className="tricolor-dot saffron" />
            <span className="tricolor-dot white" />
            <span className="tricolor-dot green" />
            <span>Democracy & Constitutional Literacy for Every Citizen</span>
          </div>

          <h1 className="landing-main-title">
            The Living Spirit of India, <br />
            <span className="text-gradient">Simplified for All</span>
          </h1>

          <p className="landing-hero-description">
            Demystifying legal provisions, fundamental rights, and citizen duties. Read side-by-side authentic articles, test your understanding with chapter quizzes, and query our verified constitutional AI tutor.
          </p>

          <div className="landing-actions">
            <Link to="/topics" className="btn btn-primary btn-lg btn-glow">
              <Icon name="constitution" size={18} />
              <span>Explore Constitution Topics</span>
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              <Icon name="dashboard" size={18} />
              <span>Citizen Dashboard</span>
            </Link>
            <Link to="/games" className="btn btn-secondary btn-lg">
              <Icon name="games" size={18} />
              <span>Play Games</span>
            </Link>
          </div>

          {/* Quick topic shortcut pills */}
          <div className="hero-quick-topics">
            <span className="hero-quick-label">Popular Modules:</span>
            <Link to="/topics" className="hero-pill">
              Fundamental Rights (Art. 14–32)
            </Link>
            <Link to="/topics" className="hero-pill">
              Directive Principles (Art. 36–51)
            </Link>
            <Link to="/topics" className="hero-pill">
              Preamble & Territory (Art. 1–4)
            </Link>
          </div>
        </div>

        {/* Hero Visual Card: Interactive Preamble Showcase */}
        <div className="landing-preamble-card">
          <div className="preamble-card-header">
            <div className="preamble-emblem">
              <Icon name="chakra" size={32} />
            </div>
            <div>
              <span className="preamble-subtitle">Preamble of the Constitution</span>
              <h2 className="preamble-title">We, The People of India</h2>
            </div>
          </div>

          <div className="preamble-card-body">
            <p className="preamble-text">
              "Having solemnly resolved to constitute India into a{" "}
              {PREAMBLE_VALUES.slice(0, 5).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`preamble-interactive-word ${
                    activeWord.key === item.key ? "active" : ""
                  }`}
                  onClick={() => setActiveWord(item)}
                >
                  {item.key}
                </button>
              ))}{" "}
              and to secure to all its citizens:"
            </p>

            <div className="preamble-core-values">
              {PREAMBLE_VALUES.slice(5).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`preamble-value-chip ${
                    activeWord.key === item.key ? "active" : ""
                  }`}
                  onClick={() => setActiveWord(item)}
                >
                  <strong>{item.key}</strong>
                </button>
              ))}
            </div>

            {/* Dynamic Interactive Meaning Box */}
            <div className="preamble-meaning-box">
              <div className="preamble-meaning-title">
                <Icon name="sparkles" size={15} />
                <span>Meaning of <strong>{activeWord.key}</strong>:</span>
              </div>
              <p className="preamble-meaning-desc">{activeWord.meaning}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Metrics Banner */}
      <section className="metrics-banner" aria-label="Key Constitutional Metrics">
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-number">395</span>
            <span className="metric-title">Original Articles</span>
            <span className="metric-desc">Organized across 22 comprehensive parts</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">12</span>
            <span className="metric-title">Schedules</span>
            <span className="metric-desc">Covering states, powers, and administration</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">60%</span>
            <span className="metric-title">Quiz Mastery Goal</span>
            <span className="metric-desc">Earn article completion and build your civic score</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">100%</span>
            <span className="metric-title">Open & Verified</span>
            <span className="metric-desc">Grounded in authentic constitutional text</span>
          </div>
        </div>
      </section>

      {/* Four Core Features Section */}
      <section className="landing-features-section">
        <div className="section-header-centered">
          <span className="section-kicker">Interactive Learning Suite</span>
          <h2 className="section-headline">Everything You Need to Master Your Rights</h2>
          <p className="section-subtext">
            Designed to bridge the gap between complex legal jargon and everyday citizen understanding.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-badge icon-navy">
              <Icon name="constitution" size={26} />
            </div>
            <h3 className="feature-title">Dual-Text Architecture</h3>
            <p className="feature-desc">
              Study the authentic text drafted by the Constituent Assembly alongside clear, simple explanations and everyday practical examples.
            </p>
            <div className="feature-card-footer">
              <span className="feature-tag">Side-by-side clarity</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge icon-blue">
              <Icon name="trophy" size={26} />
            </div>
            <h3 className="feature-title">Comprehension Quizzes</h3>
            <p className="feature-desc">
              Validate your knowledge with chapter-based assessments. Achieve 60% or higher to mark articles complete and earn constitutional achievements.
            </p>
            <div className="feature-card-footer">
              <span className="feature-tag">Instant feedback & explanations</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge icon-teal">
              <Icon name="ai" size={26} />
            </div>
            <h3 className="feature-title">Constitutional AI Tutor</h3>
            <p className="feature-desc">
              Ask nuanced questions in English or Hindi. Powered by Gemini, answers are grounded directly in the constitutional articles without hallucinations.
            </p>
            <div className="feature-card-footer">
              <span className="feature-tag">Bilingual & multi-style</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge icon-orange">
              <Icon name="fire" size={26} />
            </div>
            <h3 className="feature-title">Habit Streaks & Progress</h3>
            <p className="feature-desc">
              Stay accountable with daily calendar streak check-ins, comprehensive syllabus completion trackers, and interactive educational minigames.
            </p>
            <div className="feature-card-footer">
              <span className="feature-tag">Daily civic engagement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="quote-banner">
        <div className="quote-container">
          <div className="quote-emblem">⚖️</div>
          <blockquote className="quote-text">
            "Constitution is not a mere lawyers' document, it is a vehicle of Life, and its spirit is always the spirit of Age."
          </blockquote>
          <cite className="quote-author">— Dr. Bhimrao Ramji Ambedkar, Chief Architect of the Constitution</cite>
        </div>
      </section>

      {/* Modern Civic Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand-column">
            <div className="navbar-brand">
              <span className="navbar-brand-icon-wrap">
                <Icon name="chakra" size={22} />
              </span>
              <span className="navbar-brand-main">Nagrik Aur Samvidhan</span>
            </div>
            <p className="footer-brand-desc">
              A public digital initiative to foster constitutional literacy, rights awareness, and active civic participation across India.
            </p>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-heading">Platform</h4>
            <Link to="/topics">Constitution Topics</Link>
            <Link to="/dashboard">Citizen Dashboard</Link>
            <Link to="/progress">Learning Progress</Link>
            <Link to="/games">Educational Games</Link>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-heading">Constitutional Milestones</h4>
            <span>Adopted: 26 November 1949</span>
            <span>Effective: 26 January 1950</span>
            <span>Assembly Sessions: 165 Days</span>
            <span>Words: 145,000+</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} Nagrik Aur Samvidhan. In dedication to the citizens of the Republic of India.</p>
          <p className="footer-disclaimer">
            The Constitution of India belongs to all its citizens. Built for public educational empowerment.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
