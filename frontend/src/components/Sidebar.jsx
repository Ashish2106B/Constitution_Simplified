import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-title">Learning Menu</div>
        <ul>
          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/dashboard"
            >
              <span className="sidebar-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/topics"
            >
              <span className="sidebar-icon">📖</span>
              <span>Constitution Topics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/progress"
            >
              <span className="sidebar-icon">🎯</span>
              <span>My Progress</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/games"
            >
              <span className="sidebar-icon">🎮</span>
              <span>Learning Games</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer-card">
        <strong>Daily Constitution Tip</strong>
        <span>Understanding your fundamental rights strengthens our democracy.</span>
      </div>
    </aside>
  );
}

export default Sidebar;
