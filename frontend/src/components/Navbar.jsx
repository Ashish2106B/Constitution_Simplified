import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Nagrik Aur Samvidhan</Link>

      <div>
        <Link to="/topics">Topics</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/games">Games</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
