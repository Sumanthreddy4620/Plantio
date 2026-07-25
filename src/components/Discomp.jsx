import { useState } from "react";
import Grid from "./Grid";
import dataDis from "./data-prob";

export default function Discomp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categoryFiltered =
    selectedCategory === "All"
      ? dataDis
      : dataDis.filter((item) => item.category === selectedCategory);

  const finalFilteredData = categoryFiltered.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const entryElements = finalFilteredData.map((entry) => (
    <Grid
      key={entry.id}
      id={entry.id}
      img={entry.img}
      title={entry.title}
      text={entry.text}
      category={entry.category}
      detailPath="/diseases"
    />
  ));

  return (
    <aside>
      <div className="SlidePanel-Dis">
        {["All", "Disease", "Pest"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "active" : ""}
          >
            {cat === "All" ? "All Problems" : cat === "Disease" ? "🦠 Diseases" : "🐛 Pests"}
          </button>
        ))}
      </div>

      <article className="plant-grid">
        {entryElements.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <h3>No results found</h3>
            <p>Try a different search or browse all problems.</p>
          </div>
        ) : (
          entryElements
        )}
      </article>
    </aside>
  );
}
