import { useState, useEffect, useCallback, useRef } from "react";
import Grid from "./Grid";
import dataDis from "./data-prob";
import API_BASE_URL from "../config";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Discomp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [diseases, setDiseases] = useState([]);
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
    setDiseases([]);
    setPage(1);
    setHasMore(true);
    fetchDiseases(1, true);
    return () => { isMounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory]);

  const fetchDiseases = useCallback(async (pageNum, isReset = false) => {
    if (isReset) setLoading(true);
    else setLoadingMore(true);

    try {
      const queryParams = new URLSearchParams({
        page: pageNum,
        search: debouncedSearch,
        category: selectedCategory
      });
      const res = await fetch(`${API_BASE_URL}/api/external-diseases?${queryParams}`);
      if (!res.ok) throw new Error("Disease API unavailable");
      const data = await res.json();

      if (!isMounted.current) return;

      const newDiseases = data.diseases || [];
      setDiseases((prev) => isReset ? newDiseases : [...prev, ...newDiseases]);
      setTotalCount(data.total || null);
      setHasMore(pageNum < (data.lastPage || 1));
      setUsingFallback(false);
    } catch {
      if (!isMounted.current) return;
      if (isReset) {
        // Fallback to static dataDis
        const catFilter = selectedCategory === "All"
          ? dataDis
          : dataDis.filter((item) => item.category === selectedCategory);
        const filtered = catFilter.filter((item) =>
          item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setDiseases(filtered);
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
  }, [debouncedSearch, selectedCategory]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDiseases(nextPage, false);
  };

  const entryElements = diseases.map((entry) => (
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        {/* Status indicator */}
        {!loading && (
          <div>
            {usingFallback ? (
              <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.82rem" }}>
                ⚠️ Showing {diseases.length} local plant problems (API unavailable)
              </p>
            ) : totalCount !== null ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                🔬 Showing <strong>{diseases.length}</strong> of{" "}
                <strong>{totalCount.toLocaleString()}</strong> plant issues from live database
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
                <span className="empty-emoji">🔍</span>
                <h3>No results found</h3>
                <p>Try a different search or browse all problems.</p>
              </div>
            )
            : entryElements
          }
        </article>

        {/* Load More Button */}
        {!loading && !usingFallback && hasMore && diseases.length > 0 && (
          <div style={{ textAlign: "center", margin: "24px 0 12px" }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "Loading..." : "Load More Problems 🔬"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
