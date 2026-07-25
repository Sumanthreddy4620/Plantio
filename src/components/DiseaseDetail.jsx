import { useParams, Link } from "react-router-dom";
import dataDis from "./data-prob";

const PLACEHOLDER = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80";

export default function DiseaseDetail() {
  const { id } = useParams();
  const disease = dataDis.find((d) => d.id === Number(id));

  if (!disease) {
    return (
      <div className="disease-detail">
        <div className="detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>🔍</p>
          <h2>Problem not found</h2>
          <Link to="/diseases" className="back-btn" style={{ marginTop: "20px", display: "inline-flex" }}>
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="disease-detail">
      {/* Hero */}
      <div className="detail-hero">
        <img
          src={disease.img.src}
          alt={disease.img.alt}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="detail-hero-text">
          <h1>{disease.title}</h1>
          <p>{disease.text}</p>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link> →{" "}
          <Link to="/diseases">Plant Problems</Link> →{" "}
          {disease.title}
        </div>

        {/* Badges */}
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
          {disease.category === "Pest" ? "🐛" : "🦠"} {disease.category}
        </span>

        {/* Description */}
        <p className="detail-desc">{disease.text}</p>

        {/* Symptoms */}
        <div className="detail-section">
          <h3>🔍 Symptoms</h3>
          <p>{disease.symptoms || "Look for unusual discoloration, spots, or deformation on leaves and stems. Monitor the plant closely for progressive changes."}</p>
        </div>

        {/* Treatment */}
        <div className="detail-section">
          <h3>💊 Treatment</h3>
          <p>{disease.treatment || "Isolate the affected plant immediately. Remove visibly infected parts. Apply appropriate organic or chemical treatment as needed."}</p>
        </div>

        {/* Prevention */}
        <div className="detail-section">
          <h3>🛡 Prevention</h3>
          <p>{disease.prevention || "Maintain good plant hygiene, ensure proper spacing for air circulation, and inspect plants regularly to catch problems early."}</p>
        </div>

        <Link to="/diseases" className="back-btn" style={{ marginTop: "12px", display: "inline-flex" }}>
          ← Back to Problems
        </Link>
      </div>
    </div>
  );
}
