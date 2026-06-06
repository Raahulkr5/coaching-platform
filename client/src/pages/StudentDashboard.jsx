import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [myTestResults, setMyTestResults] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserData(user);

      const studentsRes = await api.get("/dashboard/students");
      const currentUser = studentsRes.data.find(s => s.email === user.email);
      if (currentUser) {
        setUserData(prev => ({
          ...prev,
          paymentStatus: currentUser.paymentStatus,
          avatar: currentUser.avatar,
          ...currentUser
        }));
        setEditForm({
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          phoneNumber: currentUser.phoneNumber || ""
        });
      }

      const myRes = await api.get("/dashboard/my-courses");
      setMyCourses(myRes.data);

      const allRes = await api.get("/dashboard/courses");
      const enrolledIds = myRes.data.map(c => c.id);
      setAvailableCourses(allRes.data.filter(c => !enrolledIds.includes(c.id)));

      try {
        const trRes = await api.get("/dashboard/my-test-results");
        setMyTestResults(trRes.data);
      } catch (err) {
        console.error("Failed to fetch my test results", err);
      }

      try {
        const testsRes = await api.get("/dashboard/tests");
        if (Array.isArray(testsRes.data)) {
          setTests(testsRes.data);
        } else {
          setTests([]);
        }
      } catch (testErr) {
        console.error("Failed to fetch tests", testErr);
      }

    } catch (err) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/dashboard/update-profile", editForm);
      setShowEditModal(false);
      fetchData();
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    try {
      setLoading(true);
      const res = await api.post("/dashboard/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUserData(prev => ({ ...prev, avatar: res.data.photoUrl }));
      alert("Profile photo updated!");
    } catch (err) {
      alert("Failed to upload photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post("/dashboard/enroll", { course_id: courseId });
      fetchData();
    } catch (err) {
      alert("Enrollment failed.");
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll?")) return;
    try {
      await api.post("/dashboard/unenroll", { course_id: courseId });
      fetchData();
    } catch (err) {
      alert("Unenrollment failed.");
    }
  };

  const handlePayment = async (amount = 4600) => {
    setLoading(true);
    try {
      await api.post("/dashboard/pay", { amount });
      setUserData(prev => ({ ...prev, paymentStatus: "Completed" }));
      setShowPaymentModal(false);
      alert("Payment successful! Your course access is now active.");
    } catch (err) {
      alert("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return (
    <div style={{ color: "var(--text)", padding: 100, textAlign: "center", background: "var(--bg)", minHeight: "100vh" }}>
      Loading...
    </div>
  );

  return (
    <div className="page-wrapper" style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />

      <main className="dashboard-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 20px 60px" }}>

        {/* Payment Banner */}
        {userData?.paymentStatus !== "Completed" && (
          <div style={{
            background: "linear-gradient(90deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 15, padding: "20px 30px", marginBottom: 30,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>Tuition Fee Pending</h4>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Please complete your payment to ensure uninterrupted access.</p>
            </div>
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary" style={{ padding: "10px 24px" }}>Pay Tuition Fee</button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="dashboard-welcome-header" style={{ marginBottom: 50, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: 10, color: "var(--text)" }}>
              Student <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={{ color: "var(--text-muted)" }}>Welcome back, {userData?.firstName}!</p>
          </div>

          {/* Avatar Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, background: "var(--bg-card)", padding: "10px 20px", borderRadius: 15, border: "1px solid var(--border-subtle)" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{userData?.firstName} {userData?.lastName}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{userData?.email}</div>
            </div>
            <div style={{ position: "relative" }}>
              <img
                src={userData?.avatar?.startsWith("http") ? userData.avatar : "https://via.placeholder.com/50?text=" + (userData?.firstName?.charAt(0) || "S")}
                alt="Avatar"
                style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #7c3aed" }}
              />
              <label style={{ position: "absolute", bottom: -5, right: -5, background: "#7c3aed", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>
                📷
                <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="dashboard-main-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 30 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>

            {/* My Courses */}
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "var(--text)" }}>
                My Enrolled Courses <span style={{ fontSize: 12, background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "2px 8px", borderRadius: 10 }}>{myCourses.length}</span>
              </h3>
              {myCourses.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No courses yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  {myCourses.map(course => (
                    <div key={course.id} className="glass-card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: course.color || "#7c3aed" }} />
                        <span style={{ fontWeight: 600, color: "var(--text)" }}>{course.name}</span>
                      </div>
                      <button onClick={() => handleUnenroll(course.id)} style={{ background: "none", border: "none", color: "#fca5a5", fontSize: 13, cursor: "pointer" }}>Unenroll</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Details Card */}
            <div className="glass-card" style={{ padding: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>Personal Profile</h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Edit Profile
                </button>
              </div>
              <div className="profile-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <DetailItem label="Full Name" value={`${userData?.firstName} ${userData?.lastName}`} />
                <DetailItem label="Email" value={userData?.email} />
                <DetailItem label="Phone" value={userData?.phoneNumber || "—"} />
                <DetailItem label="Location" value={`${userData?.city || "—"}, ${userData?.country || "—"}`} />
                <DetailItem label="Status" value={userData?.status || "Active"} color="#6ee7b7" />
                <DetailItem label="Payment" value={userData?.paymentStatus || "Pending"} color={userData?.paymentStatus === "Completed" ? "#6ee7b7" : "#fcd34d"} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>Explore Courses</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {availableCourses.map(course => (
                  <div key={course.id} className="glass-card" style={{ padding: 20 }}>
                    <div style={{ fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>{course.name}</div>
                    <button onClick={() => handleEnroll(course.id)} className="btn-primary" style={{ width: "100%", padding: "8px", justifyContent: "center" }}>Enroll</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Tests */}
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>Available Tests</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {tests.length === 0 ? (
                  <div className="glass-card" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No tests available.</div>
                ) : (
                  tests.map(test => (
                    <div key={test.id} className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>{test.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Added: {new Date(test.created_at).toLocaleDateString()}</div>
                      <button onClick={() => setActiveTest(test)} className="btn-primary" style={{ width: "100%", padding: "8px", justifyContent: "center", background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>Take Test</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Test Results */}
            <div style={{ marginTop: 10 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>My Test Results</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {myTestResults.length === 0 ? (
                  <div className="glass-card" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No tests taken yet.</div>
                ) : (
                  myTestResults.map(tr => (
                    <div key={tr.id} className="glass-card" style={{ padding: 20, borderLeft: "4px solid #10b981" }}>
                      <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>{tr.test_title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Submitted: {new Date(tr.created_at).toLocaleString()}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Questions Answered:</span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>{tr.answered} / {tr.total_questions}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(6px)" }}>
            <div className="glass-card animate-fade-up" style={{ width: "100%", maxWidth: 450, padding: 35 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input
                      required value={editForm.firstName}
                      onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input
                      required value={editForm.lastName}
                      onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="input-base"
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    value={editForm.phoneNumber}
                    onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    className="input-base"
                  />
                </div>
                <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
                  <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: 12, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Gateway Modal */}
        {showPaymentModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(8px)" }}>
            <div className="glass-card animate-fade-up" style={{ width: "100%", maxWidth: 480, padding: 0, overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {/* Header */}
              <div style={{ padding: "24px 30px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Secure Checkout</h3>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Transaction ID: #PYQ{Date.now().toString().slice(-6)}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#7c3aed" }}>₹4,600</div>
              </div>

              {/* Body */}
              <div style={{ padding: 30 }}>
                <div style={{ marginBottom: 24 }}>
                  <label style={paymentLabelStyle}>Payment Method</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ border: "2px solid #7c3aed", borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(124,58,237,0.1)" }}>
                      <span style={{ fontSize: 20 }}>💳</span>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: "#f1f5f9" }}>UPI / Cards</div>
                    </div>
                    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 12, textAlign: "center", opacity: 0.5 }}>
                      <span style={{ fontSize: 20 }}>🏦</span>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: "#f1f5f9" }}>Net Banking</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={paymentLabelStyle}>Card Details</label>
                  <input placeholder="XXXX XXXX XXXX 4242" style={paymentInputStyle} defaultValue="4242 4242 4242 4242" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 30 }}>
                  <div>
                    <label style={paymentLabelStyle}>Expiry</label>
                    <input placeholder="MM/YY" style={paymentInputStyle} defaultValue="12/28" />
                  </div>
                  <div>
                    <label style={paymentLabelStyle}>CVV</label>
                    <input placeholder="123" style={paymentInputStyle} defaultValue="***" />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={() => handlePayment(4600)} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14 }}>Pay Now</button>
                </div>

                <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "#63627a", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span>🔒</span> SSL Encrypted 256-bit Secure Connection
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Test Modal */}
        {activeTest && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "var(--bg-secondary)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)",
            padding: "20px",
          }}>
            <div style={{
              background: "#ffffff", border: "1px solid #e5e7eb",
              borderRadius: 8, width: "90%", maxWidth: 950,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              display: "flex", flexDirection: "column", color: "#1f2937",
              maxHeight: "90vh", overflow: "hidden",
            }}>
              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#1f2937" }}>{activeTest.title}</h2>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 16, height: 16, borderRadius: "50%", background: "#4b5563",
                    color: "#ffffff", fontSize: 11, fontWeight: "bold", cursor: "pointer"
                  }} title="Online Test Mode">?</span>
                </div>
                <button
                  onClick={() => setActiveTest(null)}
                  style={{ background: "none", border: "none", fontSize: 22, color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                >
                  &times;
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", padding: "20px 24px", overflow: "auto" }}>

                <div style={{ marginBottom: 16 }}>
                  <a href="#guidelines" onClick={(e) => { e.preventDefault(); alert("Test Guidelines:\n1. Choose one option for each question.\n2. Do not refresh the page during the test.\n3. Click Submit Test at the bottom when finished."); }} style={{ color: "#2563eb", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    + Read Test Guidelines
                  </a>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>Online Test Portal</label>
                  <div style={{ fontSize: 14, color: "#4b5563", padding: "8px 12px", background: "#f9fafb", borderRadius: 4, border: "1px solid #e5e7eb" }}>
                    Student Email: <strong style={{ color: "#1f2937" }}>{userData?.email}</strong> &bull; Total Questions: <strong style={{ color: "#1f2937" }}>Multi-choice Quiz</strong>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>Question Sheet</label>

                  <div
                    className="test-content-box"
                    style={{
                      width: "100%", height: 400, padding: "24px", background: "#ffffff",
                      border: "1px solid #d1d5db", borderRadius: 4, color: "#1f2937",
                      overflowY: "auto", boxSizing: "border-box"
                    }}
                  >
                    <style>{`
                      .test-content-box h1, .test-content-box h2, .test-content-box h3 {
                        color: #1f2937 !important;
                        font-family: 'Inter', sans-serif;
                        font-weight: 700;
                        margin-top: 10px;
                        margin-bottom: 16px;
                      }
                      .test-content-box p {
                        color: #4b5563 !important;
                        font-size: 14px;
                        margin-bottom: 14px;
                      }
                      .test-content-box label {
                        display: flex !important;
                        align-items: center !important;
                        gap: 12px !important;
                        padding: 12px 16px !important;
                        margin: 10px 0 !important;
                        background: #f9fafb !important;
                        border: 1px solid #e5e7eb !important;
                        border-radius: 6px !important;
                        cursor: pointer !important;
                        font-size: 14px !important;
                        color: #374151 !important;
                        font-weight: 500 !important;
                        transition: all 0.2s ease !important;
                      }
                      .test-content-box label:hover {
                        background: #f3f4f6 !important;
                        border-color: #d1d5db !important;
                        color: #1f2937 !important;
                      }
                      .test-content-box label:has(input[type="radio"]:checked),
                      .test-content-box label:has(input[type="checkbox"]:checked) {
                        background: #eff6ff !important;
                        border-color: #3b82f6 !important;
                        color: #1e3a8a !important;
                        box-shadow: 0 0 0 1px #3b82f6 !important;
                      }
                      .test-content-box input[type="radio"], .test-content-box input[type="checkbox"] {
                        accent-color: #2563eb !important;
                        width: 18px !important;
                        height: 18px !important;
                        cursor: pointer !important;
                      }
                    `}</style>
                    <div dangerouslySetInnerHTML={{ __html: activeTest.html_content }} />
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTest(null)}
                    style={{
                      padding: "8px 20px", borderRadius: 4, background: "#eaebee",
                      border: "none", color: "#2b3445", fontSize: 14, fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const container = document.querySelector(".test-content-box");
                      let answered = 0;
                      let totalQuestions = 0;
                      if (container) {
                        const nameGroups = new Set();
                        const inputs = container.querySelectorAll("input[type='radio'], input[type='checkbox']");
                        inputs.forEach(input => { if (input.name) nameGroups.add(input.name); });
                        totalQuestions = nameGroups.size;
                        nameGroups.forEach(name => {
                          if (container.querySelector(`input[name="${name}"]:checked`)) answered++;
                        });
                      }
                      const tq = totalQuestions || 2;
                      if (window.confirm(`Are you sure you want to submit the test?\nYou answered ${answered} out of ${tq} questions.`)) {
                        try {
                          await api.post("/dashboard/test-results", { test_id: activeTest.id, answered, total_questions: tq });
                          alert("Test submitted successfully! Your responses have been recorded.");
                          setActiveTest(null);
                          fetchData();
                        } catch (err) {
                          alert("Failed to submit test. Please try again.");
                        }
                      }
                    }}
                    style={{
                      padding: "8px 24px", borderRadius: 4, background: "#2563eb",
                      border: "none", color: "var(--text)", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", boxShadow: "0 2px 4px rgba(37,99,235,0.2)"
                    }}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 60, textAlign: "center", paddingBottom: 40 }}>
          <button
            onClick={handleLogout}
            style={{
              color: "#fca5a5",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              padding: "10px 32px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          >
            Log Out
          </button>
        </div>

      </main>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "var(--text-muted)", marginBottom: 8,
};

const paymentLabelStyle = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "var(--text-muted)", marginBottom: 8,
};

const paymentInputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--bg-glass)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 10,
  color: "var(--text)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function DetailItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: color || "var(--text)" }}>{value}</div>
    </div>
  );
}
