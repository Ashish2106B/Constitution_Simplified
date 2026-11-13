import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Learning Menu</h3>

      <ul>
        <li><Link className="sidebar-link" to="/dashboard">Dashboard</Link></li>
        <li><Link className="sidebar-link" to="/topics">Constitution Topics</Link></li>
        <li><Link className="sidebar-link" to="/progress">My Progress</Link></li>
        <li><Link className="sidebar-link" to="/games">Learning Games</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
