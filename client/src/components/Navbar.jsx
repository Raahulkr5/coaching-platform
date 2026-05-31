import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: "70px",
      background: scrolled
        ? "rgba(10, 10, 15, 0.85)"
        : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.3s ease",
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          fontWeight: 800,
          color: "white",
          boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
        }}>P</div>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#f1f0ff" }}>
          PYQs <span style={{ color: "#a78bfa" }}>Coaching</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[
          { label: "Home", path: "/" },
          { label: "Courses", path: "/courses" },
          { label: "About", path: "/about" },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              color: location.pathname === path ? "#a78bfa" : "#8b8aa3",
              background: location.pathname === path ? "rgba(124,58,237,0.12)" : "transparent",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              if (location.pathname !== path) {
                e.target.style.color = "#f1f0ff";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }
            }}
            onMouseLeave={e => {
              if (location.pathname !== path) {
                e.target.style.color = "#8b8aa3";
                e.target.style.background = "transparent";
              }
            }}
          >
            {label}
          </Link>
        ))}

        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)", margin: "0 8px" }} />

        <Link to="/login">
          <button className="btn-primary" style={{ padding: "9px 22px", fontSize: "14px" }}>
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
