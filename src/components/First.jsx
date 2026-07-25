import { Link } from "react-router-dom";

export default function First() {
  return (
    <main className="home">
      <div className="home-hero-container">
        
        {/* Left Hero Content */}
        <div className="home-first">
          <div className="hero-pill-badge">
            <span className="pill-sparkle">✨</span>
            <span>#1 Live Botanical & Plant Care Guide</span>
          </div>

          <h1>Keep Every Plant Alive & Thriving</h1>
          
          <p>
            Explore over 300,000+ live plant species, diagnose 740+ pests & fungal diseases in real time, and get smart watering schedules for your personal garden.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <Link to="/plants" className="hero-cta">
              Explore Plants Library →
            </Link>
            <Link to="/your-plants" className="hero-secondary-btn">
              My Garden 🪴
            </Link>
          </div>

          {/* Quick Feature Badges */}
          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <span className="hl-icon">💧</span>
              <span>Smart Watering</span>
            </div>
            <div className="hero-highlight-item">
              <span className="hl-icon">☀️</span>
              <span>Light Guide</span>
            </div>
            <div className="hero-highlight-item">
              <span className="hl-icon">🦠</span>
              <span>Disease Fixes</span>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="hero-stats-bar">
          <div className="hero-stat-item">
            <h4>300,000+</h4>
            <p>Live Species</p>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <h4>740+</h4>
            <p>Disease & Pest Fixes</p>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <h4>4.9 ★★★★★</h4>
            <p>Plant Parent Rating</p>
          </div>
        </div>

      </div>
    </main>
  );
}
