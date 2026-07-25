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

  // Reset and fetch from page 1 whenever search or category changes
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

      if (isReset) {
        setPlants(newPlants);
      } else {
        setPlants((prev) => [...prev, ...newPlants]);
      }

      setTotalCount(data.total || null);
      setHasMore(pageNum < (data.lastPage || 1));
      setUsingFallback(false);
    } catch {
      if (!isMounted.current) return;
      // Fallback to local data
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

  // Client-side category filter (Perenual's API returns cycle, so we map locally for category pill)
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
      {/* Category Filter Bar */}
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

      {/* Status Bar */}
      {!loading && (
        <div style={{
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          marginBottom: "4px"
        }}>
          {usingFallback ? (
            <span style={{ color: "#f59e0b", fontWeight: 600 }}>
              ⚠️ Showing {plants.length} local plants (API unavailable)
            </span>
          ) : totalCount !== null ? (
            <span>
              🌿 Showing <strong>{displayPlants.length}</strong> of <strong>{totalCount.toLocaleString()}</strong> species from live database
            </span>
          ) : null}
        </div>
      )}

      {/* Plant Grid */}
      <article className="plant-grid">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="plant-skeleton" aria-hidden="true" />
          ))
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

      {/* Load More Button */}
      {!loading && !usingFallback && hasMore && displayPlants.length > 0 && (
        <div style={{ textAlign: "center", padding: "32px 0 16px" }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              padding: "12px 36px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: loadingMore ? "not-allowed" : "pointer",
              opacity: loadingMore ? 0.7 : 1,
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
            }}
          >
            {loadingMore ? "Loading..." : "Load More Plants 🌱"}
          </button>
        </div>
      )}
    </aside>
  );
}
