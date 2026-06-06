import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const team = [
  { name: "Priya Sharma", role: "SAT & ACT Lead Coach", emoji: "👩‍🏫", score: "1580 SAT", color: "#0ea5e9" },
  { name: "Arjun Mehta",  role: "AP Sciences Specialist", emoji: "👨‍🔬", score: "5s across 6 APs", color: "#14b8a6" },
  { name: "Riya Patel",   role: "Verbal & Writing Coach", emoji: "👩‍💻", score: "800 SAT Verbal", color: "#8b5cf6" },
];

const values = [
  { icon: "🎯", title: "Results-Driven", desc: "Every lesson is designed with one goal — improving your score.", color: "#0ea5e9" },
  { icon: "💡", title: "Personalized Approach", desc: "No generic plans. We tailor everything to your strengths and gaps.", color: "#f59e0b" },
  { icon: "🤝", title: "Student First", desc: "We're invested in your success long after the test is over.", color: "#10b981" },
  { icon: "🔬", title: "Data Backed", desc: "Our methods are proven by thousands of score improvements tracked over 5 years.", color: "#8b5cf6" },
];

const stats = [
  { icon: "🗺️", title: "Personalized Roadmaps", desc: "Every student receives a learning plan based on goals, timeline, and current performance." },
  { icon: "🌍", title: "Global Student Support", desc: "Designed for students in the USA, UAE, and international school systems." },
  { icon: "📊", title: "Progress Visibility", desc: "Parents receive clear updates on performance, areas for improvement, and next steps." },
  { icon: "🎓", title: "Exam-Focused Prep", desc: "Practice, strategy, review, and feedback aligned with real exam expectations." },
];

export default function About() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 40px 80px" }}>

        {/* Hero */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 600,
            color: "var(--primary)", marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
            Our Story
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900,
            letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 24, color: "var(--text)",
          }}>
            Built by students,<br />
            <span className="gradient-text">for students.</span>
          </h1>
          <p style={{
            fontSize: 18, color: "var(--text-muted)", maxWidth: 620,
            margin: "0 auto", lineHeight: 1.75,
          }}>
            PYQs Coaching was founded by a group of perfect-scorers who believed
            every student deserves access to the same elite preparation — regardless of
            background or budget.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="about-stats-grid animate-fade-up-delay" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          marginBottom: 80,
        }}>
          {stats.map(({ icon, title, desc }) => (
            <div key={title} style={{
              padding: "28px 24px",
              background: "var(--bg-card)",
              borderRadius: 16,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: "rgba(14,165,233,0.1)",
                border: "1px solid rgba(14,165,233,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{icon}</div>
              <div>
                <div style={{
                  fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--text)",
                }}>{title}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="animate-fade-up" style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8, textAlign: "center", color: "var(--text)" }}>
            What We Stand For
          </h2>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 40, fontSize: 16 }}>
            The principles that guide every lesson, every plan, every interaction.
          </p>
          <div className="about-values-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20,
          }}>
            {values.map(({ icon, title, desc, color }) => (
              <div key={title} style={{
                padding: "28px 24px",
                background: "var(--bg-card)",
                border: `1px solid ${color}25`,
                borderRadius: 16,
                borderTop: `3px solid ${color}`,
                boxShadow: `0 4px 20px ${color}10`,
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}10`;
                }}
              >
                <div style={{
                  fontSize: 28, marginBottom: 16,
                  width: 52, height: 52, borderRadius: 12,
                  background: `${color}12`,
                  border: `1px solid ${color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="animate-fade-up-delay" style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8, textAlign: "center", color: "var(--text)" }}>
            Meet the Coaches
          </h2>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 40, fontSize: 16 }}>
            Perfect-scorers turned expert mentors, dedicated to your success.
          </p>
          <div className="about-team-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24,
          }}>
            {team.map(({ name, role, emoji, score, color }) => (
              <div key={name} style={{
                padding: "36px 28px",
                textAlign: "center",
                background: "var(--bg-card)",
                border: `1px solid ${color}25`,
                borderRadius: 16,
                borderTop: `3px solid ${color}`,
                boxShadow: `0 4px 20px ${color}10`,
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 16px 40px ${color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}10`;
                }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                  border: `2px solid ${color}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, margin: "0 auto 20px",
                }}>
                  {emoji}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: "var(--text)" }}>{name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{role}</div>
                <div style={{
                  display: "inline-block",
                  background: `${color}12`,
                  border: `1px solid ${color}30`,
                  borderRadius: 50, padding: "5px 16px",
                  fontSize: 12, fontWeight: 700, color: color,
                }}>
                  🏆 {score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta" style={{
          textAlign: "center",
          padding: "72px 60px",
          background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(14,165,233,0.3)",
        }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 12, color: "#ffffff" }}>
            Ready to start your journey?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginBottom: 36 }}>
            Join thousands of students who already crushed their target scores.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login">
              <button style={{
                padding: "14px 36px", fontSize: 16, fontWeight: 700,
                background: "#ffffff", color: "#0ea5e9",
                border: "none", borderRadius: 50, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
              >
                Get Started Free →
              </button>
            </Link>
            <Link to="/courses">
              <button style={{
                padding: "14px 36px", fontSize: 16, fontWeight: 600,
                background: "rgba(255,255,255,0.15)", color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.4)", borderRadius: 50, cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              >
                Browse Courses
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
