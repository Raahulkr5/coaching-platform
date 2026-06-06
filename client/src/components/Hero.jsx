import { Link } from "react-router-dom";

const stats = [
  { title: "Personalized Roadmaps", desc: "Every student receives a learning plan based on goals, timeline, and current performance." },
  { title: "Global Student Support", desc: "Designed for students in the USA, UAE, and international school systems." },
  { title: "Progress Visibility", desc: "Parents receive clear updates on performance, areas for improvement, and next steps." },
  { title: "Exam-Focused Prep", desc: "Practice, strategy, review, and feedback aligned with real exam expectations." },
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
      <section className="hero-section">
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "10%", left: "5%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div className="hero-grid">
          {/* Left — Copy */}
          <div className="animate-fade-up">
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.25)",
              borderRadius: 50,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: 24,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
              #1 SAT · ACT · AP Coaching Platform
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 5vw, 68px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              marginBottom: 24,
              color: "var(--text)",
            }}>
              Master your
              <br />
              <span className="gradient-text">dream score</span>
              <br />
              with expert coaching.
            </h1>

            <p style={{
              fontSize: 18,
              color: "var(--text-muted)",
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
            <div className="hero-stats-grid">
              {stats.map(({ title, desc }) => (
                <div key={title}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px", marginBottom: 6 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature Card */}
          <div className="animate-float" style={{ position: "relative" }}>
            {/* Glow */}
            <div style={{
              position: "absolute", inset: -2,
              background: "linear-gradient(135deg, rgba(14,165,233,0.6), rgba(20,184,166,0.6))",
              borderRadius: 28,
              filter: "blur(20px)",
              opacity: 0.3,
            }} />

            <div className="glass-card feature-glass-card" style={{
              position: "relative",
              borderRadius: 28,
              boxShadow: "0 20px 60px rgba(14,165,233,0.1)",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 32,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>🎓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Why Choose PYQs?</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Everything you need to succeed</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {features.map(({ icon, title, desc }) => (
                  <div key={title} style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    padding: "16px 20px",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(14,165,233,0.1)";
                      e.currentTarget.style.borderColor = "rgba(14,165,233,0.25)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "var(--bg-glass)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: "var(--text)" }}>{title}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar decoration */}
              <div style={{ marginTop: 28, padding: "16px 20px", background: "var(--bg-glass)", borderRadius: 14, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Average Score Improvement</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-light)" }}>+210 pts</span>
                </div>
                <div style={{ height: 8, background: "rgba(56,189,248,0.1)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: "82%",
                    background: "linear-gradient(90deg, #0ea5e9, #14b8a6)",
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
