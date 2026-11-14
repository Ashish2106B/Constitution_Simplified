import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        showToast(`Welcome back, ${response.user?.username || "Citizen"}!`, "success");
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
          <Link to="/" className="auth-emblem-link" title="Return to Home">
            <div className="auth-emblem-badge">
              <Icon name="chakra" size={32} />
            </div>
          </Link>
          <h1 className="auth-title">Citizen Login</h1>
          <p className="auth-subtitle">
            Sign in to your Nagrik Aur Samvidhan account to sync your study progress and streaks
          </p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
            <button
              type="button"
              className="alert-close"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="user" size={16} />
              </span>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="citizen@example.com"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password">Password</label>
            </div>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="shield" size={16} />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-glow"
            disabled={loading}
            style={{ width: "100%", marginTop: "6px" }}
          >
            {loading ? (
              <>
                <span className="loading-spinner-inline" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <Icon name="arrow-right" size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
          <div className="auth-back-link">
            <Link to="/">
              <Icon name="arrow-left" size={14} />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
