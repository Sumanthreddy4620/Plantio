import { Link } from "react-router-dom";

export default function Homegrid() {
  return (
    <main className="home-grid">
      <div className="home-second-frame1">
        
        {/* Frame 1: Light Meter */}
        <div className="frame1">
          <div className="feature-card-wrapper light-meter-card">
            <div className="card-badge">☀️ Light Analysis</div>
            <img 
              className="home-image1"
              src="https://getplanta.com/_app/immutable/assets/light_meter.BwXMOkkv.avif"
              alt="Light Meter feature"
            />
            <h3 className="home-name">Light Meter & Sunlight Guide</h3>
            <p className="home-name-info">
              Unsure if a plant belongs in a dark bathroom or a sun-drenched windowsill? Get exact light requirements based on your room's orientation.
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
            <h3 className="home-name" style={{ color: "#e0ffc2" }}>Intelligent Watering Reminders</h3>
            <p className="home-name-info" style={{ color: "rgba(224, 255, 194, 0.88)" }}>
              Our smart algorithm evaluates pot size, soil type, and weather conditions to notify you when it's the exact right time to water.
            </p>
            <Link to="/your-plants" className="card-action-link light-link">
              Set Up Reminders →
            </Link>
          </div>
        </div> 

      </div>

      <div className="home-second-frame2">
        
        {/* Frame 3: Organization & Journal */}
        <div className="frame3">
          <div className="feature-card-wrapper journal-card">
            <div className="card-badge">📓 Garden Journal</div>
            <img 
              className="home-image2"
              src="https://getplanta.com/_app/immutable/assets/plant_organization.CSuB463u.avif"
              alt="Plant organization & journal"
            />
            <h3 className="home-name">Plant Organization & Journal</h3>
            <p className="home-name-info">
              Keep your entire green collection under control. Track growth milestones, watering history, and repotting dates in one place.
            </p>
            <Link to="/your-plants" className="card-action-link">
              View Your Garden →
            </Link>
          </div>
        </div>

        {/* Frame 4: Disease Diagnosis */}
        <div className="frame4">
          <div className="feature-card-wrapper disease-card">
            <div className="card-badge">🦠 Health & Treatments</div>
            <img 
              className="home-image1"
              src="https://getplanta.com/_app/immutable/assets/plant_identification.D4UFhiuT.avif"
              alt="Plant Health & Disease identification"
            />
            <h3 className="home-name">Disease & Pest Identification</h3>
            <p className="home-name-info">
              Yellow leaves or strange spots? Identify fungal infections, root rot, and pest infestations with step-by-step treatment solutions.
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