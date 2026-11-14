import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";
import { Icon } from "../components/Icons";
import { useToast } from "../components/useToast";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "" };
    if (pass.length < 6) return { score: 1, label: "Too short (min 6)", color: "var(--danger)" };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    if (pass.length >= 8 && (hasNum || hasSpecial)) {
      return { score: 3, label: "Strong password", color: "var(--success)" };
    }
    return { score: 2, label: "Good password", color: "var(--warning)" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || loading) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

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
        showToast("Welcome to Nagrik Aur Samvidhan! Account created successfully.", "success");
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
          <Link to="/" className="auth-emblem-link" title="Return to Home">
            <div className="auth-emblem-badge">
              <Icon name="chakra" size={32} />
            </div>
          </Link>
          <h1 className="auth-title">Citizen Registration</h1>
          <p className="auth-subtitle">
            Join thousands of citizens learning and protecting the Constitution of India
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
            <label htmlFor="reg-username">Citizen Username</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="user" size={16} />
              </span>
              <input
                id="reg-username"
                type="text"
                className="form-input"
                placeholder="e.g. Ashish or Priyanshu"
                value={username}
                required
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="user" size={16} />
              </span>
              <input
                id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <Icon name="shield" size={16} />
              </span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                required
                autoComplete="new-password"
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

            {password && (
              <div className="password-strength-bar">
                <div
                  className="password-strength-fill"
                  style={{
                    width: `${(strength.score / 3) * 100}%`,
                    backgroundColor: strength.color,
                  }}
                />
                <span className="password-strength-text" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Citizen Account</span>
                <Icon name="arrow-right" size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in here
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

export default Register;
