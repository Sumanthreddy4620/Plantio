import { useState, useEffect } from "react";
import Grid from "./Grid";
import dataPlant from "./data-plant";
import API_BASE_URL from "../config";

export default function Comp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [useLiveApi, setUseLiveApi] = useState(false);
  const [livePlants, setLivePlants] = useState([]);
  const [loadingLive, setLoadingLive] = useState(false);

  useEffect(() => {
    if (useLiveApi && livePlants.length === 0) {
      setLoadingLive(true);
      fetch(`${API_BASE_URL}/api/external-plants?page=1`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.plants)) {
            setLivePlants(data.plants);
          }
        })
        .catch((err) => console.error("Error fetching live plants:", err))
        .finally(() => setLoadingLive(false));
    }
  }, [useLiveApi, livePlants.length]);

  const activeDataset = useLiveApi ? livePlants : dataPlant;

  const categoryFiltered =
    selectedCategory === "All"
      ? activeDataset
      : activeDataset.filter((plant) => plant.category === selectedCategory);

  const finalFilteredPlants = categoryFiltered.filter((plant) =>
    plant.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const entryElements = finalFilteredPlants.map((entry) => (
    <Grid
      key={entry.id}
      id={entry.id}
      img={entry.img}
      title={entry.title}
      text={entry.text}
      category={entry.category}
    />
  ));

  const categories = [
    "All", "Houseplants", "Cactuses", "Succulents", "Flowers",
    "Trees", "Veggies & Fruit", "Grasses", "Shrubs", "Ferns",
    "Herbs", "Foliage", "Aquatics", "Mushrooms", "Weeds",
  ];

  return (
    <aside>
      <div className="SlidePanel">
        <button
          onClick={() => setUseLiveApi(!useLiveApi)}
          style={{
            background: useLiveApi ? "var(--primary)" : "var(--surface)",
            color: useLiveApi ? "#fff" : "var(--primary)",
            border: "1.5px solid var(--primary)",
            fontWeight: "700"
          }}
        >
          {useLiveApi ? "🌐 Perenual Live API (Active)" : "✨ Switch to Perenual Live API (10,000+)"}
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "active" : ""}
          >
            {category === "All" ? "All Plants" : category}
          </button>
        ))}
      </div>

      <article className="plant-grid">
        {loadingLive ? (
          <div className="empty-state">
            <span className="empty-emoji">🌱</span>
            <h3>Fetching 10,000+ Species from Perenual API...</h3>
            <p>Connecting to live botanical database...</p>
          </div>
        ) : entryElements.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🌵</span>
            <h3>No plants found</h3>
            <p>Try a different search term or browse another category.</p>
          </div>
        ) : (
          entryElements
        )}
      </article>
    </aside>
  );
}
