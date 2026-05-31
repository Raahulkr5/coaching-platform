import { Link } from "react-router-dom";

const stats = [
  { value: "2,400+", label: "Students Enrolled" },
  { value: "98%", label: "Score Improvement" },
  { value: "50+", label: "Expert Coaches" },
];

const features = [
  { icon: "🎯", title: "Personalized Plans", desc: "Custom study paths tailored to your goals and weak areas." },
  { icon: "📊", title: "Progress Tracking", desc: "Real-time analytics to monitor your improvement daily." },
  { icon: "🏆", title: "Proven Results", desc: "Students see an average score increase of 200+ points." },
];

export default function Hero() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "70px" }}>

      {/* Hero Section */}
      <section style={{
        position: "relative",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        padding: "60px 80px",
        overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "10%", left: "5%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}>
          {/* Left — Copy */}
          <div className="animate-fade-up">
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 50,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#a78bfa",
              marginBottom: 24,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
              #1 SAT · ACT · AP Coaching Platform
            </div>

            <h1 style={{
              fontSize: "clamp(42px, 5vw, 68px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              marginBottom: 24,
              color: "#f1f0ff",
            }}>
              Master your
              <br />
              <span className="gradient-text">dream score</span>
              <br />
              with expert coaching.
            </h1>

            <p style={{
              fontSize: 18,
              color: "#8b8aa3",
              lineHeight: 1.7,
              maxWidth: 460,
              marginBottom: 40,
            }}>
              Premium prep with personalized mentorship, adaptive practice,
              and proven strategies that get results.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 }}>
              <Link to="/login">
                <button className="btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
                  Start Free Trial →
                </button>
              </Link>
              <button className="btn-ghost" style={{ padding: "14px 32px", fontSize: 16 }}>
                Watch Demo ▶
              </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: "flex", gap: 40 }}>
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#f1f0ff", letterSpacing: "-0.5px" }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 13, color: "#8b8aa3", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature Card */}
          <div className="animate-float" style={{ position: "relative" }}>
            {/* Glow */}
            <div style={{
              position: "absolute", inset: -2,
              background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(236,72,153,0.6))",
              borderRadius: 28,
              filter: "blur(20px)",
              opacity: 0.3,
            }} />

            <div className="glass-card" style={{
              position: "relative",
              padding: "40px",
              borderRadius: 28,
              background: "rgba(19,19,26,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 32,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>🎓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Why Choose PYQs?</div>
                  <div style={{ fontSize: 13, color: "#8b8aa3" }}>Everything you need to succeed</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {features.map(({ icon, title, desc }) => (
                  <div key={title} style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    padding: "16px 20px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                      e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    }}
                  >
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 13, color: "#8b8aa3", lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar decoration */}
              <div style={{ marginTop: 28, padding: "16px 20px", background: "rgba(255,255,255,0.04)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Average Score Improvement</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>+210 pts</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: "82%",
                    background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                    borderRadius: 4,
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
