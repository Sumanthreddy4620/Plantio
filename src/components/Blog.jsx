import { Link } from "react-router-dom";
import { useState } from "react";
import Comp from "./Blogcomp";

export default function Blog() {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <main>
        <div className="FirstComp">
          
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

          <div className="FirstComp-search">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="bar"
                placeholder="Search articles…"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" className="but">🔍︎</button>
            </form>
            <span>Browse botanical guides & care tips</span>
          </div>
        </div>
      </main>

      <Comp searchText={searchText} />
    </>
  );
}
 