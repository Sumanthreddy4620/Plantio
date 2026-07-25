import { Link } from "react-router-dom";

export default function Homegrid() {
  return (
    <main className="home-grid">
      <div className="home-second-frame1">
        
        {/* Frame 1: Light Analysis */}
        <div className="frame1">
          <div className="feature-card-wrapper light-meter-card">
            <div className="card-badge">☀️ Light Analysis</div>
            <img 
              className="home-image1"
              src="https://getplanta.com/_app/immutable/assets/light_meter.BwXMOkkv.avif"
              alt="Light Meter feature"
            />
            <h3 className="home-name">Sunlight & Exposure Guide</h3>
            <p className="home-name-info">
              Unsure if a plant belongs in indirect light or full sun? Discover exact lighting requirements for over 300,000+ species.
            </p>
            <Link to="/plants" className="card-action-link">
              Explore Light Needs →
            </Link>
          </div>
        </div>

        {/* Frame 2: Intelligent Watering */}
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
              Keep your plants hydrated with one-click watering logs, custom frequency intervals, and cloud-synced Garden records.
            </p>
            <Link to="/your-plants" className="card-action-link light-link">
              Set Up Tracker →
            </Link>
          </div>
        </div> 

      </div>

      <div className="home-second-frame2">
        
        {/* Frame 3: Garden Journal */}
        <div className="frame3">
          <div className="feature-card-wrapper journal-card">
            <div className="card-badge">📓 Garden Journal</div>
            <img 
              className="home-image2"
              src="https://getplanta.com/_app/immutable/assets/plant_organization.CSuB463u.avif"
              alt="Plant organization & journal"
            />
            <h3 className="home-name">Personal Garden Manager</h3>
            <p className="home-name-info">
              Manage your green collection across devices. Sync added plants live between your mobile phone and laptop.
            </p>
            <Link to="/your-plants" className="card-action-link">
              View Your Garden →
            </Link>
          </div>
        </div>

        {/* Frame 4: Disease & Pest Identification */}
        <div className="frame4">
          <div className="feature-card-wrapper disease-card">
            <div className="card-badge">🦠 Health & Fixes</div>
            <img 
              className="home-image1"
              src="https://getplanta.com/_app/immutable/assets/plant_identification.D4UFhiuT.avif"
              alt="Plant Health & Disease identification"
            />
            <h3 className="home-name">740+ Disease & Pest Solutions</h3>
            <p className="home-name-info">
              Yellow leaves or strange spots? Search fungal diseases, root rot, aphids, and mites with step-by-step organic remedies.
            </p>
            <Link to="/diseases" className="card-action-link">
              Diagnose Problems →
            </Link>
          </div>
        </div> 

      </div>
    </main>
  );
}