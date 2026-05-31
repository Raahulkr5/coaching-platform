import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const team = [
  { name: "Priya Sharma", role: "SAT & ACT Lead Coach", emoji: "👩‍🏫", score: "1580 SAT" },
  { name: "Arjun Mehta",  role: "AP Sciences Specialist", emoji: "👨‍🔬", score: "5s across 6 APs" },
  { name: "Riya Patel",   role: "Verbal & Writing Coach", emoji: "👩‍💻", score: "800 SAT Verbal" },
];

const values = [
  { icon: "🎯", title: "Results-Driven", desc: "Every lesson is designed with one goal — improving your score." },
  { icon: "💡", title: "Personalized Approach", desc: "No generic plans. We tailor everything to your strengths and gaps." },
  { icon: "🤝", title: "Student First", desc: "We're invested in your success long after the test is over." },
  { icon: "🔬", title: "Data Backed", desc: "Our methods are proven by thousands of score improvements tracked over 5 years." },
];

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 40px 80px" }}>

        {/* Hero */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.3)",
            borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 600,
            color: "#f9a8d4", marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f9a8d4", display: "inline-block" }} />
            Our Story
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900,
            letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 24,
          }}>
            Built by students,<br />
            <span className="gradient-text">for students.</span>
          </h1>
          <p style={{
            fontSize: 18, color: "#8b8aa3", maxWidth: 620,
            margin: "0 auto", lineHeight: 1.75,
          }}>
            PYQs Coaching was founded by a group of perfect-scorers who believed
            every student deserves access to the same elite preparation — regardless of
            background or budget.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="glass-card animate-fade-up-delay" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          padding: 0,
          overflow: "hidden",
          marginBottom: 80,
          background: "rgba(19,19,26,0.85)",
        }}>
          {[
            { value: "2,400+", label: "Students Taught" },
            { value: "98%",    label: "Satisfaction Rate" },
            { value: "210 pts", label: "Avg Score Gain" },
            { value: "5 yrs",  label: "Of Excellence" },
          ].map(({ value, label }, i) => (
            <div key={label} style={{
              padding: "32px 24px",
              textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div className="gradient-text" style={{
                fontSize: 36, fontWeight: 900, letterSpacing: "-1px", marginBottom: 6,
              }}>{value}</div>
              <div style={{ fontSize: 14, color: "#8b8aa3" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="animate-fade-up" style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 32, textAlign: "center" }}>
            What We Stand For
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20,
          }}>
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card" style={{
                padding: "28px 24px",
                background: "rgba(19,19,26,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  fontSize: 32, marginBottom: 16,
                  width: 56, height: 56, borderRadius: 14,
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#8b8aa3", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="animate-fade-up-delay" style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 32, textAlign: "center" }}>
            Meet the Coaches
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24,
          }}>
            {team.map(({ name, role, emoji, score }) => (
              <div key={name} className="glass-card" style={{
                padding: "32px 28px",
                textAlign: "center",
                background: "rgba(19,19,26,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(236,72,153,0.35)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))",
                  border: "2px solid rgba(124,58,237,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, margin: "0 auto 16px",
                }}>
                  {emoji}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 13, color: "#8b8aa3", marginBottom: 12 }}>{role}</div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: 50, padding: "4px 14px",
                  fontSize: 12, fontWeight: 700, color: "#a78bfa",
                }}>
                  🏆 {score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card" style={{
          textAlign: "center",
          padding: "60px 40px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.12))",
          border: "1px solid rgba(124,58,237,0.2)",
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>
            Ready to start your journey?
          </h2>
          <p style={{ fontSize: 16, color: "#8b8aa3", marginBottom: 32 }}>
            Join thousands of students who already crushed their target scores.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <Link to="/login">
              <button className="btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
                Get Started Free →
              </button>
            </Link>
            <Link to="/courses">
              <button className="btn-ghost" style={{ padding: "14px 32px", fontSize: 16 }}>
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
