import { Link } from "react-router-dom";
import dataPlant from "./data-plant";

export default function PlantOfDay() {
  // Changes daily based on date — deterministic, no flicker
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const plant = dataPlant[seed % dataPlant.length];

  return (
    <div className="potd-section">
      <div className="potd-card">
        <img src={plant.img.src} alt={plant.img.alt} />
        <div className="potd-info">
          <span className="potd-badge">🌿 Plant of the Day</span>
          <h2>{plant.title}</h2>
          <p className="potd-sci">{plant.text}</p>
          <p>
            {plant.description ||
              "Discover this amazing plant and learn all about its care requirements, origin, and interesting facts."}
          </p>
          <Link to={`/plants/${plant.id}`} className="potd-link">
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}
