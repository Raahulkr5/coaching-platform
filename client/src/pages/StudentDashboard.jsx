import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserData(user);

      // Fetch specific user data to check payment status and avatar
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

      // Fetch my courses
      const myRes = await api.get("/dashboard/my-courses");
      setMyCourses(myRes.data);

      // Fetch all available courses
      const allRes = await api.get("/dashboard/courses");
      const enrolledIds = myRes.data.map(c => c.id);
      setAvailableCourses(allRes.data.filter(c => !enrolledIds.includes(c.id)));

    } catch (err) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) return <div style={{ color: "white", padding: 100, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 20px" }}>
        
        {/* Payment Banner */}
        {userData?.paymentStatus !== "Completed" && (
          <div style={{
            background: "linear-gradient(90deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 15, padding: "20px 30px", marginBottom: 30,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Tuition Fee Pending</h4>
              <p style={{ fontSize: 13, color: "#8b8aa3" }}>Please complete your payment to ensure uninterrupted access.</p>
            </div>
            <button onClick={() => setShowPaymentModal(true)} className="btn-primary" style={{ padding: "10px 24px" }}>Pay Tuition Fee</button>
          </div>
        )}

        {/* Welcome Header */}
        <div style={{ marginBottom: 50, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>
              Student <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={{ color: "#8b8aa3" }}>Welcome back, {userData?.firstName}!</p>
          </div>
          
          {/* Avatar Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, background: "rgba(255,255,255,0.03)", padding: "10px 20px", borderRadius: 15, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{userData?.firstName} {userData?.lastName}</div>
              <div style={{ fontSize: 12, color: "#8b8aa3" }}>{userData?.email}</div>
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

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 30 }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            
            {/* My Courses */}
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                My Enrolled Courses <span style={{ fontSize: 12, background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "2px 8px", borderRadius: 10 }}>{myCourses.length}</span>
              </h3>
              {myCourses.length === 0 ? (
                <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "#8b8aa3" }}>No courses yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                  {myCourses.map(course => (
                    <div key={course.id} className="glass-card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: course.color || "#7c3aed" }} />
                        <span style={{ fontWeight: 600 }}>{course.name}</span>
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
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>Personal Profile</h3>
                <button 
                  onClick={() => setShowEditModal(true)}
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Edit Profile
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
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
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Explore Courses</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {availableCourses.map(course => (
                <div key={course.id} className="glass-card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 600, marginBottom: 12 }}>{course.name}</div>
                  <button onClick={() => handleEnroll(course.id)} className="btn-primary" style={{ width: "100%", padding: "8px", justifyContent: "center" }}>Enroll</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
            <div className="glass-card animate-fade-up" style={{ width: "100%", maxWidth: 450, padding: 35, background: "rgba(19,19,26,0.95)" }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input 
                      required value={editForm.firstName} 
                      onChange={e => setEditForm({...editForm, firstName: e.target.value})} 
                      style={modalInputStyle} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input 
                      required value={editForm.lastName} 
                      onChange={e => setEditForm({...editForm, lastName: e.target.value})} 
                      style={modalInputStyle} 
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input 
                    value={editForm.phoneNumber} 
                    onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} 
                    style={modalInputStyle} 
                  />
                </div>
                <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
                  <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Gateway Modal */}
        {showPaymentModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(8px)" }}>
            <div className="glass-card animate-fade-up" style={{ width: "100%", maxWidth: 480, padding: 0, overflow: "hidden", background: "#0d0d14", border: "1px solid rgba(255,255,255,0.1)" }}>
              {/* Header */}
              <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>Secure Checkout</h3>
                  <div style={{ fontSize: 12, color: "#8b8aa3" }}>Transaction ID: #PYQ{Date.now().toString().slice(-6)}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#7c3aed" }}>₹4,600</div>
              </div>

              {/* Body */}
              <div style={{ padding: 30 }}>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Payment Method</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ border: "2px solid #7c3aed", borderRadius: 12, padding: 12, textAlign: "center", background: "rgba(124,58,237,0.1)" }}>
                      <span style={{ fontSize: 20 }}>💳</span>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>UPI / Cards</div>
                    </div>
                    <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12, textAlign: "center", opacity: 0.5 }}>
                      <span style={{ fontSize: 20 }}>🏦</span>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Net Banking</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Card Details</label>
                  <input placeholder="XXXX XXXX XXXX 4242" style={modalInputStyle} defaultValue="4242 4242 4242 4242" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 30 }}>
                  <div>
                    <label style={labelStyle}>Expiry</label>
                    <input placeholder="MM/YY" style={modalInputStyle} defaultValue="12/28" />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input placeholder="123" style={modalInputStyle} defaultValue="***" />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8b8aa3", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={() => handlePayment(4600)} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14 }}>Pay Now</button>
                </div>
                
                <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "#63627a", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span>🔒</span> SSL Encrypted 256-bit Secure Connection
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 60, textAlign: "center" }}>
          <button onClick={handleLogout} style={{ color: "#8b8aa3", background: "none", border: "none", cursor: "pointer" }}>Log Out</button>
        </div>

      </main>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#8b8aa3", marginBottom: 8 };
const modalInputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color: "white",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function DetailItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#8b8aa3", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: color || "#f1f0ff" }}>{value}</div>
    </div>
  );
}
