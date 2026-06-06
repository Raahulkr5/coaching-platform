import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div
        className="footer-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          marginBottom: 60,
        }}
      >
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 20,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "white",
              boxShadow: "0 4px 15px rgba(14,165,233,0.4)",
            }}>P</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>
              PYQs- <span style={{ color: "#38bdf8" }}>Placing You Quintessentially</span>
            </span>
          </Link>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", marginBottom: 12 }}>
            Your trusted coaching partner
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>
            Personalized academic coaching for students in the USA, UAE, and global curricula.
          </p>
        </div>

        {/* Programs */}
        <div>
          <h4 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Programs</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {["SAT Prep", "ACT Prep", "AP Coaching", "School Support", "Profile Building"].map(link => (
              <li key={link}><a href="#" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#38bdf8"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {["About PYQs", "Our Approach", "Contact", "Book Assessment"].map(link => (
              <li key={link}><a href="#" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#38bdf8"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Support</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {["Student Login", "Parent Updates", "FAQs", "Contact Us"].map(link => (
              <li key={link}><a href="#" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#38bdf8"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>{link}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        paddingTop: 30,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
        fontSize: 13,
      }}>
        © PYQs Edunet. All rights reserved.
      </div>
    </footer>
  );
}
