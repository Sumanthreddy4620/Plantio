import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import YourGrid from "./YourGrid";
import API_BASE_URL from "../config";

export default function YourComp() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("plantio_token"));
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("plantio_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    title: "",
    text: "",
    imgUrl: "",
    wateringFrequency: "7",
    lastWatered: new Date().toISOString().split("T")[0],
  });

  // Re-check token/user on storage event
  useEffect(() => {
    const syncAuth = () => {
      const t = localStorage.getItem("plantio_token");
      const u = localStorage.getItem("plantio_user");
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Fetch plants from Database API when logged in
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchPlants();
  }, [token]);

  async function fetchPlants() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-plants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load plants.");
      setEntries(data.plants || []);
    } catch {
      // Fallback for Vercel / mobile deployment
      const saved = JSON.parse(localStorage.getItem("plantio_local_plants") || "[]");
      setEntries(saved);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim() || !token) return;

    let newPlant = null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add plant.");
      newPlant = data.plant;
    } catch {
      // Fallback for Vercel / mobile deployment
      newPlant = {
        id: Date.now(),
        ...formData,
        userId: user?.id || 1,
        createdAt: new Date().toISOString()
      };
      const saved = JSON.parse(localStorage.getItem("plantio_local_plants") || "[]");
      const updated = [newPlant, ...saved];
      localStorage.setItem("plantio_local_plants", JSON.stringify(updated));
    }

    if (newPlant) {
      setEntries((prev) => [newPlant, ...prev]);
      setFormData({
        title: "",
        text: "",
        imgUrl: "",
        wateringFrequency: "7",
        lastWatered: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
    }
  }

  async function handleDelete(id) {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/user-plants/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Fallback for Vercel / mobile deployment
    }
    const saved = JSON.parse(localStorage.getItem("plantio_local_plants") || "[]");
    const updated = saved.filter((e) => e.id !== id);
    localStorage.setItem("plantio_local_plants", JSON.stringify(updated));
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  async function handleWater(id) {
    if (!token) return;
    const today = new Date().toISOString().split("T")[0];
    try {
      await fetch(`${API_BASE_URL}/api/user-plants/${id}/water`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Fallback for Vercel / mobile deployment
    }
    const saved = JSON.parse(localStorage.getItem("plantio_local_plants") || "[]");
    const updated = saved.map((e) => e.id === id ? { ...e, lastWatered: today } : e);
    localStorage.setItem("plantio_local_plants", JSON.stringify(updated));
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, lastWatered: today } : e))
    );
  }

  // If user is not logged in, prompt to log in / sign up
  if (!token || !user) {
    return (
      <div className="yourcomp-main" style={{ padding: "80px 24px 100px", textAlign: "center", alignItems: "center" }}>
        <div style={{
          background: "white",
          border: "1.5px solid var(--border)",
          borderRadius: "24px",
          padding: "48px 36px",
          maxWidth: "480px",
          boxShadow: "var(--shadow-lg)"
        }}>
          <p style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🪴</p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "12px", color: "var(--text)" }}>
            Welcome to Your Garden
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: 1.6, marginBottom: "28px" }}>
            Please log in or create an account to save your plant collection and watering history directly to the database.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/login" className="potd-link">
              Log In
            </Link>
            <Link to="/signup" className="nav-login-btn" style={{ textDecoration: "none", borderRadius: "10px", padding: "10px 22px" }}>
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="yourcomp-main">
      {/* Floating add button */}
      <button className="Add-btn" onClick={() => setShowForm(true)} title="Add a plant to database">
        +
      </button>

      {/* Popup form */}
      {showForm && (
        <div className="popup" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <form onSubmit={handleSubmit}>
            <h3>🌱 Add Plant to Database</h3>

            <input
              name="title"
              placeholder="Plant name *"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="text"
              placeholder="Description or notes"
              value={formData.text}
              onChange={handleChange}
            />
            <input
              name="imgUrl"
              placeholder="Image URL (optional)"
              value={formData.imgUrl}
              onChange={handleChange}
            />
            <select
              name="wateringFrequency"
              value={formData.wateringFrequency}
              onChange={handleChange}
            >
              <option value="1">💧 Water every day</option>
              <option value="2">💧 Every 2 days</option>
              <option value="3">💧 Every 3 days</option>
              <option value="7">💧 Every week</option>
              <option value="14">💧 Every 2 weeks</option>
              <option value="30">💧 Every month</option>
            </select>
            <input
              name="lastWatered"
              type="date"
              value={formData.lastWatered}
              onChange={handleChange}
              title="Last watered date"
            />

            <div className="popup-actions">
              <button type="submit" className="submit-btn">Save to DB</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header Info */}
      <div style={{ padding: "24px 24px 0", maxWidth: "1200px", width: "100%" }}>
        <p className="SlidePanel-your">
          {user.firstName}'s Plants ({entries.length})
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", fontWeight: 700 }}>
          🔄 Loading your garden from database...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#dc2626", fontWeight: 700 }}>
          ⚠ {error}
        </div>
      ) : (
        <article className="plant-grid" style={{ padding: "0 24px 48px" }}>
          {entries.map((entry) => (
            <YourGrid
              key={entry.id}
              entry={entry}
              onDelete={() => handleDelete(entry.id)}
              onWater={() => handleWater(entry.id)}
            />
          ))}

          {/* Add card */}
          <div className="your-add-entry" onClick={() => setShowForm(true)}>
            <div className="Add-div" style={{ pointerEvents: "none" }}>+</div>
            <span>Add a plant</span>
          </div>
        </article>
      )}
    </div>
  );
}
