import { Link } from "react-router-dom";
import plantLogo from "../assets/plant.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <img src={plantLogo} alt="Plantio Logo" />
            <span>Plantio</span>
          </div>
          <p className="footer-tagline">
            Your personal plant care companion. Keep every plant happy and healthy.
          </p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/plants">Plants Library</Link>
          <Link to="/diseases">Plant Problems</Link>
          <Link to="/blog">Blog & Guides</Link>
          <Link to="/your-plants">Your Plants</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Log In</Link>
        </div>

        <div className="footer-col">
          <h4>Care Tips</h4>
          <Link to="/blog">Watering Guides</Link>
          <Link to="/blog">Indoor Plants</Link>
          <Link to="/diseases">Disease Diagnosis</Link>
          <Link to="/blog">Outdoor Plants</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Plantio. All rights reserved. Made with 🌿 for plant lovers.</p>
        {/* <div className="footer-social">
          <a href="#" aria-label="Twitter">𝕏</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="Facebook">f</a>
        </div> */}
      </div>
    </footer>
  );
}
