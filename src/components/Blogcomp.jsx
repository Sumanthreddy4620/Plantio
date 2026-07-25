import { useState, useEffect, useCallback, useRef } from "react";
import BlogGrid from "./Bloggrid";
import dataBlog from "./data-blog";
import API_BASE_URL from "../config";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const categories = [
  "All", "Plant Care", "Watering", "Diseases", "Indoor Plants", "Outdoor Plants",
];

export default function Blogcomp({ searchText }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
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
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    fetchBlogs(1, true);
    return () => { isMounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory]);

  const fetchBlogs = useCallback(async (pageNum, isReset = false) => {
    if (isReset) setLoading(true);
    else setLoadingMore(true);

    try {
      const queryParams = new URLSearchParams({
        page: pageNum,
        search: debouncedSearch,
        category: selectedCategory
      });
      const res = await fetch(`${API_BASE_URL}/api/external-blogs?${queryParams}`);
      if (!res.ok) throw new Error("Blog API unavailable");
      const data = await res.json();

      if (!isMounted.current) return;

      const newBlogs = data.blogs || [];
      setBlogs((prev) => isReset ? newBlogs : [...prev, ...newBlogs]);
      setTotalCount(data.total || null);
      setHasMore(pageNum < (data.lastPage || 1));
      setUsingFallback(false);
    } catch {
      if (!isMounted.current) return;
      if (isReset) {
        // Fallback to static dataBlog
        const catFilter = selectedCategory === "All"
          ? dataBlog
          : dataBlog.filter((post) => post.category === selectedCategory);
        const filtered = catFilter.filter((post) =>
          post.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setBlogs(filtered);
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
    fetchBlogs(nextPage, false);
  };

  const entryElements = blogs.map((entry) => (
    <BlogGrid
      key={entry.id}
      id={entry.id}
      img={entry.img}
      title={entry.title}
      text={entry.text}
    />
  ));

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
        {/* Status bar */}
        {!loading && (
          <div style={{ width: "100%", marginBottom: "4px" }}>
            {usingFallback ? (
              <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.82rem" }}>
                ⚠️ Showing {blogs.length} local articles (API unavailable)
              </p>
            ) : totalCount !== null ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                📰 Showing <strong>{blogs.length}</strong> botanical guides & articles from live database
              </p>
            ) : null}
          </div>
        )}

        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="plant-skeleton" style={{ height: "335px" }} aria-hidden="true" />
            ))
          : entryElements.length === 0
          ? (
            <div className="empty-state">
              <span className="empty-emoji">📰</span>
              <h3>No articles found</h3>
              <p>Try a different search term or browse another category.</p>
            </div>
          )
          : entryElements}

        {/* Load More Articles Button */}
        {!loading && !usingFallback && hasMore && blogs.length > 0 && (
          <div style={{ width: "100%", textAlign: "center", paddingTop: "16px" }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "Loading..." : "Load More Articles 📰"}
            </button>
          </div>
        )}
      </article>
    </aside>
  );
}
