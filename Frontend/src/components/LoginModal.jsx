import React, { useState } from "react";
import { BookOpen, X, Loader2 } from "lucide-react";
import { signup, login } from "../api";

export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const submit = async (e) => {
  e.preventDefault();

  console.log("LOGIN BUTTON CLICKED");

  setError("");
  setLoading(true);

  try {
    console.log("CALLING LOGIN API");

    const user =
      mode === "login"
        ? await login({ email, password })
        : await signup({ name, email, password });

    console.log("BACKEND RETURNED =", user);

    onLogin(user);
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    // Full page redirect to your Spring Boot backend, which then
    // redirects to Google. This is NOT a fetch() call -- OAuth2
    // login has to happen as a real browser navigation, since Google
    // needs to show its own login page.
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-brand">
              <BookOpen size={20} color="#5B6B2E" />
              <span>Digital Library</span>
            </div>
            <h2 className="modal-title">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="modal-subtitle">
              {mode === "login"
                ? "Log in to borrow books and track your reading."
                : "Sign up to start borrowing books today."}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={submit} className="modal-form">
          {mode === "signup" && (
            <label className="modal-label">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="modal-input"
              />
            </label>
          )}
          <label className="modal-label">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="modal-input"
            />
          </label>
          <label className="modal-label">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="modal-input"
            />
          </label>

          {mode === "login" && (
            <div className="modal-forgot">
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="modal-submit" disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="spin" />
            ) : mode === "login" ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="modal-divider">
          <span>or</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin} type="button">
          Continue with Google
        </button>

        <p className="modal-switch">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
