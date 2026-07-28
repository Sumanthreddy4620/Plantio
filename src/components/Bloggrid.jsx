import { useState } from "react";
import { Link } from "react-router-dom";

export default function BlogGrid({ img, title, text, id }) {
  const [imgFailed, setImgFailed] = useState(!img);

  const inner = (
    <>
      <div className="main-image-container">
        {imgFailed ? (
          <div className="main-image-fallback">
            <span className="main-image-fallback-icon">📰</span>
            <span className="main-image-fallback-text">{title}</span>
          </div>
        ) : (
          <img
            className="main-image"
            src={img}
            alt={title}
            onError={() => setImgFailed(true)}
          />
        )}
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
 