import { useState, useEffect, useCallback, useRef } from "react";
import Grid from "./Grid";
import dataPlant from "./data-plant";
import API_BASE_URL from "../config";

// Debounce hook — delays the value until user stops typing
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const categories = [
  "All", "Houseplants", "Cactuses", "Succulents", "Flowers",
  "Trees", "Veggies & Fruit", "Grasses", "Shrubs", "Ferns",
  "Herbs", "Foliage", "Aquatics", "Mushrooms", "Weeds",
];

export default function Comp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(null);
  const debouncedSearch = useDebounce(searchText, 400);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setPlants([]);
    setPage(1);
    setHasMore(true);
    fetchPlants(1, true);
    return () => { isMounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory]);

  const fetchPlants = useCallback(async (pageNum, isReset = false) => {
    if (isReset) setLoading(true);
    else setLoadingMore(true);

    try {
      const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : "";
      const res = await fetch(`${API_BASE_URL}/api/external-plants?page=${pageNum}${searchParam}`);
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();

      if (!isMounted.current) return;

      const newPlants = data.plants || [];
      setPlants((prev) => isReset ? newPlants : [...prev, ...newPlants]);
      setTotalCount(data.total || null);
      setHasMore(pageNum < (data.lastPage || 1));
      setUsingFallback(false);
    } catch {
      if (!isMounted.current) return;
      if (isReset) {
        const filtered = dataPlant.filter((p) =>
          p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setPlants(filtered);
        setTotalCount(filtered.length);
        setHasMore(false);
        setUsingFallback(true);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlants(nextPage, false);
  };

  // Client-side category filter for Perenual's cycle field
  const displayPlants = selectedCategory === "All"
    ? plants
    : plants.filter((p) =>
        (p.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const entryElements = displayPlants.map((entry) => (
    <Grid
      key={entry.id}
      id={entry.id}
      img={entry.img}
      title={entry.title}
      text={entry.text}
      category={entry.category}
    />
  ));

  return (
    <aside>
      {/* Left sidebar — category filter (original design) */}
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

      {/* Right — plant grid */}
      <article className="plant-grid">
        {/* Status line */}
        {!loading && (
          <div style={{ width: "100%", marginBottom: "4px" }}>
            {usingFallback ? (
              <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.82rem" }}>
                ⚠️ Showing {plants.length} local plants (live API unavailable)
              </p>
            ) : totalCount !== null ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                🌿 Showing <strong>{displayPlants.length}</strong> of{" "}
                <strong>{totalCount.toLocaleString()}</strong> species from live database
              </p>
            ) : null}
          </div>
        )}

        {/* Loading skeletons */}
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="plant-skeleton" aria-hidden="true" />
            ))
          : entryElements.length === 0
          ? (
            <div className="empty-state">
              <span className="empty-emoji">🌵</span>
              <h3>No plants found</h3>
              <p>Try a different search term or browse another category.</p>
            </div>
          )
          : entryElements}

        {/* Load More — full width row at bottom of grid */}
        {!loading && !usingFallback && hasMore && displayPlants.length > 0 && (
          <div style={{ width: "100%", textAlign: "center", paddingTop: "16px" }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "Loading..." : "Load More Plants 🌱"}
            </button>
          </div>
        )}
      </article>
    </aside>
  );
}
