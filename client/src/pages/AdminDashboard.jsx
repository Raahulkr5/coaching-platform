import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const navItems = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "students",  icon: "👥", label: "Students" },
  { id: "courses",   icon: "📚", label: "Courses" },
  { id: "revenue",   icon: "💰", label: "Revenue" },
  { id: "settings",  icon: "⚙️",  label: "Settings" },
];

const statusStyle = {
  Active:   { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7", border: "rgba(16,185,129,0.3)" },
  Inactive: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af", border: "rgba(107,114,128,0.3)" },
  Pending:  { bg: "rgba(245,158,11,0.15)",  color: "#fcd34d", border: "rgba(245,158,11,0.3)" },
};

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "3px solid rgba(124,58,237,0.2)",
        borderTopColor: "#7c3aed",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeNav, setActiveNav]     = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [stats, setStats]             = useState(null);
  const [students, setStudents]       = useState([]);
  const [courses, setCourses]         = useState([]);
  const [revenue, setRevenue]         = useState([]);
  const [payments, setPayments]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const navigate = useNavigate();

  /* ── Fetch all dashboard data ── */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/dashboard/students"),
      api.get("/dashboard/courses"),
      api.get("/dashboard/revenue"),
      api.get("/dashboard/payments"),
    ])
      .then(([s, st, c, r, p]) => {
        setStats(s.data);
        setStudents(st.data);
        setCourses(c.data);
        setRevenue(r.data);
        setPayments(p.data);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Re-fetch students on search ── */
  useEffect(() => {
    const delay = setTimeout(() => {
      api.get(`/dashboard/students?search=${searchQuery}`)
        .then(r => setStudents(r.data))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteClick = (id) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await api.delete(`/dashboard/students/${studentToDelete}`);
      setStudents(prev => prev.filter(s => s.id !== studentToDelete));
      const s = await api.get("/dashboard/stats");
      setStats(s.data);
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const maxRevenue = revenue.length ? Math.max(...revenue.map(d => d.value)) : 1;
  const maxEnroll  = courses.length  ? Math.max(...courses.map(d => d.enrollments)) : 1;

  const statCards = stats ? [
    { label: "Total Students",  value: (stats.totalStudents || 0).toLocaleString(), change: "Live", icon: "👥", color: "#7c3aed" },
    { label: "Active Courses",  value: stats.activeCourses || 0,                  change: "Live", icon: "📚", color: "#ec4899" },
    { label: "Revenue (Month)", value: `₹${((stats.monthlyRevenue || 0)/100000).toFixed(1)}L`, change: "Live", icon: "💰", color: "#10b981" },
    { label: "Avg Score Gain",  value: `${stats.avgScoreGain || 0} pts`,           change: "Live", icon: "📈", color: "#f59e0b" },
  ] : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, minHeight: "100vh",
        background: "rgba(13,13,20,0.98)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", padding: "24px 0",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "white",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
            }}>P</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f0ff" }}>PYQs Admin</div>
              <div style={{ fontSize: 11, color: "#8b8aa3" }}>Management Panel</div>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setActiveNav(id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10,
              background: activeNav === id ? "rgba(124,58,237,0.18)" : "transparent",
              border: activeNav === id ? "1px solid rgba(124,58,237,0.35)" : "1px solid transparent",
              color: activeNav === id ? "#a78bfa" : "#8b8aa3",
              fontSize: 14, fontWeight: activeNav === id ? 600 : 400,
              cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { if (activeNav !== id) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#f1f0ff"; }}}
              onMouseLeave={e => { if (activeNav !== id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b8aa3"; }}}
            >
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10, width: "100%",
            background: "transparent", border: "1px solid transparent",
            color: "#8b8aa3", fontSize: 14, cursor: "pointer", transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#fca5a5"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8b8aa3"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 240, flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 14, color: "#8b8aa3" }}>Welcome back — here's what's happening today.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px" }}>
              <span style={{ fontSize: 14 }}>🔔</span>
              <span style={{ background: "#7c3aed", color: "white", fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
                <div style={{ fontSize: 11, color: "#8b8aa3" }}>Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 14, color: "#fca5a5" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? <Spinner /> : (
          <>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
              {statCards.map(({ label, value, icon, color }) => (
                <div key={label} style={{ background: "rgba(19,19,26,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 24px", transition: "all 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6ee7b7", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", padding: "3px 8px", borderRadius: 20 }}>● Live</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "#8b8aa3" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 28 }}>

              {/* Revenue Chart */}
              <div style={{ background: "rgba(19,19,26,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Monthly Revenue</div>
                    <div style={{ fontSize: 13, color: "#8b8aa3" }}>Live from database</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#6ee7b7", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", padding: "4px 12px", borderRadius: 20 }}>● Real-time</div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                  {revenue.map(({ month, value }) => (
                    <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: "100%", height: `${(value / maxRevenue) * 120}px`,
                        background: "linear-gradient(180deg, #7c3aed, #ec4899)",
                        borderRadius: "6px 6px 0 0", transition: "all 0.3s ease", cursor: "pointer",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.boxShadow = "0 0 16px rgba(124,58,237,0.5)"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "none"; }}
                        title={`₹${(value/1000).toFixed(0)}K`}
                      />
                      <span style={{ fontSize: 12, color: "#8b8aa3" }}>{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Enrollment */}
              <div style={{ background: "rgba(19,19,26,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Course Enrollment</div>
                <div style={{ fontSize: 13, color: "#8b8aa3", marginBottom: 24 }}>All programs</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {courses.map(({ name, enrollments, color }) => (
                    <div key={name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#c4c3d8", fontWeight: 500 }}>{name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{enrollments}</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(enrollments / maxEnroll) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            {(activeNav === "dashboard" || activeNav === "revenue") && (
              <div style={{ background: "rgba(19,19,26,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 0, overflow: "hidden", marginBottom: 28 }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Recent Transactions</div>
                    <div style={{ fontSize: 13, color: "#8b8aa3" }}>Latest payments from students</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>Total: ₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["Student", "Amount", "Method", "Status", "Date"].map(h => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8b8aa3", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan="5" style={{ padding: 40, textAlign: "center", color: "#8b8aa3" }}>No transactions found.</td></tr>
                    ) : payments.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: i < payments.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "14px 24px" }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{p.studentName}</div>
                          <div style={{ fontSize: 11, color: "#8b8aa3" }}>{p.email}</div>
                        </td>
                        <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 700, color: "#6ee7b7" }}>₹{(p.amount || 0).toLocaleString()}</td>
                        <td style={{ padding: "14px 24px", fontSize: 13, color: "#8b8aa3" }}>{p.method}</td>
                        <td style={{ padding: "14px 24px" }}>
                          <span style={{ background: "rgba(16,185,129,0.12)", color: "#6ee7b7", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "1px solid rgba(16,185,129,0.2)" }}>{p.status}</span>
                        </td>
                        <td style={{ padding: "14px 24px", fontSize: 12, color: "#8b8aa3" }}>{new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Students Table */}
            <div style={{ background: "rgba(19,19,26,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Students</div>
                  <div style={{ fontSize: 13, color: "#8b8aa3" }}>{students.length} records</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px" }}>
                    <span style={{ fontSize: 14, color: "#8b8aa3" }}>🔍</span>
                    <input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ background: "none", border: "none", outline: "none", color: "#f1f0ff", fontSize: 13, fontFamily: "Inter, sans-serif", width: 160 }}
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      color: "white", border: "none", borderRadius: 10,
                      padding: "8px 18px", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
                    }}
                  >
                    + Add Student
                  </button>
                </div>
              </div>

              {/* Add Student Modal */}
              {showAddModal && (
                <div style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
                  justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
                }}>
                  <div style={{
                    background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20, padding: 32, width: "100%", maxWidth: 400,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                  }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add New Student</h2>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const data = Object.fromEntries(formData);
                      try {
                        await api.post("/dashboard/students", data);
                        setShowAddModal(false);
                        // Refresh data
                        const st = await api.get("/dashboard/students");
                        setStudents(st.data);
                        const s = await api.get("/dashboard/stats");
                        setStats(s.data);
                      } catch (err) {
                        alert("Failed to add student");
                      }
                    }}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 12, color: "#8b8aa3", marginBottom: 6 }}>Full Name</label>
                        <input name="name" required style={modalInputStyle} placeholder="John Doe" />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 12, color: "#8b8aa3", marginBottom: 6 }}>Email</label>
                        <input name="email" type="email" style={modalInputStyle} placeholder="john@example.com" />
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontSize: 12, color: "#8b8aa3", marginBottom: 6 }}>Course</label>
                        <select name="course_id" style={modalInputStyle}>
                          <option value="">Select a course</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8b8aa3", cursor: "pointer" }}>Cancel</button>
                        <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", color: "white", fontWeight: 600, cursor: "pointer" }}>Save Student</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                    {["Student", "Course", "Score Gain", "Status", "Payment", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: h === "Actions" ? "center" : "left", fontSize: 12, fontWeight: 600, color: "#8b8aa3", letterSpacing: "0.5px", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.avatar}</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: "#8b8aa3" }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: 13, color: "#8b8aa3" }}>{s.course || "—"}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.score_gain > 0 ? "#6ee7b7" : "#8b8aa3" }}>
                          {s.score_gain > 0 ? `+${s.score_gain} pts` : "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ ...statusStyle[s.status], padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${statusStyle[s.status]?.border}` }}>{s.status}</span>
                      </td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ 
                          padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: s.paymentStatus === "Completed" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                          color: s.paymentStatus === "Completed" ? "#6ee7b7" : "#fcd34d",
                          border: `1px solid ${s.paymentStatus === "Completed" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`
                        }}>
                          {s.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                          <button 
                            onClick={() => handleViewStudent(s)}
                            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer", transition: "all 0.2s ease" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.1)"}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(s.id)}
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer", transition: "all 0.2s ease" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                            title="Delete Student"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* View Student Details Modal */}
              {showViewModal && selectedStudent && (
                <div style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
                  justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
                }}>
                  <div style={{
                    background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24, padding: 40, width: "100%", maxWidth: 500,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>{selectedStudent.avatar}</div>
                        <div>
                          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{selectedStudent.name}</h2>
                          <div style={{ fontSize: 14, color: "#8b8aa3" }}>{selectedStudent.email}</div>
                        </div>
                      </div>
                      <button onClick={() => setShowViewModal(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#8b8aa3", fontSize: 20, cursor: "pointer", width: 32, height: 32, borderRadius: "50%" }}>×</button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                      <DetailItem label="Course" value={selectedStudent.course || "Not Enrolled"} />
                      <DetailItem label="Status" value={selectedStudent.status} />
                      <DetailItem label="Score Gain" value={selectedStudent.score_gain > 0 ? `+${selectedStudent.score_gain} pts` : "No data"} />
                      <DetailItem label="Payment" value={selectedStudent.paymentStatus || "Pending"} />
                      <DetailItem label="Phone" value={selectedStudent.phoneNumber || "Not provided"} />
                      <DetailItem label="Joined" value={new Date(selectedStudent.created_at || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
                    </div>

                    <button 
                      onClick={() => setShowViewModal(false)} 
                      style={{ width: "100%", padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: 600, cursor: "pointer" }}
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
                  justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
                }}>
                  <div style={{
                    background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24, padding: 32, width: "100%", maxWidth: 380,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.5)", textAlign: "center"
                  }}>
                    <div style={{ 
                      width: 64, height: 64, borderRadius: "50%", 
                      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 32, margin: "0 auto 24px"
                    }}>⚠️</div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Delete Student?</h2>
                    <p style={{ fontSize: 14, color: "#8b8aa3", marginBottom: 32, lineHeight: 1.6 }}>
                      Are you sure you want to delete this student? This action cannot be undone and will remove all associated data.
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button 
                        onClick={() => setShowDeleteModal(false)} 
                        style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8b8aa3", cursor: "pointer", fontWeight: 600 }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmDelete} 
                        style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#ef4444", border: "none", color: "white", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const modalInputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color: "white",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
function DetailItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#8b8aa3", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "#f1f0ff" }}>{value}</div>
    </div>
  );
}
