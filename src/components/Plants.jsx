import { Link } from "react-router-dom";
import { useState } from "react";
import Comp from "./Comp";

export default function Plants() {
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
            Plants
          </h4>
          <h3>Discover and Identify Plants Instantly</h3>
          <p>
            Instantly recognize plants around you.
            Simple, fast, and accurate identification.
          </p>
        </div>

        {/* Right: search */}
        <div className="FirstComp-search">
          <form onSubmit={handleSubmit}>
            <input
              className="bar"
              placeholder="Find a plant by name…"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input type="submit" className="but" value="🔍︎" />
          </form>
          <span>Search from 300,00+ plant species</span>
        </div>
      </div>

      <Comp searchText={searchText} />
    </main>
  );
}
