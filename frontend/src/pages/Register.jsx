import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await post("/auth/register", {
        username,
        email,
        password,
      });

      if (response?.token) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        navigate("/dashboard");
      } else {
        throw new Error("No authorization token received.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" style={{ fontSize: "1.8rem", display: "inline-block", marginBottom: "8px" }}>
            🏛️
          </Link>
          <h1>Register</h1>
          <p>Join Nagrik Aur Samvidhan to track your constitutional learning</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-username">Citizen Username</label>
            <input
              id="reg-username"
              type="text"
              className="form-input"
              placeholder="e.g. Priyanshu"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="citizen@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "var(--blue)" }}>
            Log in here
          </Link>
          <div style={{ marginTop: "14px" }}>
            <Link to="/" style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
