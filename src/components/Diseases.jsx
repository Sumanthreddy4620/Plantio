import { Link } from "react-router-dom";
import { useState } from "react";
import DisComp from "./Discomp";

export default function Diseases() {
  const [searchText, setSearchText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <main>
        <div className="FirstComp">
          {/* Left: text */}
          <div className="FirstComp-text">
            <h4>
              <Link to="/">Plantio → </Link>
              Plant Problems
            </h4>
            <h3>
              Learn to recognize common
              plant problems & their solutions.
            </h3>
            <p>
              Understand the causes, symptoms, and fixes for healthier plants.
            </p>
          </div>

          {/* Right: search */}
          <div className="FirstComp-search">
            <form onSubmit={handleSubmit}>
              <input
                className="bar"
                placeholder="Find a problem by name…"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <input type="submit" className="but" value="🔍︎" />
            </form>
            <span>Search diseases & pests</span>
          </div>
        </div>
      </main>

      <DisComp searchText={searchText} />
    </>
  );
}
