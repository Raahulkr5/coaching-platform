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
    tagBg: "rgba(124,58,237,0.1)",
    tagColor: "#7c3aed",
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
    tagBg: "rgba(236,72,153,0.1)",
    tagColor: "#ec4899",
  },
  {
    icon: "🧪",
    tag: "AP",
    title: "AP Sciences Bundle",
    desc: "Deep-dive prep for AP Chemistry, Biology, and Physics with expert instructors and lab walkthroughs.",
    duration: "16 Weeks",
    sessions: "48 Sessions",
    level: "Advanced",
    color: "#0ea5e9",
    tagBg: "rgba(14,165,233,0.1)",
    tagColor: "#0ea5e9",
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
    tagBg: "rgba(245,158,11,0.1)",
    tagColor: "#d97706",
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
    tagBg: "rgba(16,185,129,0.1)",
    tagColor: "#059669",
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
    tagBg: "rgba(239,68,68,0.1)",
    tagColor: "#dc2626",
  },
];

export default function Courses() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 40px 80px" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 600,
            color: "var(--primary)", marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
            Expert-Led Programs
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900,
            letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16, color: "var(--text)",
          }}>
            Our <span className="gradient-text">Courses</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto" }}>
            Choose from our curated programs designed by top-scoring coaches to
            maximize your results.
          </p>
        </div>

        {/* Course Grid */}
        <div className="courses-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {courses.map((course, i) => (
            <div
              key={course.title}
              style={{
                padding: "28px",
                background: "var(--bg-card)",
                border: `1px solid ${course.color}25`,
                borderRadius: 16,
                boxShadow: `0 4px 24px ${course.color}10`,
                transition: "all 0.25s ease",
                cursor: "pointer",
                animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
                borderTop: `3px solid ${course.color}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 20px 48px ${course.color}25`;
                e.currentTarget.style.borderColor = `${course.color}60`;
                e.currentTarget.style.borderTopColor = course.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 24px ${course.color}10`;
                e.currentTarget.style.borderColor = `${course.color}25`;
                e.currentTarget.style.borderTopColor = course.color;
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${course.color}15`,
                  border: `1px solid ${course.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24,
                }}>
                  {course.icon}
                </div>
                <span style={{
                  background: course.tagBg,
                  color: course.tagColor,
                  padding: "4px 12px", borderRadius: 50,
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.5px",
                  border: `1px solid ${course.color}25`,
                }}>
                  {course.tag}
                </span>
              </div>

              <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.3px", color: "var(--text)" }}>
                {course.title}
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 24 }}>
                {course.desc}
              </p>

              {/* Meta */}
              <div style={{
                display: "flex", gap: 8, flexWrap: "wrap",
                paddingTop: 16, borderTop: `1px solid ${course.color}15`,
                marginBottom: 20,
              }}>
                {[
                  { label: course.duration, icon: "🕐" },
                  { label: course.sessions, icon: "📅" },
                  { label: course.level, icon: "📶" },
                ].map(({ label, icon }) => (
                  <span key={label} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 12, color: "var(--text-muted)", fontWeight: 500,
                    background: `${course.color}08`,
                    border: `1px solid ${course.color}20`,
                    padding: "4px 10px", borderRadius: 6,
                  }}>
                    {icon} {label}
                  </span>
                ))}
              </div>

              <Link to="/login">
                <button style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
                  boxShadow: `0 4px 16px ${course.color}40`,
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${course.color}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${course.color}40`; }}
                >
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
