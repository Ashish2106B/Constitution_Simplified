import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "./Icons";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      const token = localStorage.getItem("token");
      if (token) {
        return { username: "Citizen" };
      }
    } catch {
      return null;
    }
    return null;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-left">
        <Link className="navbar-brand" to="/" onClick={closeMobile}>
          <span className="navbar-brand-icon-wrap" aria-hidden="true">
            <Icon name="chakra" size={24} />
          </span>
          <div className="navbar-brand-text">
            <span className="navbar-brand-main">Nagrik Aur Samvidhan</span>
            <span className="navbar-brand-sub">Constitution of India</span>
          </div>
          <span className="navbar-brand-badge">Civic Portal</span>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          <NavLink
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            to="/topics"
          >
            <Icon name="topics" size={16} />
            <span>Topics</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            to="/dashboard"
          >
            <Icon name="dashboard" size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            to="/progress"
          >
            <Icon name="progress" size={16} />
            <span>Progress</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            to="/games"
          >
            <Icon name="games" size={16} />
            <span>Games</span>
          </NavLink>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle Theme"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>

          {user ? (
            <div className="navbar-user-chip">
              <span className="navbar-user-avatar" title={user.username || "Citizen"}>
                <Icon name="user" size={14} />
              </span>
              <span className="navbar-user-name">{user.username || "Citizen"}</span>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth-actions">
              <NavLink
                className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `navbar-link btn-nav-accent ${isActive ? "active" : ""}`
                }
                to="/register"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="navbar-mobile-controls">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobile}>
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-drawer-header">
              <div className="navbar-brand">
                <span className="navbar-brand-icon-wrap">
                  <Icon name="chakra" size={20} />
                </span>
                <span className="navbar-brand-main">Nagrik Samvidhan</span>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <NavLink
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "active" : ""}`
                }
                to="/"
                onClick={closeMobile}
              >
                <Icon name="pillar" size={18} />
                <span>Home</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "active" : ""}`
                }
                to="/topics"
                onClick={closeMobile}
              >
                <Icon name="topics" size={18} />
                <span>Constitution Topics</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "active" : ""}`
                }
                to="/dashboard"
                onClick={closeMobile}
              >
                <Icon name="dashboard" size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "active" : ""}`
                }
                to="/progress"
                onClick={closeMobile}
              >
                <Icon name="progress" size={18} />
                <span>My Progress</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "active" : ""}`
                }
                to="/games"
                onClick={closeMobile}
              >
                <Icon name="games" size={18} />
                <span>Learning Games</span>
              </NavLink>
            </div>

            <div className="mobile-drawer-footer">
              {user ? (
                <div className="mobile-user-box">
                  <div className="mobile-user-info">
                    <span className="navbar-user-avatar">
                      <Icon name="user" size={16} />
                    </span>
                    <div>
                      <div className="mobile-user-name">
                        {user.username || "Citizen"}
                      </div>
                      <div className="mobile-user-sub">Active Learner</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-actions">
                  <Link
                    to="/login"
                    className="btn btn-outline w-full"
                    onClick={closeMobile}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full"
                    onClick={closeMobile}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
