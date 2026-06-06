import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Home",         path: "/" },
  { label: "Programs",     path: "/courses" },
  { label: "About",        path: "/about" },
  { label: "Testimonials", path: "/#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const { theme, toggleTheme }      = useTheme();
  const location                    = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isDark = theme === "dark";

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: 800, color: "white",
            boxShadow: "0 4px 15px rgba(14,165,233,0.4)", flexShrink: 0,
          }}>P</div>
          <span className="navbar-logo-text">
            PYQs-{" "}
            <span className="navbar-logo-tagline" style={{ color: "var(--primary)" }}>Placing You Quintessentially</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link${location.pathname === path ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}

          <div className="nav-divider" />

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <Link to="/login">
            <button className="btn-primary" style={{ padding: "9px 22px", fontSize: "14px" }}>
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Mobile Theme Toggle (always visible) */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            style={{ display: "none" }}
            id="mobile-theme-toggle"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`mobile-nav-link${location.pathname === path ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
        <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

        {/* Dark mode toggle row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
            {isDark ? "Dark Mode" : "Light Mode"}
          </span>
          <button
            onClick={toggleTheme}
            style={{
              background: isDark ? "rgba(14,165,233,0.15)" : "rgba(14,165,233,0.08)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <Link to="/login" style={{ marginTop: 4 }}>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
            Login to Dashboard
          </button>
        </Link>
      </div>
    </>
  );
}
