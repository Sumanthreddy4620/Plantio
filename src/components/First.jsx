import { Link } from "react-router-dom";

export default function First() {
  return (
    <main className="home">
      <div className="home-hero-container">
        
        {/* Left Hero Content */}
        <div className="home-first">
          <div className="hero-pill-badge">
            <span className="pill-sparkle">✨</span>
            <span>#1 AI Botanical & Garden Growth Platform</span>
          </div>

          <h1>Scan Plant Diseases & Track Your Garden Growth</h1>
          
          <p>
            Scan plant diseases instantly with our <strong>AI Doctor</strong>, log dated progress photo journals over time, get automated watering care reminders, and explore over 300,000+ botanical species.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <button
              type="button"
              className="hero-cta"
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("plantio_ai_doctor_ask", {
                    detail: { prompt: "Hello AI Doctor! Help me diagnose my plant and check its health." }
                  })
                );
              }}
            >
              🤖 Ask AI Doctor Scanner →
            </button>
            <Link to="/your-plants" className="hero-secondary-btn">
              My Garden Journal 🪴
            </Link>
          </div>

          {/* Quick Feature Badges */}
          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <span className="hl-icon">🤖</span>
              <span>AI Disease Scan</span>
            </div>
            <div className="hero-highlight-item">
              <span className="hl-icon">📸</span>
              <span>Growth Journal</span>
            </div>
            <div className="hero-highlight-item">
              <span className="hl-icon">💧</span>
              <span>Smart Watering</span>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="hero-stats-bar">
          <div className="hero-stat-item">
            <h4>300,000+</h4>
            <p>Live Plant Species</p>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <h4>🤖 Instant</h4>
            <p>AI Disease Scan</p>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <h4>📸 Photo</h4>
            <p>Growth Timeline</p>
          </div>
        </div>

      </div>
    </main>
  );
}
