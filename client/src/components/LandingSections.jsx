import { Link } from "react-router-dom";

export default function LandingSections() {
  return (
    <>
      {/* Programs / Services */}
      <section id="programs" className="section-padding" style={{ background: "var(--section-alt)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>Programs / Services</h2>
          <p style={{ fontSize: 17, color: "var(--text-muted)", marginBottom: 48 }}>Expert-led programs built for every exam goal.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30 }}>
            {[
              { icon: "📐", title: "SAT Prep", desc: "Comprehensive curriculum for maximizing your SAT score.", color: "#0ea5e9" },
              { icon: "📝", title: "ACT Prep", desc: "Targeted strategies for every ACT section.", color: "#14b8a6" },
              { icon: "🧪", title: "AP Coaching", desc: "Subject-specific tutoring for top AP scores.", color: "#8b5cf6" },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} style={{
                padding: 40,
                background: "var(--bg-card)",
                border: `1px solid var(--border)`,
                borderRadius: 16,
                boxShadow: "var(--shadow-card)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(14,165,233,0.15)`;
                  e.currentTarget.style.borderColor = color + "60";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14, fontSize: 26,
                  background: `${color}15`, border: `1px solid ${color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>{icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>{title}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>Why Choose Us (The PYQs Difference)</h2>
          <p style={{ fontSize: 17, color: "var(--text-muted)", marginBottom: 48 }}>What sets us apart from every other platform.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 30, flexWrap: "wrap" }}>
            {[
              { icon: "🎯", label: "Expert Coaching", color: "#0ea5e9" },
              { icon: "👥", label: "Small Group & 1:1 Formats", color: "#14b8a6" },
              { icon: "🌍", label: "Global Reach", color: "#8b5cf6" },
            ].map(({ icon, label, color }) => (
              <div key={label} style={{
                flex: "1 1 240px", padding: "32px 28px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                boxShadow: "var(--shadow-card)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color + "50";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding" style={{ background: "var(--section-alt)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>Testimonials</h2>
          <p style={{ fontSize: 17, color: "var(--text-muted)", marginBottom: 48 }}>What our students say about us.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30 }}>
            {[
              { quote: "PYQs helped me go from 1200 to 1480 on the SAT. The personalized coaching made all the difference!", name: "Aisha R.", score: "SAT 1480" },
              { quote: "My ACT score jumped 6 points in just 10 weeks. The coaches genuinely care about your success.", name: "Jordan M.", score: "ACT 34" },
            ].map(({ quote, name, score }) => (
              <div key={name} style={{
                padding: 40,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                boxShadow: "var(--shadow-card)",
                textAlign: "left",
              }}>
                <div style={{ fontSize: 32, color: "var(--primary)", marginBottom: 16, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 16, fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>{quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: 16,
                  }}>{name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{name}</div>
                    <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>{score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" style={{ background: "var(--bg)" }}>
        <div className="cta-card" style={{
          maxWidth: 1000, margin: "0 auto", textAlign: "center",
          borderRadius: 28,
          background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
          boxShadow: "0 20px 60px rgba(14,165,233,0.3)",
        }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: 16, color: "#ffffff" }}>
            Ready to ace your exam?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 40 }}>
            Join 2,400+ students who boosted their scores with PYQs expert coaching.
          </p>
          <Link to="/login">
            <button style={{
              padding: "16px 48px", fontSize: 18, fontWeight: 700,
              background: "#ffffff", color: "#0ea5e9",
              border: "none", borderRadius: 50, cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              transition: "all 0.25s ease",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
            >
              Get Started Free →
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
