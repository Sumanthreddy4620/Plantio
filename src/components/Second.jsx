import { Link } from "react-router-dom";
import Homegrid from "./Homegrid";
import PlantOfDay from "./PlantOfDay";

const QUICK_CATEGORIES = [
  { name: "Flowers", icon: "🌸", path: "/plants" },
  { name: "Trees", icon: "🌲", path: "/plants" },
  { name: "Succulents & Cacti", icon: "🌵", path: "/plants" },
  { name: "Plant Problems", icon: "🦠", path: "/diseases" },
  { name: "Botanical Guides", icon: "📚", path: "/blog" },
];

export default function Second() {
  return (
    <main className="home-second">

      <div className="home-quick-categories">
        {QUICK_CATEGORIES.map((cat, i) => (
          <Link key={i} to={cat.path} className="quick-cat-item">
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      <div className="home-section-header">
        <span className="section-pill">🌿 Plantio Ecosystem</span>
        <h1>Green tools for green thumbs</h1>
        <p>Everything you need to nurture, diagnose, and grow your plants with confidence.</p>
      </div>

      <PlantOfDay />

      <Homegrid />
    </main>
  );
}
 