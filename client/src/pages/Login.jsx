import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

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
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 65%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Left — Branding Panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        position: "relative",
      }}>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          marginBottom: 60,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "white",
            boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
          }}>P</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#f1f0ff" }}>
            PYQs <span style={{ color: "#a78bfa" }}>Coaching</span>
          </span>
        </Link>

        <div className="animate-fade-up">
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            marginBottom: 20,
          }}>
            Your dream score
            <br />
            <span className="gradient-text">starts here.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#8b8aa3", lineHeight: 1.7, maxWidth: 400 }}>
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
                <span style={{ fontSize: 15, color: "#c4c3d8" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}>
        <div className="glass-card animate-fade-up-delay" style={{
          width: "100%",
          maxWidth: 440,
          padding: "48px 44px",
          background: "rgba(19,19,26,0.85)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 6,
            letterSpacing: "-0.5px",
          }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#8b8aa3", marginBottom: 36 }}>
            Sign in to your account to continue
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
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#c4c3d8", marginBottom: 8 }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange("email")}
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#c4c3d8" }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: 13, color: "#a78bfa", fontWeight: 500 }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: "48px" })}
                  onBlur={e => Object.assign(e.target.style, { ...inputStyle, paddingRight: "48px" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", fontSize: 16, cursor: "pointer",
                    color: "#8b8aa3", lineHeight: 1,
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
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 14,
            color: "#8b8aa3",
          }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#a78bfa", fontWeight: 600 }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

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

const inputFocusStyle = {
  ...inputStyle,
  borderColor: "rgba(124,58,237,0.6)",
  background: "rgba(124,58,237,0.08)",
  boxShadow: "0 0 0 3px rgba(124,58,237,0.15)",
};