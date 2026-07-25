import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import dataPlant from "./data-plant";
import API_BASE_URL from "../config";

const PLACEHOLDER = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80";

export default function PlantDetail() {
  const { id } = useParams();
  const isLiveId = id && id.startsWith("perenual_");

  // For local plants (numeric IDs), find immediately
  const localPlant = !isLiveId ? dataPlant.find((p) => p.id === Number(id)) : null;

  const [plant, setPlant] = useState(localPlant || null);
  const [loading, setLoading] = useState(isLiveId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLiveId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/external-plants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Plant not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPlant(data.plant);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, isLiveId]);

  if (loading) {
    return (
      <div className="plant-detail">
        <div className="detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>🌱</p>
          <h2>Loading plant details...</h2>
          <p style={{ color: "var(--text-muted)" }}>Fetching from live database</p>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="plant-detail">
        <div className="detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>🌿</p>
          <h2>Plant not found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>{error || "This plant could not be loaded."}</p>
          <Link to="/plants" className="back-btn" style={{ marginTop: "20px", display: "inline-flex" }}>
            ← Back to Plants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-detail">
      {/* Hero */}
      <div className="detail-hero">
        <img
          src={plant.img?.src || PLACEHOLDER}
          alt={plant.img?.alt || plant.title}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="detail-hero-text">
          <h1>{plant.title}</h1>
          <p>{plant.text}</p>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link> →{" "}
          <Link to="/plants">Plants</Link> →{" "}
          {plant.title}
        </div>

        {/* Badges */}
        <span className={`difficulty-badge ${plant.difficulty || "Easy"}`}>
          {plant.difficulty === "Hard" ? "🔴" : plant.difficulty === "Moderate" ? "🟡" : "🟢"}{" "}
          {plant.difficulty || "Easy"}
        </span>
        <span
          style={{
            marginLeft: "10px",
            background: "#fef3c7",
            color: "#92400e",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "0.82rem",
            fontWeight: 800,
          }}
        >
          📦 {plant.category}
        </span>

        {/* Origin country if available (Perenual plants) */}
        {plant.originCountry && (
          <span
            style={{
              marginLeft: "10px",
              background: "#ecfdf5",
              color: "#065f46",
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            🌍 {plant.originCountry}
          </span>
        )}

        {/* Description */}
        <p className="detail-desc">
          {plant.description ||
            `${plant.title} (${plant.text}) is a remarkable plant with unique characteristics. Learn how to care for it and keep it thriving.`}
        </p>

        {/* Care cards */}
        <div className="care-grid">
          <div className="care-card">
            <span className="care-icon">💧</span>
            <span className="care-label">Watering</span>
            <span className="care-value">{plant.watering || "Regular"}</span>
          </div>
          <div className="care-card">
            <span className="care-icon">☀️</span>
            <span className="care-label">Light</span>
            <span className="care-value">{plant.light || "Indirect light"}</span>
          </div>
          <div className="care-card">
            <span className="care-icon">🪨</span>
            <span className="care-label">Soil</span>
            <span className="care-value">{plant.soil || "Well-draining"}</span>
          </div>
          <div className="care-card">
            <span className="care-icon">⚠️</span>
            <span className="care-label">Toxicity</span>
            <span className="care-value">{plant.toxicity || "Check before purchase"}</span>
          </div>
          {plant.height && (
            <div className="care-card">
              <span className="care-icon">📏</span>
              <span className="care-label">Height</span>
              <span className="care-value">{plant.height}</span>
            </div>
          )}
        </div>

        {/* Add to Your Plants */}
        <div style={{ marginTop: "32px", padding: "24px", background: "var(--primary-light)", borderRadius: "16px", border: "1.5px solid var(--border)" }}>
          <h3 style={{ fontWeight: 900, marginBottom: "8px" }}>🌱 Own this plant?</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "0.95rem" }}>
            Add it to Your Plants to track watering, set reminders, and keep notes.
          </p>
          <Link to="/your-plants" className="potd-link">
            Add to My Garden →
          </Link>
        </div>

        <Link to="/plants" className="back-btn" style={{ marginTop: "32px", display: "inline-flex" }}>
          ← Back to Plants
        </Link>
      </div>
    </div>
  );
}
