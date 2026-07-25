import { Link } from "react-router-dom";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80";

export default function Grid({ img, title, text, id, category, detailPath }) {
  const path = detailPath || "/plants";

  const inner = (
    <>
      <div className="main-image-container">
        <img
          className="main-image"
          src={img.src}
          alt={img.alt}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
      </div>
      <h3 className="main-name">{title}</h3>
      <p className="main-name-info">{text}</p>
      {category && <span className="plant-category-badge">{category}</span>}
    </>
  );

  if (id) {
    return (
      <Link className="plant-entry" to={`${path}/${id}`} title={`View ${title} details`}>
        {inner}
      </Link>
    );
  }

  return <div className="plant-entry">{inner}</div>;
}