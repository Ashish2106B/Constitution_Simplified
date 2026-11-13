import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        Nagrik Aur Samvidhan
      </Link>

      <div className="navbar-links">
        <Link className="navbar-link" to="/topics">Topics</Link>
        <Link className="navbar-link" to="/dashboard">Dashboard</Link>
        <Link className="navbar-link" to="/progress">Progress</Link>
        <Link className="navbar-link" to="/games">Games</Link>
        <Link className="navbar-link" to="/login">Login</Link>
        <Link className="navbar-link" to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
