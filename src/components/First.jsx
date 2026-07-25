import { Link } from "react-router-dom";

export default function First() {
  return (
    <main className="home">
      <div className="home-hero-container">
        
        {/* Left Hero Content */}
        <div className="home-first">
          <div className="hero-pill-badge">
            <span className="pill-sparkle">✨</span>
            <span>#1 Plant Care & Botanical Guide</span>
          </div>

          <h1>Keep Every Plant Alive & Thriving</h1>
          
          <p>
            Personalized care schedules, smart watering reminders, step-by-step growing guides, and disease diagnosis for over 30,000+ plant species.
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
              <span>Light Meter</span>
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
            <h4>30,000+</h4>
            <p>Plants Tracked</p>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <h4>99.4%</h4>
            <p>Care Accuracy</p>
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
