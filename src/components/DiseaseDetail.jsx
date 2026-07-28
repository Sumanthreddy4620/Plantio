import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import dataDis from "./data-prob";
import API_BASE_URL from "../config";

const PLACEHOLDER = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80";

export default function DiseaseDetail() {
  const { id } = useParams();
  const isLiveId = id && String(id).startsWith("dis_");

  const localDisease = !isLiveId ? dataDis.find((d) => d.id === Number(id)) : null;

  const [disease, setDisease] = useState(localDisease || null);
  const [loading, setLoading] = useState(isLiveId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLiveId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/external-diseases/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Problem detail not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setDisease(data.disease);
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
      <div className="disease-detail">
        <div className="detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>🔬</p>
          <h2>Loading problem details...</h2>
          <p style={{ color: "var(--text-muted)" }}>Connecting to live database</p>
        </div>
      </div>
    );
  }

  if (error || !disease) {
    return (
      <div className="disease-detail">
        <div className="detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>🔍</p>
          <h2>Problem not found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>{error || "This issue could not be loaded."}</p>
          <Link to="/diseases" className="back-btn" style={{ marginTop: "20px", display: "inline-flex" }}>
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="disease-detail">
      
      <div className="detail-hero">
        <img
          src={disease.img?.src || PLACEHOLDER}
          alt={disease.img?.alt || disease.title}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="detail-hero-text">
          <h1>{disease.title}</h1>
          <p>{disease.text}</p>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link> →{" "}
          <Link to="/diseases">Plant Problems</Link> →{" "}
          {disease.title}
        </div>

        <span className={`severity-badge ${disease.severity || "Medium"}`}>
          {disease.severity === "High" ? "🔴" : disease.severity === "Low" ? "🟢" : "🟡"}{" "}
          {disease.severity || "Medium"} Severity
        </span>
        <span
          style={{
            marginLeft: "10px",
            background: disease.category === "Pest" ? "#fef3c7" : "#fee2e2",
            color: disease.category === "Pest" ? "#92400e" : "#991b1b",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "0.82rem",
            fontWeight: 800,
          }}
        >
          {disease.category === "Pest" ? "🐛" : "🦠"} {disease.category || "Disease"}
        </span>

        <p className="detail-desc">{disease.text ? String(disease.text).replace(/<[^>]*>/g, '') : ""}</p>

        <div className="detail-section">
          <h3>🔍 Symptoms</h3>
          <p>{disease.symptoms ? String(disease.symptoms).replace(/<[^>]*>/g, '') : "Look for unusual discoloration, spots, or deformation on leaves and stems. Monitor the plant closely for progressive changes."}</p>
        </div>

        <div className="detail-section">
          <h3>💊 Treatment</h3>
          <p>{disease.treatment ? String(disease.treatment).replace(/<[^>]*>/g, '') : "Isolate the affected plant immediately. Remove visibly infected parts. Apply appropriate organic or chemical treatment as needed."}</p>
        </div>

        <div className="detail-section">
          <h3>🛡 Prevention</h3>
          <p>{disease.prevention ? String(disease.prevention).replace(/<[^>]*>/g, '') : "Maintain good plant hygiene, ensure proper spacing for air circulation, and inspect plants regularly to catch problems early."}</p>
        </div>

        {disease.wikipediaUrl && (
          <div style={{ marginTop: "24px" }}>
            <a
              href={disease.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              📖 Read complete scientific entry on Wikipedia →
            </a>
          </div>
        )}

        <Link to="/diseases" className="back-btn" style={{ marginTop: "24px", display: "inline-flex" }}>
          ← Back to Problems
        </Link>
      </div>
    </div>
  );
}
 