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
    <div className="page-wrapper" style={{ position: "relative", overflow: "hidden" }}>
      <Navbar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        paddingTop: "70px",
        position: "relative",
      }}>
        {/* Background blob */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        {/* Form Section */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}>
          <div className="animate-fade-up" style={{
            width: "100%",
            maxWidth: 600,
            padding: "48px 44px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 20,
            boxShadow: "var(--shadow)",
          }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 6,
              letterSpacing: "-0.5px",
              color: "var(--text)",
            }}>Create account</h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 36 }}>
              Join our platform and start your journey
            </p>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 24,
                fontSize: 14,
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Name Row */}
              <div className="register-name-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input required placeholder="John" value={form.firstName} onChange={handleChange("firstName")} className="input-base" />
                </div>
                <div>
                  <label style={labelStyle}>Middle Name</label>
                  <input placeholder="Quincy" value={form.middleName} onChange={handleChange("middleName")} className="input-base" />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input required placeholder="Doe" value={form.lastName} onChange={handleChange("lastName")} className="input-base" />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="register-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div>
                  <label style={labelStyle}>Email ID</label>
                  <input type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange("email")} className="input-base" />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input placeholder="+91 98765 43210" value={form.phoneNumber} onChange={handleChange("phoneNumber")} className="input-base" />
                </div>
              </div>

              {/* City & Country Row */}
              <div className="register-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input placeholder="New Delhi" value={form.city} onChange={handleChange("city")} className="input-base" />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input placeholder="India" value={form.country} onChange={handleChange("country")} className="input-base" />
                </div>
              </div>

              {/* Password Row */}
              <div className="register-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange("password")}
                      className="input-base"
                      style={{ paddingRight: 40 }}
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
                    className="input-base"
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
              color: "var(--text-muted)",
            }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 13, fontWeight: 600,
  color: "var(--text-secondary)", marginBottom: 8,
};

const eyeButtonStyle = {
  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", fontSize: 16, cursor: "pointer",
  color: "var(--text-faint)", lineHeight: 1,
};
