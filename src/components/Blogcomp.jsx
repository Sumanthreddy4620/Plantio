import { useState } from "react";
import BlogGrid from "./Bloggrid";
import dataBlog from "./data-blog";

export default function Blogcomp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categoryFiltered =
    selectedCategory === "All"
      ? dataBlog
      : dataBlog.filter((post) => post.category === selectedCategory);

  const finalFiltered = categoryFiltered.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const entryElements = finalFiltered.map((entry) => (
    <BlogGrid
      key={entry.id}
      id={entry.id}
      img={entry.img}
      title={entry.title}
      text={entry.text}
    />
  ));

  const categories = [
    "All", "Plant Care", "Watering", "Diseases", "Indoor Plants", "Outdoor Plants",
  ];

  return (
    <aside>
      <div className="Blog-SlidePanel">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "active" : ""}
          >
            {category === "All" ? "All Articles" : category}
          </button>
        ))}
      </div>

      <article className="plant-grid">
        {entryElements.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">📰</span>
            <h3>No articles found</h3>
            <p>Try a different search term or browse another category.</p>
          </div>
        ) : (
          entryElements
        )}
      </article>
    </aside>
  );
}
