import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import dataBlog from "./data-blog";
import API_BASE_URL from "../config";

const PLACEHOLDER = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80";

export default function BlogDetail() {
  const { id } = useParams();
  const isLiveId = id && String(id).startsWith("blog_live_");

  const localPost = !isLiveId ? dataBlog.find((b) => b.id === Number(id)) : null;

  const [post, setPost] = useState(localPost || null);
  const [loading, setLoading] = useState(isLiveId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLiveId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/external-blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article detail not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPost(data.post);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, isLiveId]);

  if (loading) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>📰</p>
          <h2>Loading article...</h2>
          <p style={{ color: "var(--text-muted)" }}>Connecting to live database</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>📰</p>
          <h2>Article not found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>{error || "This article could not be loaded."}</p>
          <Link to="/blog" className="back-btn" style={{ marginTop: "20px", display: "inline-flex" }}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <div className="blog-detail-body">
        <Link to="/blog" className="back-btn">← Back to Blog</Link>

        <div className="blog-meta">
          <span className="blog-cat-badge">{post.category || "Plant Care"}</span>
          <span>📅 Plantio Blog</span>
          <span>⏱ {post.readTime || "5 min read"}</span>
        </div>

        <h1>{post.title}</h1>

        <img
          className="blog-detail-img"
          src={post.img || PLACEHOLDER}
          alt={post.title}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />

        <div className="blog-content">
          {post.content ? (
            post.content.map((block, i) =>
              block.type === "h2" ? (
                <h2 key={i}>{block.text}</h2>
              ) : block.type === "ul" ? (
                <ul key={i}>
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{block.text}</p>
              )
            )
          ) : (
            <>
              <p>{post.text}</p>
              <h2>Overview & Principles</h2>
              <p>
                Understanding this topic is essential for every plant enthusiast.
                Consistent care, proper lighting, and attentive watering are the keys to long-term plant health.
              </p>
            </>
          )}
        </div>

        {post.wikipediaUrl && (
          <div style={{ marginTop: "28px", padding: "16px", background: "var(--primary-light)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <a
              href={post.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--primary-dark)",
                fontWeight: 700,
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              📖 Read full scientific reference entry on Wikipedia →
            </a>
          </div>
        )}

        <div style={{ marginTop: "48px", borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: "20px" }}>
            More from Plantio Blog
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {dataBlog
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "200px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <img
                    src={related.img}
                    alt={related.title}
                    style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "12px" }}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                  <p style={{ fontSize: "0.87rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>
                    {related.title}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
