import { useParams, Link } from "react-router-dom";
import dataBlog from "./data-blog";

const PLACEHOLDER = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80";

export default function BlogDetail() {
  const { id } = useParams();
  const post = dataBlog.find((b) => b.id === Number(id));

  if (!post) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-body" style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ fontSize: "3rem" }}>📰</p>
          <h2>Article not found</h2>
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
          <span className="blog-cat-badge">{post.category}</span>
          <span>📅 Plantio Blog</span>
          <span>⏱ 5 min read</span>
        </div>

        <h1>{post.title}</h1>

        <img
          className="blog-detail-img"
          src={post.img}
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
              <p>
                {post.text} Understanding this topic is essential for every plant
                enthusiast, whether you're a beginner or a seasoned gardener.
              </p>
              <h2>Why This Matters</h2>
              <p>
                Every plant has specific needs that, when met consistently, lead
                to remarkable growth and vitality. Learning to recognize and
                respond to these needs is the foundation of successful plant care.
              </p>
              <h2>Key Principles</h2>
              <ul>
                <li>Observe your plants daily for early signs of stress or disease.</li>
                <li>Maintain consistent watering schedules based on plant type and season.</li>
                <li>Ensure adequate light, soil, and drainage for each specific plant.</li>
                <li>Keep notes about what works and what doesn't for your conditions.</li>
              </ul>
              <p>
                The more attention you pay to your plants, the better you'll
                understand their rhythms. Start small, stay consistent, and your
                garden will flourish.
              </p>
            </>
          )}
        </div>

        {/* Related posts */}
        <div style={{ marginTop: "48px", borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: "20px" }}>
            More from {post.category}
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {dataBlog
              .filter((b) => b.category === post.category && b.id !== post.id)
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
