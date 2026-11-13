import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside>
      <h3>Learning Menu</h3>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/topics">Constitution Topics</Link></li>
        <li><Link to="/progress">My Progress</Link></li>
        <li><Link to="/games">Learning Games</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
