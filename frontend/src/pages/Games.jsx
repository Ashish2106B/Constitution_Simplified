import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { get, post } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

// Interactive Preamble Sequence Game Data
const PREAMBLE_CORRECT_ORDER = [
  "SOVEREIGN",
  "SOCIALIST",
  "SECULAR",
  "DEMOCRATIC",
  "REPUBLIC",
];

// Interactive Rights Matchup Game Data
const RIGHTS_MATCHUP_DATA = [
  { article: "Article 14", right: "Equality before Law and Equal Protection" },
  { article: "Article 19", right: "Protection of Six Democratic Freedoms (Speech, Assembly, Movement)" },
  { article: "Article 21", right: "Protection of Life and Personal Liberty" },
  { article: "Article 32", right: "Right to Constitutional Remedies (Heart & Soul of Constitution)" },
  { article: "Article 39", right: "Directive Principle: Adequate Means of Livelihood" },
];

function Games() {
  const { showToast } = useToast();
  const [token] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );
  const [games, setGames] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  // Interactive Mini-game 1: Preamble Puzzle State
  const [preambleChoices, setPreambleChoices] = useState([
    "DEMOCRATIC",
    "SOVEREIGN",
    "REPUBLIC",
    "SECULAR",
    "SOCIALIST",
  ]);
  const [preambleSelected, setPreambleSelected] = useState([]);
  const [preambleScore, setPreambleScore] = useState(null);

  // Interactive Mini-game 2: Rights Matchup State
  const [matchupScore, setMatchupScore] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadGamesData = async () => {
      try {
        if (token) {
          const [gamesRes, historyRes] = await Promise.all([
            get("/games").catch(() => null),
            get("/games/history").catch(() => null),
          ]);

          if (isMounted) {
            setGames(Array.isArray(gamesRes?.games) ? gamesRes.games : []);
            setHistory(Array.isArray(historyRes?.history) ? historyRes.history : []);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load educational games");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadGamesData();
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Mini-game 1 handlers
  const handleSelectPreambleWord = (word) => {
    if (preambleSelected.includes(word)) return;
    const nextSelected = [...preambleSelected, word];
    setPreambleSelected(nextSelected);

    if (nextSelected.length === PREAMBLE_CORRECT_ORDER.length) {
      // Check correctness
      let correctCount = 0;
      nextSelected.forEach((w, idx) => {
        if (w === PREAMBLE_CORRECT_ORDER[idx]) correctCount += 1;
      });
      const finalScore = Math.round((correctCount / PREAMBLE_CORRECT_ORDER.length) * 100);
      setPreambleScore(finalScore);

      if (finalScore === 100) {
        showToast("Perfect! You assembled the Preamble in exact constitutional order! 🏆", "success");
        // Record score if user is authenticated and backend game exists
        if (token && games.length > 0) {
          post(`/games/${games[0].id}/score`, { score: 100, totalScore: 100 }).catch(() => {});
        }
      } else {
        showToast(`Score: ${finalScore}%. Review the Preamble order and try again!`, "info");
      }
    }
  };

  const handleResetPreamble = () => {
    setPreambleSelected([]);
    setPreambleScore(null);
    setPreambleChoices([...PREAMBLE_CORRECT_ORDER].sort(() => Math.random() - 0.5));
  };

  // Mini-game 2 handlers
  const handleMatchRight = (item) => {
    if (!selectedArticle) {
      showToast("First select an Article on the left!", "info");
      return;
    }

    if (selectedArticle.article === item.article) {
      setMatchedPairs((prev) => {
        const updated = { ...prev, [selectedArticle.article]: true };
        if (Object.keys(updated).length === RIGHTS_MATCHUP_DATA.length) {
          setMatchupScore(100);
          showToast("Outstanding! All Fundamental Rights matched correctly! ⚖️", "success");
        } else {
          showToast(`Correct match for ${selectedArticle.article}!`, "success");
        }
        return updated;
      });
      setSelectedArticle(null);
    } else {
      showToast(`Incorrect match for ${selectedArticle.article}. Try again!`, "error");
      setSelectedArticle(null);
    }
  };

  const handleResetMatchup = () => {
    setMatchedPairs({});
    setSelectedArticle(null);
    setMatchupScore(null);
  };

  return (
    <Layout>
      <div className="page-container">
        {/* Header */}
        <header className="page-header">
          <div className="page-header-row">
            <div>
              <span className="section-kicker">Interactive Civic Gamification</span>
              <h1 className="page-title">Games</h1>
              <p className="page-subtitle">
                Available games and scores will appear here. Learn constitutional principles through engaging, interactive games.
              </p>
            </div>
            <div className="header-action-group">
              <Link to="/topics" className="btn btn-outline btn-sm">
                <Icon name="topics" size={14} />
                <span>Explore Topics</span>
              </Link>
            </div>
          </div>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading educational games...</p>
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

        {/* Guest alert */}
        {!loading && !token && (
          <div className="guest-banner-card" style={{ marginBottom: "28px" }}>
            <div className="guest-banner-content">
              <div className="guest-banner-icon">
                <Icon name="gamepad" size={28} />
              </div>
              <div>
                <h3 className="guest-banner-title">Guest Citizen Access</h3>
                <p className="guest-banner-desc">
                  You can play the interactive minigames below right now! Sign in or register to permanently record your scores and achievements.
                </p>
              </div>
            </div>
            <div className="guest-banner-buttons">
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-outline-blue btn-sm">
                Register
              </Link>
            </div>
          </div>
        )}

        {/* INTERACTIVE MINIGAME 1: Preamble Word Assembler */}
        <div className="card game-card">
          <div className="game-card-header">
            <div className="game-badge-group">
              <span className="badge badge-navy">Mini-Game 01</span>
              <span className="badge badge-teal">Foundational Preamble</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleResetPreamble}
            >
              <Icon name="rotate" size={13} />
              <span>Reset Game</span>
            </button>
          </div>

          <h2 className="game-title">Preamble Sequence Challenge</h2>
          <p className="game-desc">
            Assemble the five core constitutional keywords in their exact solemn order as written in the Preamble of the Constitution of India.
          </p>

          <div className="game-slots-container">
            <div className="game-slots-label">Your Constructed Sequence:</div>
            <div className="slots-row">
              {[0, 1, 2, 3, 4].map((slotIndex) => {
                const filledWord = preambleSelected[slotIndex];
                const isCorrect =
                  preambleScore !== null &&
                  filledWord === PREAMBLE_CORRECT_ORDER[slotIndex];
                return (
                  <div
                    key={slotIndex}
                    className={`sequence-slot ${filledWord ? "filled" : "empty"} ${
                      preambleScore !== null
                        ? isCorrect
                          ? "correct"
                          : "incorrect"
                        : ""
                    }`}
                  >
                    <span className="slot-number">#{slotIndex + 1}</span>
                    <span className="slot-word">{filledWord || "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clickable Words Palette */}
          <div className="game-choices-container">
            <div className="game-slots-label">Click words in correct sequence:</div>
            <div className="word-chips-grid">
              {preambleChoices.map((word) => {
                const isUsed = preambleSelected.includes(word);
                return (
                  <button
                    key={word}
                    type="button"
                    className={`game-word-chip ${isUsed ? "used" : ""}`}
                    disabled={isUsed || preambleScore !== null}
                    onClick={() => handleSelectPreambleWord(word)}
                  >
                    <span>{word}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {preambleScore !== null && (
            <div className={`game-score-banner ${preambleScore === 100 ? "score-perfect" : "score-partial"}`}>
              <Icon name={preambleScore === 100 ? "trophy" : "sparkles"} size={24} />
              <div>
                <strong>Sequence Score: {preambleScore}%</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem" }}>
                  {preambleScore === 100
                    ? "Magnificent! You correctly identified the order: Sovereign, Socialist, Secular, Democratic, Republic."
                    : "The correct sequence is: SOVEREIGN → SOCIALIST → SECULAR → DEMOCRATIC → REPUBLIC."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* INTERACTIVE MINIGAME 2: Fundamental Rights Matchup */}
        <div className="card game-card">
          <div className="game-card-header">
            <div className="game-badge-group">
              <span className="badge badge-navy">Mini-Game 02</span>
              <span className="badge badge-teal">Rights & Remedies</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleResetMatchup}
            >
              <Icon name="rotate" size={13} />
              <span>Reset Game</span>
            </button>
          </div>

          <h2 className="game-title">Constitutional Rights Matchup</h2>
          <p className="game-desc">
            First select an Article from the left column, then select its matching Fundamental Right or principle on the right.
          </p>

          <div className="matchup-interactive-grid">
            {/* Left: Articles */}
            <div className="matchup-col">
              <div className="matchup-col-title">Constitutional Provision:</div>
              <div className="matchup-buttons-list">
                {RIGHTS_MATCHUP_DATA.map((item) => {
                  const isMatched = matchedPairs[item.article];
                  const isSelected = selectedArticle?.article === item.article;
                  return (
                    <button
                      key={item.article}
                      type="button"
                      className={`matchup-btn ${isMatched ? "matched" : ""} ${
                        isSelected ? "selected" : ""
                      }`}
                      disabled={isMatched}
                      onClick={() => setSelectedArticle(item)}
                    >
                      <Icon name={isMatched ? "check" : "constitution"} size={16} />
                      <span>{item.article}</span>
                      {isMatched && <span className="matched-badge">✓ Matched</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Rights */}
            <div className="matchup-col">
              <div className="matchup-col-title">Core Protection or Principle:</div>
              <div className="matchup-buttons-list">
                {RIGHTS_MATCHUP_DATA.map((item) => {
                  const isMatched = matchedPairs[item.article];
                  return (
                    <button
                      key={item.article}
                      type="button"
                      className={`matchup-btn matchup-target-btn ${isMatched ? "matched" : ""}`}
                      disabled={isMatched}
                      onClick={() => handleMatchRight(item)}
                    >
                      <span>{item.right}</span>
                      {isMatched && <span className="matched-badge">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {matchupScore === 100 && (
            <div className="game-score-banner score-perfect" style={{ marginTop: "18px" }}>
              <Icon name="trophy" size={24} />
              <div>
                <strong>100% Mastery Achieved!</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem" }}>
                  You have successfully paired all landmark constitutional articles with their core legal protections.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Backend Games (if present) */}
        {!loading && token && games.length > 0 && (
          <div style={{ marginTop: "32px", marginBottom: "32px" }}>
            <h2 className="section-title">Official Educational Games</h2>
            <div className="topics-grid">
              {games.map((game) => (
                <div key={game.id} className="card">
                  <div className="card-header-row" style={{ marginBottom: "10px" }}>
                    <span className="badge badge-teal">{game.gameType || "Quiz Game"}</span>
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>ID #{game.id}</span>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", margin: "0 0 8px 0", color: "var(--navy)" }}>
                    {game.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
                    {game.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game History (if present) */}
        {!loading && token && history.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <h2 className="section-title">Your Game Score History</h2>
            <div className="progress-table-card">
              <table className="progress-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Played At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 600, color: "var(--navy)" }}>
                        {record.game?.title || `Game #${record.id}`}
                      </td>
                      <td>
                        <span className="badge badge-navy">
                          {record.game?.gameType || "Standard"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--blue)" }}>
                          {record.score} / {record.totalScore}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {new Date(record.playedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Games;
