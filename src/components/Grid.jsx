import { useState } from "react";
import { Link } from "react-router-dom";

export default function Grid({ img, title, text, id, category, detailPath }) {
  const path = detailPath || "/plants";
  const [imgFailed, setImgFailed] = useState(!img?.src);

  const inner = (
    <>
      <div className="main-image-container">
        {imgFailed ? (
          <div className="main-image-fallback">
            <span className="main-image-fallback-icon">🌿</span>
            <span className="main-image-fallback-text">{img?.alt || title}</span>
          </div>
        ) : (
          <img
            className="main-image"
            src={img?.src}
            alt={img?.alt}
            onError={() => setImgFailed(true)}
          />
        )}
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
