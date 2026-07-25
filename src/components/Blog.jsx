import { Link } from "react-router-dom";
import { useState } from "react";
import Comp from "./Blogcomp";

export default function Blog() {
  const [searchText, setSearchText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main>
      <div className="FirstComp">
        {/* Left: text */}
        <div className="FirstComp-text">
          <h4>
            <Link to="/">Plantio → </Link>
            Blog
          </h4>
          <h3>Plant Blog – Grow Plants & Knowledge</h3>
          <p>
            Grow your Botany knowledge like you grow your greenies with our plant blog articles.
          </p>
        </div>

        {/* Right: search */}
        <div className="FirstComp-search">
          <form onSubmit={handleSubmit}>
            <input
              className="bar"
              placeholder="Search articles…"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input type="submit" className="but" value="🔍︎" />
          </form>
          <span>Browse plant care tips & guides</span>
        </div>
      </div>

      <Comp searchText={searchText} />
    </main>
  );
}
