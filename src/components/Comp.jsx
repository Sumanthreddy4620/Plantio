import { useState, useEffect, useCallback, useRef } from "react";
import Grid from "./Grid";
import dataPlant from "./data-plant";
import API_BASE_URL from "../config";

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const categories = [
  "All", "Cactuses", "Succulents", "Flowers",
  "Trees", "Grasses", "Shrubs", "Ferns",
  "Herbs", "Aquatics", "Mushrooms", "Weeds",
];

// Map our UI categories → Perenual search terms
const CATEGORY_SEARCH_MAP = {
  "Cactuses": "cactus",
  "Succulents": "succulent",
  "Flowers": "flower",
  "Trees": "tree",
  "Grasses": "grass",
  "Shrubs": "shrub",
  "Ferns": "fern",
  "Herbs": "herb",
  "Aquatics": "aquatic",
  "Mushrooms": "mushroom",
  "Weeds": "weed",
};

export default function Comp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(null);
  const debouncedSearch = useDebounce(searchText, 400);
  const isMounted = useRef(true);

  // Build the combined search query: user text + category keyword
  const buildSearchQuery = useCallback((category, userText) => {
    const categoryTerm = CATEGORY_SEARCH_MAP[category] || "";
    if (userText && categoryTerm) return `${userText} ${categoryTerm}`;
    if (userText) return userText;
    if (categoryTerm) return categoryTerm;
    return "";
  }, []);

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
      const query = buildSearchQuery(selectedCategory, debouncedSearch);
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
      const categoryParam = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : "";
      const res = await fetch(`${API_BASE_URL}/api/external-plants?page=${pageNum}${searchParam}${categoryParam}`);

      // Rate limit hit — fall back to local data gracefully
      if (res.status === 429) {
        const errData = await res.json();
        throw new Error(errData.error || "Rate limit reached");
      }

      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();

      if (!isMounted.current) return;

      const newPlants = data.plants || [];
      setPlants((prev) => isReset ? newPlants : [...prev, ...newPlants]);
      setTotalCount(data.total || null);
      setHasMore(pageNum < (data.lastPage || 1));
      setUsingFallback(false);
    } catch (err) {
      if (!isMounted.current) return;
      if (isReset) {
        // Fallback: filter local dataset by category + search
        const catFilter = selectedCategory === "All"
          ? dataPlant
          : dataPlant.filter((p) => p.category === selectedCategory);
        const filtered = catFilter.filter((p) =>
          p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setPlants(filtered);
        setTotalCount(filtered.length);
        setHasMore(false);
        setUsingFallback(true);
        setFallbackReason(err.message || "Live API unavailable");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, buildSearchQuery]);


  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlants(nextPage, false);
  };

  const entryElements = plants.map((entry) => (
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
      {/* Left sidebar — category filter */}
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

      {/* Right — plant grid container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        {/* Status line */}
        {!loading && (
          <div>
            {usingFallback ? (
              <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.82rem" }}>
                ⚠️ {fallbackReason || "Showing local plants (live API unavailable)"}
              </p>
            ) : totalCount !== null ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                🌿 Showing <strong>{plants.length}</strong> of{" "}
                <strong>{totalCount.toLocaleString()}</strong> species from live database
              </p>
            ) : null}
          </div>
        )}

        <article className="plant-grid">
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
            : entryElements
          }
        </article>

        {/* Load More Button */}
        {!loading && hasMore && (
          <div style={{ textAlign: "center", margin: "24px 0 12px" }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "Loading more species..." : "Load More Plants ↓"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
