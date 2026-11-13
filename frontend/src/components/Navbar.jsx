import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        <span>🏛️ Nagrik Aur Samvidhan</span>
        <span className="navbar-brand-badge">Constitution</span>
      </Link>

      <div className="navbar-links">
        <NavLink
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
          to="/topics"
        >
          Topics
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
          to="/dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
          to="/progress"
        >
          Progress
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
          to="/games"
        >
          Games
        </NavLink>

        {user ? (
          <>
            <span className="navbar-link" style={{ opacity: 0.9 }}>
              👤 {user.username || "Citizen"}
            </span>
            <button
              type="button"
              className="navbar-link btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
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
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
