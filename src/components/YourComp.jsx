import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import YourGrid, { getWateringStatus } from "./YourGrid";
import API_BASE_URL from "../config";

export default function YourComp() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("plantio_token") || sessionStorage.getItem("plantio_token"));
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("plantio_user") || sessionStorage.getItem("plantio_user");
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
      const t = localStorage.getItem("plantio_token") || sessionStorage.getItem("plantio_token");
      const u = localStorage.getItem("plantio_user") || sessionStorage.getItem("plantio_user");
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
    } catch (err) {
      setError(err.message || "Could not load plants from database.");
    } finally {
      setLoading(false);
    }
  }

  const [showUrlInput, setShowUrlInput] = useState(false);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        imgUrl: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim() || !token) return;

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

      if (data.plant) {
        setEntries((prev) => [data.plant, ...prev]);
        setFormData({
          title: "",
          text: "",
          imgUrl: "",
          wateringFrequency: "7",
          lastWatered: new Date().toISOString().split("T")[0],
        });
        setShowForm(false);
      }
    } catch (err) {
      alert(err.message || "Could not add plant to database.");
    }
  }

  async function handleDelete(id) {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-plants/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  async function handleWater(id) {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-plants/${id}/water`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.lastWatered) {
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, lastWatered: data.lastWatered } : e))
        );
      }
    } catch (err) {
      console.error("Watering update error:", err);
    }
  }

  // ── EDIT / MODIFY PLANT REMINDER ──
  const [editingPlant, setEditingPlant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    text: "",
    imgUrl: "",
    wateringFrequency: "7",
    lastWatered: new Date().toISOString().split("T")[0],
  });

  function startEdit(plant) {
    setEditingPlant(plant);
    setEditFormData({
      title: plant.title || "",
      text: plant.text || "",
      imgUrl: plant.imgUrl || "",
      wateringFrequency: String(plant.wateringFrequency || "7"),
      lastWatered: plant.lastWatered || new Date().toISOString().split("T")[0],
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditFormData((prev) => ({
        ...prev,
        imgUrl: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  }

  async function handleUpdateSubmit(e) {
    e.preventDefault();
    if (!editingPlant || !editFormData.title.trim() || !token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/user-plants/${editingPlant.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok && data.plant) {
        setEntries((prev) =>
          prev.map((p) => (p.id === editingPlant.id ? data.plant : p))
        );
        setEditingPlant(null);
      } else {
        throw new Error(data.error || "Failed to update plant.");
      }
    } catch (err) {
      alert(err.message || "Could not update plant in database.");
    }
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
            {/* Photo Selection from device gallery or folder */}
            <div className="form-photo-picker">
              {formData.imgUrl ? (
                <div className="photo-preview-box">
                  <img src={formData.imgUrl} alt="Plant preview" className="photo-preview-img" />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => setFormData(prev => ({ ...prev, imgUrl: "" }))}
                  >
                    🗑 Remove Photo
                  </button>
                </div>
              ) : (
                <div className="photo-dropzone">
                  <label htmlFor="plant-photo-input" className="photo-upload-label">
                    <span style={{ fontSize: "1.8rem" }}>📸</span>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--primary-dark)" }}>
                      Select Photo from Gallery or Folder
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Click to choose an image file from your device
                    </span>
                  </label>
                  <input
                    id="plant-photo-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />
                </div>
              )}

              <div style={{ textAlign: "center", margin: "6px 0 2px" }}>
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  {showUrlInput ? "Hide image URL input" : "Or paste an image URL instead"}
                </button>
              </div>

              {showUrlInput && (
                <input
                  name="imgUrl"
                  placeholder="Paste Image URL..."
                  value={formData.imgUrl}
                  onChange={handleChange}
                />
              )}
            </div>
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

      {/* Modify / Edit Plant Popup Form */}
      {editingPlant && (
        <div className="popup" onClick={(e) => e.target === e.currentTarget && setEditingPlant(null)}>
          <form onSubmit={handleUpdateSubmit} className="modal-card-form">
            {/* Modal Header */}
            <div className="modal-header-row">
              <div>
                <h3 className="modal-title">🌱 Manage Plant Details</h3>
                <p className="modal-subtitle">Update schedule, notes, or consult AI Doctor</p>
              </div>
              <button
                type="button"
                className="modal-close-icon"
                onClick={() => setEditingPlant(null)}
                title="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Field: Plant Name */}
            <div className="modal-field-group">
              <label className="modal-field-label">Plant Name *</label>
              <input
                name="title"
                placeholder="e.g. Coriander"
                value={editFormData.title}
                onChange={handleEditChange}
                required
                className="modal-input"
              />
            </div>

            {/* Field: Notes / Scientific Name */}
            <div className="modal-field-group">
              <label className="modal-field-label">Scientific Name or Notes</label>
              <input
                name="text"
                placeholder="e.g. Coriandrum sativum / Keep near sunlight"
                value={editFormData.text}
                onChange={handleEditChange}
                className="modal-input"
              />
            </div>

            {/* Photo Selection */}
            <div className="form-photo-picker">
              {editFormData.imgUrl ? (
                <div className="photo-preview-box">
                  <img src={editFormData.imgUrl} alt="Plant preview" className="photo-preview-img" />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => setEditFormData(prev => ({ ...prev, imgUrl: "" }))}
                  >
                    🗑 Change / Remove Photo
                  </button>
                </div>
              ) : (
                <div className="photo-dropzone">
                  <label htmlFor="edit-photo-input" className="photo-upload-label">
                    <span style={{ fontSize: "1.6rem" }}>📸</span>
                    <span style={{ fontWeight: 800, fontSize: "0.86rem", color: "var(--primary-dark)" }}>
                      Upload Plant Photo
                    </span>
                  </label>
                  <input
                    id="edit-photo-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleEditFileSelect}
                  />
                </div>
              )}
            </div>

            {/* 2-Column Schedule Grid */}
            <div className="modal-schedule-grid">
              <div className="modal-field-group">
                <label className="modal-field-label">Watering Frequency</label>
                <select
                  name="wateringFrequency"
                  value={editFormData.wateringFrequency}
                  onChange={handleEditChange}
                  className="modal-input"
                >
                  <option value="1">💧 Every day (1d)</option>
                  <option value="2">💧 Every 2 days</option>
                  <option value="3">💧 Every 3 days</option>
                  <option value="7">💧 Every week (7d)</option>
                  <option value="14">💧 Every 2 weeks</option>
                  <option value="30">💧 Monthly (30d)</option>
                </select>
              </div>

              <div className="modal-field-group">
                <label className="modal-field-label">Last Watered Date</label>
                <input
                  name="lastWatered"
                  type="date"
                  value={editFormData.lastWatered}
                  onChange={handleEditChange}
                  className="modal-input"
                />
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="modal-quick-actions">
              <button
                type="button"
                className="modal-water-btn"
                onClick={async () => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  await handleWater(editingPlant.id);
                  setEditFormData(prev => ({ ...prev, lastWatered: todayStr }));
                  setEditingPlant(prev => (prev ? { ...prev, lastWatered: todayStr } : null));
                }}
              >
                💧 Water Plant Now
              </button>

              <button
                type="button"
                className="modal-ask-ai-btn"
                onClick={() => {
                  const targetPlant = editingPlant;
                  setEditingPlant(null);
                  window.dispatchEvent(
                    new CustomEvent("plantio_ai_doctor_ask", {
                      detail: {
                        prompt: `Give me tailored care, sunlight, and fertilizer advice for my ${targetPlant.title}`,
                        imageUrl: targetPlant.imgUrl
                      }
                    })
                  );
                }}
              >
                ✨ Ask AI Doctor
              </button>
            </div>

            {/* Primary Submit & Secondary Delete/Cancel */}
            <div className="modal-footer-actions">
              <button type="submit" className="modal-save-btn">
                💾 Save Changes
              </button>

              <div className="modal-secondary-links">
                <button
                  type="button"
                  className="modal-cancel-link"
                  onClick={() => setEditingPlant(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-delete-link"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${editingPlant.title}?`)) {
                      handleDelete(editingPlant.id);
                      setEditingPlant(null);
                    }
                  }}
                >
                  🗑 Delete Plant
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Calculate garden health stats */}
      {(() => {
        let healthyCount = 0;
        let dueSoonCount = 0;
        let overdueCount = 0;

        entries.forEach((entry) => {
          const status = getWateringStatus(entry.lastWatered, entry.wateringFrequency);
          if (status.statusType === "overdue") overdueCount++;
          else if (status.statusType === "soon") dueSoonCount++;
          else healthyCount++;
        });

        const totalDue = overdueCount + dueSoonCount;

        const handleWaterAllDue = async () => {
          const duePlants = entries.filter((e) => {
            const status = getWateringStatus(e.lastWatered, e.wateringFrequency);
            return status.statusType === "overdue" || status.statusType === "soon";
          });

          for (const plant of duePlants) {
            await handleWater(plant.id);
          }
        };

        return (
          <>
            {/* Header Info & Stats Dashboard */}
            <div className="garden-dashboard-wrapper">
              <div className="garden-dashboard-banner">
                <div className="garden-stats-group">
                  <h2 className="garden-dashboard-title">
                    {user.firstName}'s Garden ({entries.length})
                  </h2>
                  
                  {entries.length > 0 && (
                    <div className="garden-pills-row">
                      <span className="garden-stat-pill healthy-pill">
                        🟢 {healthyCount} Healthy
                      </span>
                      {dueSoonCount > 0 && (
                        <span className="garden-stat-pill soon-pill">
                          🟡 {dueSoonCount} Water Today
                        </span>
                      )}
                      {overdueCount > 0 && (
                        <span className="garden-stat-pill overdue-pill">
                          🔴 {overdueCount} Overdue
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {totalDue > 0 && (
                  <button
                    type="button"
                    className="water-all-btn"
                    onClick={handleWaterAllDue}
                    title="Water all due plants in 1 click"
                  >
                    💧 Water All Due Plants ({totalDue})
                  </button>
                )}
              </div>
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
                    onWater={() => handleWater(entry.id)}
                    onEdit={() => startEdit(entry)}
                  />
                ))}

                {/* Add card */}
                <div className="your-add-entry" onClick={() => setShowForm(true)}>
                  <div className="Add-div" style={{ pointerEvents: "none" }}>+</div>
                  <span>Add a plant</span>
                </div>
              </article>
            )}
          </>
        );
      })()}
    </div>
  );
}
