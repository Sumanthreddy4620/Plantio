import { useState } from "react";
import Grid from "./Grid";
import dataPlant from "./data-plant";

export default function Comp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categoryFiltered =
    selectedCategory === "All"
      ? dataPlant
      : dataPlant.filter((plant) => plant.category === selectedCategory);

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
        {entryElements.length === 0 ? (
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
