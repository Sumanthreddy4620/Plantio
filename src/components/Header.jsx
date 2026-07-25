import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import plantLogo from "../assets/plant.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check user login status on mount & storage changes
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("plantio_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("plantio_token");
    localStorage.removeItem("plantio_user");
    setUser(null);
    closeMenu();
    navigate("/");
  };

  return (
    <header className={isScrolled ? "scrolled" : ""}>
      <div className="header-logo">
        <NavLink to="/" onClick={closeMenu}>
          <img src={plantLogo} alt="Plantio Logo" />
          <p>Plantio</p>
        </NavLink>
      </div>

      <nav className={`header-links ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/plants" onClick={closeMenu}>Plants</NavLink>
        <NavLink to="/diseases" onClick={closeMenu}>Plant Problems</NavLink>
        <NavLink to="/blog" onClick={closeMenu}>Blog</NavLink>
        <NavLink to="/your-plants" onClick={closeMenu}>Your Plants</NavLink>

        {user ? (
          <div className="nav-user-container">
            <span className="nav-user-badge">
              Hi, {user.firstName || "Gardener"} 👋
            </span>
            <button
              onClick={handleLogout}
              className="nav-logout-btn"
              title="Log out of your account"
            >
              Log Out
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/signup" className="nav-signup-btn" onClick={closeMenu}>Sign Up</NavLink>
            <NavLink to="/login" className="nav-login-btn" onClick={closeMenu}>Log In</NavLink>
          </>
        )}
      </nav>

      <button
        className={`hamburger ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}