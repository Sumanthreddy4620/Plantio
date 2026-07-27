import { Link } from "react-router-dom";

export default function Homegrid() {
  const handleOpenAIDoctor = () => {
    window.dispatchEvent(
      new CustomEvent("plantio_ai_doctor_ask", {
        detail: { prompt: "Hello AI Doctor! Help me identify my plant and check for any diseases." }
      })
    );
  };

  return (
    <main className="home-grid">
      <div className="home-second-frame1">
        
        <div className="frame1">
          <div className="feature-card-wrapper light-meter-card">
            <div className="card-badge">🤖 AI Vision Scanner</div>
            <img 
              className="home-image1"
              src="https://getplanta.com/_app/immutable/assets/plant_identification.D4UFhiuT.avif"
              alt="AI Doctor & Disease identification"
            />
            <h3 className="home-name">AI Doctor & Instant Scanner</h3>
            <p className="home-name-info">
              Upload or snap a photo of any leaf to instantly identify 740+ plant diseases, pests, and get tailored organic treatments!
            </p>
            <button
              type="button"
              className="card-action-link"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              onClick={handleOpenAIDoctor}
            >
              Diagnose with AI Doctor →
            </button>
          </div>
        </div>

        <div className="frame2">
          <div className="feature-card-wrapper watering-card">
            <div className="card-badge dark-badge">💧 Smart Schedule</div>
            <img 
              className="home-image2"
              src="https://getplanta.com/_app/immutable/assets/Intelligent_water_reminders_large.CMYw5WYw.avif"
              alt="Intelligent watering reminders"
            />
            <h3 className="home-name" style={{ color: "#e0ffc2" }}>Intelligent Water Tracker</h3>
            <p className="home-name-info" style={{ color: "rgba(224, 255, 194, 0.88)" }}>
              Keep your plants hydrated with automated daily, weekly, or custom care intervals, 1-click batch watering, and health badges.
            </p>
            <Link to="/your-plants" className="card-action-link light-link">
              Open Water Tracker →
            </Link>
          </div>
        </div> 

      </div>

      <div className="home-second-frame2">
        
        <div className="frame3">
          <div className="feature-card-wrapper journal-card">
            <div className="card-badge">📸 Photo Timeline</div>
            <img 
              className="home-image2"
              src="https://getplanta.com/_app/immutable/assets/plant_organization.CSuB463u.avif"
              alt="Plant Growth Journal & Progress Photos"
            />
            <h3 className="home-name">Plant Growth Journal & Photos</h3>
            <p className="home-name-info">
              Track your plant's growth over time! Save dated progress photo logs (Month 1, Month 3, Month 6) and milestones in your cloud garden.
            </p>
            <Link to="/your-plants" className="card-action-link">
              Track Growth Journey →
            </Link>
          </div>
        </div>

        <div className="frame4">
          <div className="feature-card-wrapper disease-card">
            <div className="card-badge">🌿 Botanical Library</div>
            <img 
              className="home-image1"
              src="https://getplanta.com/_app/immutable/assets/light_meter.BwXMOkkv.avif"
              alt="300,000+ Plant & Disease Library"
            />
            <h3 className="home-name">300,000+ Plant & Disease Library</h3>
            <p className="home-name-info">
              Search over 300,000+ verified plant species, step-by-step disease cures, organic pest control solutions, sunlight rules, and expert botanical care guides for your garden.
            </p>
            <Link to="/plants" className="card-action-link">
              Explore Botanical Library →
            </Link>
          </div>
        </div> 

      </div>
    </main>
  );
}