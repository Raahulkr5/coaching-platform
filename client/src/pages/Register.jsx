import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    city: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      navigate("/login", { state: { message: "Account created! Please log in." } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <Navbar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        paddingTop: "70px",
        position: "relative",
      }}>
      {/* Background blobs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      
      {/* Form Section */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}>
        <div className="glass-card animate-fade-up" style={{
          width: "100%",
          maxWidth: 600,
          padding: "48px 44px",
          background: "rgba(19,19,26,0.85)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 6,
            letterSpacing: "-0.5px",
          }}>Create account</h1>
          <p style={{ fontSize: 14, color: "#8b8aa3", marginBottom: 36 }}>
            Join our platform and start your journey
          </p>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 24,
              fontSize: 14,
              color: "#fca5a5",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* Name Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input required placeholder="John" value={form.firstName} onChange={handleChange("firstName")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Middle Name</label>
                <input placeholder="Quincy" value={form.middleName} onChange={handleChange("middleName")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input required placeholder="Doe" value={form.lastName} onChange={handleChange("lastName")} style={inputStyle} />
              </div>
            </div>

            {/* Email & Phone Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <div>
                <label style={labelStyle}>Email ID</label>
                <input type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange("email")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input placeholder="+91 98765 43210" value={form.phoneNumber} onChange={handleChange("phoneNumber")} style={inputStyle} />
              </div>
            </div>

            {/* City & Country Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input placeholder="New Delhi" value={form.city} onChange={handleChange("city")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input placeholder="India" value={form.country} onChange={handleChange("country")} style={inputStyle} />
              </div>
            </div>

            {/* Password Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange("password")}
                    style={{ ...inputStyle, paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={eyeButtonStyle}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 15,
                justifyContent: "center",
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 14,
            color: "#8b8aa3",
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#a78bfa", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#c4c3d8", marginBottom: 8 };

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "10px",
  color: "#f1f0ff",
  fontSize: "15px",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

const eyeButtonStyle = {
  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", fontSize: 16, cursor: "pointer",
  color: "#8b8aa3", lineHeight: 1,
};
