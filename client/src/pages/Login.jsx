import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("resetToken");
    if (token) {
      setResetToken(token);
      setShowResetModal(true);
    }
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: forgotEmail });
      setModalMessage(res.data.message);
      setTimeout(() => {
        setShowForgotModal(false);
        setModalMessage("");
        setForgotEmail("");
      }, 3000);
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { token: resetToken, newPassword });
      setModalMessage(res.data.message);
      setTimeout(() => {
        setShowResetModal(false);
        setModalMessage("");
        setNewPassword("");
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3000);
    } catch (err) {
      setModalError(err.response?.data?.message || "Invalid or expired token.");
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
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 65%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        {/* Left — Branding Panel */}
        <div className="login-panel-left" style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          position: "relative",
        }}>
          <div className="animate-fade-up">
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              marginBottom: 20,
              color: "var(--text)",
            }}>
              Your dream score
              <br />
              <span className="gradient-text">starts here.</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 400 }}>
              Join 2,400+ students who boosted their SAT, ACT, and AP scores
              with expert-led coaching and personalized plans.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48 }}>
              {[
                { icon: "✅", text: "Personalized study plans" },
                { icon: "📈", text: "Track progress in real-time" },
                { icon: "🏆", text: "98% of students improve" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Login Form */}
        <div className="login-panel-right" style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}>
          <div className="login-form-card animate-fade-up-delay" style={{
            width: "100%",
            maxWidth: 440,
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
            }}>Welcome Back to PYQs</h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 36 }}>
              Continue your learning journey. Review assignments, track progress, and access your personalized study plan.
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
              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="input-base"
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Password
                  </label>
                  <button type="button" onClick={() => setShowForgotModal(true)} style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange("password")}
                    className="input-base"
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", fontSize: 16, cursor: "pointer",
                      color: "var(--text-faint)", lineHeight: 1,
                    }}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
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
                {loading ? "Signing in…" : "Login to Dashboard"}
              </button>
            </form>

            <p style={{
              textAlign: "center",
              marginTop: 28,
              fontSize: 14,
              color: "var(--text-muted)",
            }}>
              New to PYQs?{" "}
              <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
                Book a Free Assessment
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)",
          padding: "20px",
        }}>
          <div style={{
            background: "var(--modal-bg)", border: "1px solid var(--border-subtle)",
            borderRadius: 20, padding: 32, width: "100%", maxWidth: 400,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>Forgot Password</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>Enter your registered email to receive a reset link.</p>

            {modalMessage && (
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#059669" }}>
                ✅ {modalMessage}
              </div>
            )}
            {modalError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}>
                ⚠️ {modalError}
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 6 }}>Email Address</label>
                <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="input-base" placeholder="you@example.com" />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setShowForgotModal(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #0ea5e9, #14b8a6)", border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)",
          padding: "20px",
        }}>
          <div style={{
            background: "var(--modal-bg)", border: "1px solid var(--border-subtle)",
            borderRadius: 20, padding: 32, width: "100%", maxWidth: 400,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>Create New Password</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>Enter your new secure password.</p>

            {modalMessage && (
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#059669" }}>
                ✅ {modalMessage}
              </div>
            )}
            {modalError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}>
                ⚠️ {modalError}
              </div>
            )}

            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 6 }}>New Password</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-base" placeholder="••••••••" />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => {
                  setShowResetModal(false);
                  window.history.replaceState({}, document.title, window.location.pathname);
                }} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #0ea5e9, #14b8a6)", border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}