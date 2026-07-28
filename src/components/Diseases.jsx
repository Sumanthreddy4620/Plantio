import { Link } from "react-router-dom";
import { useState } from "react";
import DisComp from "./Discomp";

export default function Diseases() {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <main>
        <div className="FirstComp">
          
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

          <div className="FirstComp-search">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="bar"
                placeholder="Find a problem by name…"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" className="but">🔍︎</button>
            </form>
            <span>Search 740+ diseases & pests</span>
          </div>
        </div>
      </main>

      <DisComp searchText={searchText} />
    </>
  );
}
 