import { Link } from "react-router-dom";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80";

export default function BlogGrid({ img, title, text, id }) {
  const imgSrc = img || PLACEHOLDER;

  const inner = (
    <>
      <div className="main-image-container">
        <img
          className="main-image"
          src={imgSrc}
          alt={title}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
      </div>
      <h3 className="main-name">{title}</h3>
      <p className="main-name-info">{text}</p>
    </>
  );

  if (id) {
    return (
      <Link className="Blog-entry" to={`/blog/${id}`} title={`Read: ${title}`}>
        {inner}
      </Link>
    );
  }

  return <div className="Blog-entry">{inner}</div>;
}