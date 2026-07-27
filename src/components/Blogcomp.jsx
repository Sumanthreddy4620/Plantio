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

      const newBlogs = (data.blogs && data.blogs.length > 0) ? data.blogs : [];
      
      if (newBlogs.length === 0 && isReset) {
        const catFilter = selectedCategory === "All"
          ? dataBlog
          : dataBlog.filter((post) => post.category === selectedCategory);
        const filtered = catFilter.filter((post) =>
          post.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setBlogs(filtered);
        setTotalCount(filtered.length);
        setHasMore(false);
        setUsingFallback(false);
      } else {
        setBlogs((prev) => isReset ? newBlogs : [...prev, ...newBlogs]);
        setTotalCount(data.total || newBlogs.length);
        setHasMore(pageNum < (data.lastPage || 1));
        setUsingFallback(false);
      }
    } catch {
      if (!isMounted.current) return;
      if (isReset) {
        const catFilter = selectedCategory === "All"
          ? dataBlog
          : dataBlog.filter((post) => post.category === selectedCategory);
        const filtered = catFilter.filter((post) =>
          post.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setBlogs(filtered);
        setTotalCount(filtered.length);
        setHasMore(false);
        setUsingFallback(false);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
        
        {!loading && (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
              📰 Displaying <strong>{blogs.length}</strong> botanical guides & care articles
            </p>
          </div>
        )}

        <article className="plant-grid">
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
            : entryElements
          }
        </article>

        {!loading && !usingFallback && hasMore && blogs.length > 0 && (
          <div style={{ textAlign: "center", margin: "24px 0 12px" }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-btn"
            >
              {loadingMore ? "Loading..." : "Load More Articles 📰"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
