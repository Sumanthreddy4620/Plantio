import { Link } from "react-router-dom";
import YourComp from "./YourComp";

export default function YourPlant() {
  return (
    <main>
      <div className="FirstComp">
        <div className="FirstComp-text">
          <h4>
            <Link to="/">Plantio → </Link>
            Your Plants
          </h4>

          <h3>Keep Track on your plants</h3>

          <p>
            Manage all your plants by tracking watering, growth, and care<br/> reminders.A simple way to keep your plants healthy and growing strong.
          </p>

        </div>
      </div>

      <YourComp />
    </main>
  );
}
