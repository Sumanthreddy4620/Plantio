import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const DEMO_SAMPLES = [
  {
    title: "Monstera with Mildew",
    img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
  },
  {
    title: "Healthy Sunflower",
    img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80",
  },
  {
    title: "Rose with Black Spot",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
  }
];

export default function AiBot() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  const scanMessages = [
    "Uploading photo & extracting visual features...",
    "Scanning leaf cellular structures & coloration patterns...",
    "Running AI botanical neural network classification...",
    "Analyzing pathology & generating treatment plan..."
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Please select an image file under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setResult(null);
      setError("");
      setSavedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = (sampleImg) => {
    setSelectedImage(sampleImg);
    setResult(null);
    setError("");
    setSavedSuccess(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanStep(0);
    setError("");
    setResult(null);

    // Animate scan messages
    const interval = setInterval(() => {
      setScanStep((prev) => (prev < scanMessages.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");

      clearInterval(interval);
      setIsScanning(false);
      setResult(data);
    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
      setError(err.message || "Failed to analyze image. Please try another photo.");
    }
  };

  const handleSaveToGarden = async () => {
    if (!result) return;
    const token = localStorage.getItem("plantio_token");

    const plantPayload = {
      title: result.plantName,
      text: `${result.healthStatus}: ${result.diseaseName || 'Healthy'}. ${result.summary || ''}`,
      imgUrl: selectedImage,
      wateringFrequency: "7",
      lastWatered: new Date().toISOString().split("T")[0]
    };

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/user-plants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(plantPayload)
        });
      } catch {
        // Fallback
      }
    }

    // LocalStorage fallback sync
    const saved = JSON.parse(localStorage.getItem("plantio_local_plants") || "[]");
    const newPlant = {
      id: Date.now(),
      ...plantPayload,
      userId: 1,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("plantio_local_plants", JSON.stringify([newPlant, ...saved]));

    setSavedSuccess(true);
    setTimeout(() => {
      navigate("/your-plants");
    }, 1200);
  };

  return (
    <div className="ai-bot-page">
      {/* Hero Banner */}
      <div className="FirstComp">
        <div className="FirstComp-text">
          <h4>
            <Link to="/">Plantio → </Link>
            AI Doctor
          </h4>
          <h3>Instant AI Plant & Disease Identification</h3>
          <p>
            Upload or take a photo of any plant or leaf. Our AI vision model instantly identifies the species, diagnoses diseases, and recommends treatment steps.
          </p>
        </div>

        <div className="FirstComp-search" style={{ justifyContent: "center" }}>
          <div className="ai-header-badge">
            <span style={{ fontSize: "2rem" }}>🤖⚡</span>
            <div>
              <p style={{ fontWeight: 800, color: "var(--primary-dark)", margin: 0 }}>Powered by AI Vision</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Real-time Species & Disease Pathology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ai-bot-container">
        <div className="ai-bot-layout">
          {/* Left Column: Image Upload & Controls */}
          <div className="ai-upload-card">
            <h2>📸 Step 1: Upload Plant Photo</h2>
            <p className="ai-upload-subtitle">
              Choose a clear photo of the plant or affected leaf from your device gallery or camera.
            </p>

            {selectedImage ? (
              <div className="ai-preview-wrapper">
                <img src={selectedImage} alt="Selected Plant" className="ai-preview-img" />
                {isScanning && (
                  <div className="ai-scan-overlay">
                    <div className="ai-scan-laser" />
                    <div className="ai-scan-spinner" />
                    <p className="ai-scan-msg">{scanMessages[scanStep]}</p>
                  </div>
                )}
                <button
                  className="ai-change-photo-btn"
                  onClick={() => { setSelectedImage(null); setResult(null); }}
                  disabled={isScanning}
                >
                  🔄 Change Photo
                </button>
              </div>
            ) : (
              <div className="ai-dropzone">
                <label htmlFor="ai-photo-input" className="ai-dropzone-label">
                  <span className="ai-dropzone-icon">🌿📷</span>
                  <span className="ai-dropzone-title">Select or Drag Photo Here</span>
                  <span className="ai-dropzone-desc">Supports PNG, JPG, WEBP (Max 10MB)</span>
                </label>
                <input
                  id="ai-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
              </div>
            )}

            {/* Quick Demo Samples */}
            <div className="ai-samples-section">
              <p className="ai-samples-title">Or try a sample photo:</p>
              <div className="ai-samples-grid">
                {DEMO_SAMPLES.map((sample, i) => (
                  <div
                    key={i}
                    className="ai-sample-chip"
                    onClick={() => handleSampleSelect(sample.img)}
                  >
                    <img src={sample.img} alt={sample.title} />
                    <span>{sample.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              className="ai-analyze-btn"
              onClick={handleAnalyze}
              disabled={!selectedImage || isScanning}
            >
              {isScanning ? (
                <>🔄 Analyzing Plant with AI...</>
              ) : (
                <>🔬 Identify Plant & Diagnose Disease →</>
              )}
            </button>

            {error && (
              <div className="ai-error-box">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right Column: AI Analysis Report Card */}
          <div className="ai-result-card">
            <h2>🩺 Step 2: AI Diagnosis Report</h2>

            {!result && !isScanning && (
              <div className="ai-empty-report">
                <span style={{ fontSize: "3.5rem" }}>🪴🔍</span>
                <h3>Ready to Analyze</h3>
                <p>Upload a plant photo on the left and click **Identify & Diagnose** to view species identification, disease analysis, health score, and remedies.</p>
              </div>
            )}

            {isScanning && (
              <div className="ai-loading-report">
                <div className="ai-pulse-circle">🤖</div>
                <h3>AI Vision Engine at Work...</h3>
                <p>{scanMessages[scanStep]}</p>
              </div>
            )}

            {result && !isScanning && (
              <div className="ai-report-body">
                {/* Header Badge */}
                <div className={`ai-health-banner ${result.healthStatus === "Healthy" ? "healthy" : "diseased"}`}>
                  <div className="ai-health-banner-left">
                    <span className="ai-health-icon">
                      {result.healthStatus === "Healthy" ? "💚" : "🚨"}
                    </span>
                    <div>
                      <span className="ai-health-tag">
                        {result.healthStatus === "Healthy" ? "HEALTHY PLANT" : "DISEASE DETECTED"}
                      </span>
                      <h3>{result.healthStatus === "Healthy" ? "Plant is Healthy & Thriving" : (result.diseaseName || "Plant Health Issue")}</h3>
                    </div>
                  </div>
                  <div className="ai-score-badge">
                    <span className="ai-score-val">{result.healthScore}%</span>
                    <span className="ai-score-lbl">Health Score</span>
                  </div>
                </div>

                {/* Plant Species Details */}
                <div className="ai-card-section">
                  <h4>🌿 Plant Identification</h4>
                  <div className="ai-spec-grid">
                    <div>
                      <span className="ai-spec-lbl">Common Name:</span>
                      <strong className="ai-spec-val">{result.plantName}</strong>
                    </div>
                    <div>
                      <span className="ai-spec-lbl">Scientific Name:</span>
                      <em className="ai-spec-val">{result.scientificName}</em>
                    </div>
                    <div>
                      <span className="ai-spec-lbl">AI Confidence:</span>
                      <span className="ai-confidence-pill">{result.confidence}</span>
                    </div>
                  </div>
                  {result.summary && <p className="ai-summary-text">{result.summary}</p>}
                </div>

                {/* Symptoms Breakdown */}
                {result.symptoms && result.symptoms.length > 0 && (
                  <div className="ai-card-section">
                    <h4>🔍 Observed Symptoms</h4>
                    <ul className="ai-list symptoms">
                      {result.symptoms.map((symptom, i) => (
                        <li key={i}>🔸 {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatment & Action Steps */}
                {result.treatment && result.treatment.length > 0 && (
                  <div className="ai-card-section treatment-bg">
                    <h4>💊 Recommended Treatment & Action Steps</h4>
                    <ul className="ai-list treatment">
                      {result.treatment.map((step, i) => (
                        <li key={i}>
                          <span className="ai-step-num">{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prevention Tips */}
                {result.prevention && result.prevention.length > 0 && (
                  <div className="ai-card-section">
                    <h4>🛡️ Prevention Tips</h4>
                    <ul className="ai-list prevention">
                      {result.prevention.map((tip, i) => (
                        <li key={i}>✅ {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Care Overview */}
                {result.care && (
                  <div className="ai-card-section">
                    <h4>💧 Ideal Botanical Care</h4>
                    <div className="ai-care-mini-grid">
                      <div>
                        <span>💧 Water:</span>
                        <strong>{result.care.watering}</strong>
                      </div>
                      <div>
                        <span>☀️ Sunlight:</span>
                        <strong>{result.care.sunlight}</strong>
                      </div>
                      <div>
                        <span>🪨 Soil:</span>
                        <strong>{result.care.soil}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Garden Action */}
                <div className="ai-report-footer">
                  <button
                    className="ai-save-garden-btn"
                    onClick={handleSaveToGarden}
                    disabled={savedSuccess}
                  >
                    {savedSuccess ? "✅ Added to Your Garden!" : "🌱 Save Plant to My Garden →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
