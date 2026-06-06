import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const navItems = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "students",  icon: "👥", label: "Students" },
  { id: "courses",   icon: "📚", label: "Courses" },
  { id: "revenue",   icon: "💰", label: "Revenue" },
  { id: "tests",     icon: "📝", label: "Tests" },
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
  const [tests, setTests]             = useState([]);
  const [testResults, setTestResults] = useState([]);
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
      api.get("/dashboard/tests"),
      api.get("/dashboard/all-test-results"),
    ])
      .then(([s, st, c, r, p, t, tr]) => {
        setStats(s.data);
        setStudents(st.data);
        setCourses(c.data);
        setRevenue(r.data);
        setPayments(p.data);
        setTests(Array.isArray(t.data) ? t.data : []);
        setTestResults(Array.isArray(tr.data) ? tr.data : []);
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

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await api.delete(`/dashboard/tests/${id}`);
      setTests(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete test");
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
    <div className="admin-layout" style={{ background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        padding: "24px 0",
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid var(--border)" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "var(--text)",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
            }}>P</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>PYQs Admin</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Management Panel</div>
            </div>
          </Link>
        </div>

        <nav className="admin-nav" style={{ flex: 1, padding: "20px 12px" }}>
          {navItems.map(({ id, icon, label }) => (
            <button key={id} className="admin-nav-item" onClick={() => setActiveNav(id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10,
              background: activeNav === id ? "rgba(124,58,237,0.18)" : "transparent",
              border: activeNav === id ? "1px solid rgba(124,58,237,0.35)" : "1px solid transparent",
              color: activeNav === id ? "#a78bfa" : "var(--text-muted)",
              fontSize: 14, fontWeight: activeNav === id ? 600 : 400,
              cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { if (activeNav !== id) { e.currentTarget.style.background = "var(--bg-glass)"; e.currentTarget.style.color = "var(--text)"; }}}
              onMouseLeave={e => { if (activeNav !== id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
            >
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10, width: "100%",
            background: "transparent", border: "1px solid transparent",
            color: "var(--text-muted)", fontSize: 14, cursor: "pointer", transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#fca5a5"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Welcome back — here's what's happening today.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-glass)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "9px 14px" }}>
              <span style={{ fontSize: 14 }}>🔔</span>
              <span style={{ background: "#7c3aed", color: "var(--text)", fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-glass)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "8px 14px" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Super Admin</div>
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
            <div className="admin-stats-grid" style={{ marginBottom: 28 }}>
              {statCards.map(({ label, value, icon, color }) => (
                <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 24px", transition: "all 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6ee7b7", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", padding: "3px 8px", borderRadius: 20 }}>● Live</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="admin-charts-grid" style={{ marginBottom: 28 }}>

              {/* Revenue Chart */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Monthly Revenue</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Live from database</div>
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
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Enrollment */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Course Enrollment</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>All programs</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {courses.map(({ name, enrollments, color }) => (
                    <div key={name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{enrollments}</span>
                      </div>
                      <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(enrollments / maxEnroll) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            {(activeNav === "dashboard" || activeNav === "revenue") && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 0, overflow: "hidden", marginBottom: 28 }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Recent Transactions</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Latest payments from students</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>Total: ₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-glass)" }}>
                      {["Student", "Amount", "Method", "Status", "Date"].map(h => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan="5" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No transactions found.</td></tr>
                    ) : payments.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: i < payments.length - 1 ? "1px solid var(--bg-glass)" : "none" }}>
                        <td style={{ padding: "14px 24px" }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{p.studentName}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.email}</div>
                        </td>
                        <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 700, color: "#6ee7b7" }}>₹{(p.amount || 0).toLocaleString()}</td>
                        <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>{p.method}</td>
                        <td style={{ padding: "14px 24px" }}>
                          <span style={{ background: "rgba(16,185,129,0.12)", color: "#6ee7b7", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "1px solid rgba(16,185,129,0.2)" }}>{p.status}</span>
                        </td>
                        <td style={{ padding: "14px 24px", fontSize: 12, color: "var(--text-muted)" }}>{new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            {/* Students Table */}
            {(activeNav === "dashboard" || activeNav === "students") && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Students</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{students.length} records</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-glass)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "8px 14px" }}>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>🔍</span>
                    <input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 13, fontFamily: "Inter, sans-serif", width: 160 }}
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      color: "var(--text)", border: "none", borderRadius: 10,
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
                    background: "var(--modal-bg)", border: "1px solid var(--border-hover)",
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
                        <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Full Name</label>
                        <input name="name" required style={{ width: "100%", padding: "10px 14px", background: "var(--bg-glass)", border: "1px solid var(--border-hover)", borderRadius: 10, color: "var(--text)", outline: "none" }} placeholder="John Doe" />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Email</label>
                        <input name="email" type="email" style={{ width: "100%", padding: "10px 14px", background: "var(--bg-glass)", border: "1px solid var(--border-hover)", borderRadius: 10, color: "var(--text)", outline: "none" }} placeholder="john@example.com" />
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Course</label>
                        <select name="course_id" style={{ width: "100%", padding: "10px 14px", background: "var(--bg-glass)", border: "1px solid var(--border-hover)", borderRadius: 10, color: "var(--text)", outline: "none" }}>
                          <option value="">Select a course</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "var(--bg-glass)", border: "1px solid var(--border-hover)", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
                        <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", color: "var(--text)", fontWeight: 600, cursor: "pointer" }}>Save Student</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-glass)" }}>
                    {["Student", "Course", "Score Gain", "Status", "Payment", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: h === "Actions" ? "center" : "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase", borderBottom: "1px solid var(--bg-glass)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? "1px solid var(--bg-glass)" : "none", transition: "background 0.15s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-glass)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {s.avatar && s.avatar.length > 2 ? (
                              <img src={s.avatar.startsWith('http') ? s.avatar : (s.avatar.includes('localhost') ? `http://${s.avatar}` : s.avatar)} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="" />
                            ) : (
                              s.avatar || s.name?.charAt(0)
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>{s.course || "—"}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.score_gain > 0 ? "#6ee7b7" : "var(--text-muted)" }}>
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
              </div>

              {/* View Student Details Modal */}
              {showViewModal && selectedStudent && (
                <div style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
                  justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
                }}>
                  <div style={{
                    background: "var(--modal-bg)", border: "1px solid var(--border-hover)",
                    borderRadius: 24, padding: 40, width: "100%", maxWidth: 500,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>
                          {selectedStudent.avatar && selectedStudent.avatar.length > 2 ? (
                            <img src={selectedStudent.avatar.startsWith('http') ? selectedStudent.avatar : (selectedStudent.avatar.includes('localhost') ? `http://${selectedStudent.avatar}` : selectedStudent.avatar)} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="" />
                          ) : (
                            selectedStudent.avatar || selectedStudent.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{selectedStudent.name}</h2>
                          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{selectedStudent.email}</div>
                        </div>
                      </div>
                      <button onClick={() => setShowViewModal(false)} style={{ background: "var(--bg-glass)", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", width: 32, height: 32, borderRadius: "50%" }}>×</button>
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
                      style={{ width: "100%", padding: "14px", borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border-hover)", color: "var(--text)", fontWeight: 600, cursor: "pointer" }}
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
                    background: "var(--modal-bg)", border: "1px solid var(--border-hover)",
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
                    <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
                      Are you sure you want to delete this student? This action cannot be undone and will remove all associated data.
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button 
                        onClick={() => setShowDeleteModal(false)} 
                        style={{ flex: 1, padding: "12px", borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border-hover)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmDelete} 
                        style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#ef4444", border: "none", color: "var(--text)", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Tests Panel */}
            {activeNav === "tests" && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>HTML Tests</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{tests.length} tests available</div>
                  </div>
                  <button 
                    onClick={() => setShowAddModal("test")}
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      color: "var(--text)", border: "none", borderRadius: 10,
                      padding: "8px 18px", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
                    }}
                  >
                    + Add New Test
                  </button>
                </div>

                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                  {tests.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>No tests created yet.</div>
                  ) : (
                    tests.map(test => (
                      <div key={test.id} style={{ padding: 20, background: "var(--bg-glass)", border: "1px solid var(--bg-glass)", borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{test.title}</h3>
                          <button 
                            onClick={() => handleDeleteTest(test.id)}
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer", transition: "all 0.2s ease" }}
                            title="Delete Test"
                          >
                            🗑️
                          </button>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Created: {new Date(test.created_at).toLocaleString()}</div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", background: "#0d0d14", padding: 12, borderRadius: 8, overflowX: "auto", whiteSpace: "pre-wrap", maxHeight: 100, overflowY: "auto" }}>
                          {test.html_content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Student Test Results */}
                <div style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <div style={{ padding: "0 24px 20px" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Student Test Results</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Overview of all submitted tests</div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "var(--bg-glass)" }}>
                          {["Student", "Email", "Test Name", "Score", "Date"].map(h => (
                            <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.length === 0 ? (
                          <tr><td colSpan="5" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No test results found.</td></tr>
                        ) : testResults.map((tr, i) => (
                          <tr key={tr.id} style={{ borderBottom: i < testResults.length - 1 ? "1px solid var(--bg-glass)" : "none" }}>
                            <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 600 }}>
                              {(tr.firstName || tr.lastName) ? `${tr.firstName || ""} ${tr.lastName || ""}`.trim() : tr.email.split("@")[0]}
                            </td>
                            <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>{tr.email}</td>
                            <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-secondary)" }}>{tr.test_title}</td>
                            <td style={{ padding: "14px 24px" }}>
                              <span style={{ background: "rgba(16,185,129,0.12)", color: "#6ee7b7", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: "1px solid rgba(16,185,129,0.2)" }}>
                                {tr.answered} / {tr.total_questions}
                              </span>
                            </td>
                            <td style={{ padding: "14px 24px", fontSize: 12, color: "var(--text-muted)" }}>{new Date(tr.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Add Test Modal */}
            {showAddModal === "test" && (
              <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(15, 23, 42, 0.65)", display: "flex", alignItems: "center",
                justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
              }}>
                <div style={{
                  background: "#ffffff", border: "1px solid #e5e7eb",
                  borderRadius: 8, width: "90%", maxWidth: 950,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  display: "flex", flexDirection: "column", color: "#1f2937"
                }}>
                  {/* Modal Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#1f2937" }}>Print template</h2>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 16, height: 16, borderRadius: "50%", background: "#4b5563",
                        color: "#ffffff", fontSize: 11, fontWeight: "bold", cursor: "pointer"
                      }} title="Help info">?</span>
                    </div>
                    <button 
                      onClick={() => setShowAddModal(false)} 
                      style={{ background: "none", border: "none", fontSize: 22, color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    try {
                      await api.post("/dashboard/tests", data);
                      setShowAddModal(false);
                      const t = await api.get("/dashboard/tests");
                      setTests(Array.isArray(t.data) ? t.data : []);
                    } catch (err) {
                      alert("Failed to add test");
                    }
                  }} style={{ display: "flex", flexDirection: "column", padding: "20px 24px" }}>
                    
                    {/* Add Template link */}
                    <div style={{ marginBottom: 16 }}>
                      <a href="#add" onClick={(e) => e.preventDefault()} style={{ color: "#2563eb", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        + Add Template
                      </a>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>Print template</label>
                      <input 
                        name="title" 
                        required 
                        style={{
                          width: "100%", padding: "10px 14px", background: "#ffffff",
                          border: "1px solid #d1d5db", borderRadius: 4, color: "#1f2937",
                          fontSize: 14, outline: "none", boxSizing: "border-box"
                        }} 
                        placeholder="e.g. Physics Chapter 1 Quiz" 
                      />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>Editor</label>
                      <textarea 
                        name="html_content" 
                        required 
                        style={{ 
                          width: "100%", height: 350, padding: "16px", background: "#ffffff",
                          border: "1px solid #d1d5db", borderRadius: 4, color: "#1f2937",
                          fontSize: 14, fontFamily: "monospace", outline: "none", resize: "vertical",
                          boxSizing: "border-box"
                        }} 
                        placeholder="<!-- Type or paste your raw HTML here -->&#10;<h1>Physics Quiz</h1>&#10;<p>Please choose the correct answer:</p>&#10;..." 
                      />
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 10 }}>
                      <button 
                        type="button" 
                        onClick={() => setShowAddModal(false)} 
                        style={{ 
                          padding: "8px 20px", borderRadius: 4, background: "#eaebee", 
                          border: "none", color: "#2b3445", fontSize: 14, fontWeight: 500, 
                          cursor: "pointer" 
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        style={{ 
                          padding: "8px 24px", borderRadius: 4, background: "#2563eb", 
                          border: "none", color: "var(--text)", fontSize: 14, fontWeight: 600, 
                          cursor: "pointer" 
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Courses Panel */}
            {activeNav === "courses" && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Courses Management</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{courses.length} courses available</div>
                  </div>
                  <button 
                    onClick={() => setShowAddModal("course")}
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      color: "var(--text)", border: "none", borderRadius: 10,
                      padding: "8px 18px", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
                    }}
                  >
                    + Add New Course
                  </button>
                </div>

                <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {courses.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 40, gridColumn: "1 / -1" }}>No courses created yet.</div>
                  ) : (
                    courses.map(course => (
                      <div key={course.id} style={{ padding: 20, background: "var(--bg-glass)", border: "1px solid var(--bg-glass)", borderRadius: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", background: course.color || "#7c3aed" }} />
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{course.name}</h3>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                          <span>Enrollments:</span>
                          <span style={{ fontWeight: 600, color: "var(--text)" }}>{course.enrollments} students</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Add Course Modal */}
            {showAddModal === "course" && (
              <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
                justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
              }}>
                <div style={{
                  background: "var(--modal-bg)", border: "1px solid var(--border-hover)",
                  borderRadius: 20, padding: 32, width: "100%", maxWidth: 400,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add New Course</h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    try {
                      await api.post("/dashboard/courses", data);
                      setShowAddModal(false);
                      // Refresh data
                      const c = await api.get("/dashboard/courses");
                      setCourses(c.data);
                      const s = await api.get("/dashboard/stats");
                      setStats(s.data);
                    } catch (err) {
                      alert("Failed to add course");
                    }
                  }}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Course Name</label>
                      <input name="name" required style={modalInputStyle} placeholder="e.g. SAT Math Intensive" />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Theme Color</label>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input name="color" type="color" defaultValue="#7c3aed" style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }} />
                        <div style={{ fontSize: 12, color: "var(--text-muted)", alignSelf: "center" }}>Select a color to represent this course.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "var(--bg-glass)", border: "1px solid var(--border-hover)", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
                      <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", color: "var(--text)", fontWeight: 600, cursor: "pointer" }}>Save Course</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const modalInputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "var(--bg-glass)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 10,
  color: "var(--text)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
function DetailItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{value}</div>
    </div>
  );
}
