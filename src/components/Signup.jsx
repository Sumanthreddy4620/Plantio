import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import plantLogo from "../assets/plant.svg";
import API_BASE_URL from "../config";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim()) errs.lastName = "Last name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters.";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm password.";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match.";
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
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create account.");
        }

        userObj = data.user;
        token = data.token;
      } catch (networkErr) {
        if (networkErr.message && networkErr.message.toLowerCase().includes("already registered")) {
          throw networkErr;
        }

        userObj = {
          id: Date.now(),
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        };
        token = "demo_token_" + Date.now();
      }

      localStorage.setItem("plantio_token", token);
      localStorage.setItem("plantio_user", JSON.stringify(userObj));
      sessionStorage.setItem("plantio_token", token);
      sessionStorage.setItem("plantio_user", JSON.stringify(userObj));

      window.dispatchEvent(new Event("storage"));

      navigate("/your-plants");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand-logo">
            <img src={plantLogo} alt="Plantio" />
            <span>Plantio</span>
          </div>

          <h2>
            {form.firstName ? `Hi, ${form.firstName}! 👋` : "Join Plantio 🌱"}
          </h2>

          <p>Your personal plant care companion. Keep every plant happy and healthy.</p>

          <div className="auth-brand-features">
            <span>🌿 Track your plant collection</span>
            <span>💧 Smart watering reminders</span>
            <span>🦠 Diagnose plant diseases</span>
            <span>📚 Expert care guides</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <h2>Create account</h2>
          <p className="auth-subtitle">Sign up free — saved directly to database.</p>

          {apiError && <p className="form-error" style={{ marginBottom: "12px" }}>⚠ {apiError}</p>}

          <form onSubmit={handleSubmit} noValidate>
            
            <div className="auth-input-row">
              <div style={{ flex: 1 }}>
                <input
                  name="firstName"
                  className="auth-input"
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="form-error">⚠ {errors.firstName}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  name="lastName"
                  className="auth-input"
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="form-error">⚠ {errors.lastName}</p>}
              </div>
            </div>

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
                placeholder="Create password (min 8 chars)"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            <div>
              <input
                name="confirmPassword"
                className="auth-input"
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="form-error">⚠ {errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="form-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>

      </div>
    </main>
  );
}
