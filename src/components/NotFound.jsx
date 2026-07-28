import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="nf-emoji">🪴</div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        Looks like this page got lost in the garden. Let's get you back to
        something greener.
      </p>
      <Link to="/" className="home-link">
        🏠 Back to Home
      </Link>
    </div>
  );
}
 