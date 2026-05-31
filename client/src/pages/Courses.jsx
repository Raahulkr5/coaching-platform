import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const courses = [
  {
    icon: "📐",
    tag: "SAT",
    title: "SAT Complete Prep",
    desc: "Master Math, Reading & Writing with full-length practice tests, adaptive drills, and live coaching sessions.",
    duration: "12 Weeks",
    sessions: "36 Sessions",
    level: "All Levels",
    color: "#7c3aed",
  },
  {
    icon: "📝",
    tag: "ACT",
    title: "ACT Mastery Program",
    desc: "Comprehensive coverage of English, Math, Reading, Science, and the optional Writing section.",
    duration: "10 Weeks",
    sessions: "30 Sessions",
    level: "Intermediate",
    color: "#ec4899",
  },
  {
    icon: "🧪",
    tag: "AP",
    title: "AP Sciences Bundle",
    desc: "Deep-dive prep for AP Chemistry, Biology, and Physics with expert instructors and lab walkthroughs.",
    duration: "16 Weeks",
    sessions: "48 Sessions",
    level: "Advanced",
    color: "#06b6d4",
  },
  {
    icon: "📊",
    tag: "AP",
    title: "AP Calculus AB/BC",
    desc: "From limits to series — structured problem sets, video explanations, and past FRQ walkthroughs.",
    duration: "14 Weeks",
    sessions: "42 Sessions",
    level: "Advanced",
    color: "#f59e0b",
  },
  {
    icon: "📖",
    tag: "SAT",
    title: "SAT Reading & Writing",
    desc: "Focus on verbal reasoning, grammar, evidence-based reading, and high-frequency vocabulary.",
    duration: "8 Weeks",
    sessions: "24 Sessions",
    level: "Beginner",
    color: "#10b981",
  },
  {
    icon: "🔢",
    tag: "SAT",
    title: "SAT Math Intensive",
    desc: "Targeted SAT Math prep covering algebra, advanced math, problem-solving and data analysis.",
    duration: "8 Weeks",
    sessions: "24 Sessions",
    level: "Intermediate",
    color: "#ef4444",
  },
];

const tagColors = {
  SAT: { bg: "rgba(124,58,237,0.15)", color: "#a78bfa" },
  ACT: { bg: "rgba(236,72,153,0.15)", color: "#f9a8d4" },
  AP:  { bg: "rgba(6,182,212,0.15)",  color: "#67e8f9" },
};

export default function Courses() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 40px 80px" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 600,
            color: "#a78bfa", marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
            Expert-Led Programs
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900,
            letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16,
          }}>
            Our <span className="gradient-text">Courses</span>
          </h1>
          <p style={{ fontSize: 18, color: "#8b8aa3", maxWidth: 520, margin: "0 auto" }}>
            Choose from our curated programs designed by top-scoring coaches to
            maximize your results.
          </p>
        </div>

        {/* Course Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 24,
        }}>
          {courses.map((course, i) => (
            <div
              key={course.title}
              className="glass-card"
              style={{
                padding: "28px",
                background: "rgba(19,19,26,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.25s ease",
                cursor: "pointer",
                animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${course.color}50`;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${course.color}20`,
                  border: `1px solid ${course.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24,
                }}>
                  {course.icon}
                </div>
                <span style={{
                  ...tagColors[course.tag],
                  padding: "4px 12px", borderRadius: 50,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.5px",
                }}>
                  {course.tag}
                </span>
              </div>

              <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.3px" }}>
                {course.title}
              </h2>
              <p style={{ fontSize: 14, color: "#8b8aa3", lineHeight: 1.65, marginBottom: 24 }}>
                {course.desc}
              </p>

              {/* Meta */}
              <div style={{
                display: "flex", gap: 12, flexWrap: "wrap",
                paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 24,
              }}>
                {[
                  { label: course.duration, icon: "🕐" },
                  { label: course.sessions, icon: "📅" },
                  { label: course.level, icon: "📶" },
                ].map(({ label, icon }) => (
                  <span key={label} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 12, color: "#8b8aa3",
                    background: "rgba(255,255,255,0.05)",
                    padding: "5px 10px", borderRadius: 6,
                  }}>
                    {icon} {label}
                  </span>
                ))}
              </div>

              <Link to="/login">
                <button className="btn-primary" style={{
                  width: "100%", justifyContent: "center",
                  padding: "11px", fontSize: 14,
                  background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
                  boxShadow: `0 4px 16px ${course.color}40`,
                }}>
                  Enroll Now →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
