import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "./Icons";

const DAILY_TIPS = [
  {
    quote: "Understanding your fundamental rights strengthens our sovereign democracy.",
    author: "Constitutional Principle",
  },
  {
    quote: "Constitutional morality is not a natural sentiment. It has to be cultivated.",
    author: "Dr. B.R. Ambedkar",
  },
  {
    quote: "The Constitution is not a mere lawyer's document, it is a vehicle of Life.",
    author: "Dr. B.R. Ambedkar",
  },
  {
    quote: "Equality is the essence of democracy, liberty its soul.",
    author: "Preamble Ethos",
  },
];

function Sidebar() {
  const [tipIndex, setTipIndex] = useState(0);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  const currentTip = DAILY_TIPS[tipIndex];

  return (
    <>
      <aside className="sidebar" aria-label="Learning Sidebar">
        <div className="sidebar-section">
          <div className="sidebar-title">
            <span>Learning Portal</span>
          </div>

          <ul className="sidebar-menu">
            <li>
              <NavLink
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                to="/dashboard"
              >
                <span className="sidebar-icon-wrap">
                  <Icon name="dashboard" size={18} />
                </span>
                <span className="sidebar-link-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                to="/topics"
              >
                <span className="sidebar-icon-wrap">
                  <Icon name="topics" size={18} />
                </span>
                <span className="sidebar-link-text">Constitution Topics</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                to="/progress"
              >
                <span className="sidebar-icon-wrap">
                  <Icon name="progress" size={18} />
                </span>
                <span className="sidebar-link-text">My Progress</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                to="/games"
              >
                <span className="sidebar-icon-wrap">
                  <Icon name="games" size={18} />
                </span>
                <span className="sidebar-link-text">Learning Games</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer-card">
          <div className="sidebar-tip-header">
            <span className="sidebar-tip-badge">
              <Icon name="sparkles" size={13} />
              <span>Samvidhan Wisdom</span>
            </span>
            <button
              type="button"
              className="sidebar-tip-refresh"
              onClick={nextTip}
              title="Next constitution tip"
              aria-label="Next tip"
            >
              <Icon name="rotate" size={12} />
            </button>
          </div>
          <p className="sidebar-tip-quote">"{currentTip.quote}"</p>
          <span className="sidebar-tip-author">— {currentTip.author}</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar for modern app feel on phones */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <NavLink
          className={({ isActive }) =>
            `bottom-bar-item ${isActive ? "active" : ""}`
          }
          to="/dashboard"
        >
          <Icon name="dashboard" size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `bottom-bar-item ${isActive ? "active" : ""}`
          }
          to="/topics"
        >
          <Icon name="topics" size={20} />
          <span>Topics</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `bottom-bar-item ${isActive ? "active" : ""}`
          }
          to="/progress"
        >
          <Icon name="progress" size={20} />
          <span>Progress</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `bottom-bar-item ${isActive ? "active" : ""}`
          }
          to="/games"
        >
          <Icon name="games" size={20} />
          <span>Games</span>
        </NavLink>
      </nav>
    </>
  );
}

export default Sidebar;
