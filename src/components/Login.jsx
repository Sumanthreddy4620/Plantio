import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import plantLogo from "../assets/plant.svg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  }

  function validate() {
    const errs = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      let userObj = null;
      let token = null;

      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to log in.");
        }

        userObj = data.user;
        token = data.token;
      } catch (networkErr) {
        if (networkErr.message && (networkErr.message.toLowerCase().includes("invalid email") || networkErr.message.toLowerCase().includes("password"))) {
          throw networkErr;
        }

        // Fallback for Vercel / mobile deployment when localhost is unreachable
        const existingUsers = JSON.parse(localStorage.getItem("plantio_registered_users") || "[]");
        const found = existingUsers.find(
          (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
        );

        if (found) {
          userObj = { id: found.id, firstName: found.firstName, lastName: found.lastName, email: found.email };
          token = "demo_token_" + found.id;
        } else {
          // Allow login for Vercel live demo
          const namePart = form.email.split("@")[0] || "Gardener";
          const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          userObj = {
            id: Date.now(),
            firstName: formattedName,
            lastName: "",
            email: form.email,
          };
          token = "demo_token_" + Date.now();
        }
      }

      // Save token and user details
      localStorage.setItem("plantio_token", token);
      localStorage.setItem("plantio_user", JSON.stringify(userObj));

      // Dispatch window event so Header updates
      window.dispatchEvent(new Event("storage"));

      // Redirect to Your Plants page
      navigate("/your-plants");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <div className="auth-card">

        {/* ── Left green brand panel ── */}
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <img src={plantLogo} alt="Plantio" />
            <span>Plantio</span>
          </div>

          <h2>Welcome back 🌿</h2>

          <p>Sign in to track, water, and protect your plant collection.</p>

          <div className="auth-brand-features">
            <span>🌿 View your plant collection</span>
            <span>💧 Check watering schedules</span>
            <span>🦠 Browse disease guides</span>
            <span>📖 Read plant care articles</span>
          </div>
        </div>

        {/* ── Right white form panel ── */}
        <div className="auth-form-panel">
          <h2>Log in</h2>
          <p className="auth-subtitle">Good to see you again!</p>

          {apiError && <p className="form-error" style={{ marginBottom: "12px" }}>⚠ {apiError}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <input
                name="email"
                className="auth-input"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="form-error">⚠ {errors.email}</p>}
            </div>

            <div>
              <input
                name="password"
                className="auth-input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="auth-divider"><span>or</span></div>

            <p className="form-link">
              Don't have an account? <Link to="/signup">Sign up free</Link>
            </p>
          </form>
        </div>

      </div>
    </main>
  );
}
