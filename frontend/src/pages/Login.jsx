import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await post("/auth/login", { email, password });
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
      setError(err.message || "Login failed. Please check your credentials.");
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
          <h1>Login</h1>
          <p>Sign in to your Nagrik Aur Samvidhan account</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="citizen@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
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
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?{" "}
          <Link to="/register" style={{ fontWeight: 600, color: "var(--blue)" }}>
            Register here
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

export default Login;
