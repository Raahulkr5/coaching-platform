import { Navigate } from "react-router-dom";

/**
 * Wraps a route so only authenticated users (valid token in localStorage) can access it.
 * Everyone else is redirected to /login.
 */
/**
 * Wraps a route so only authenticated users can access it.
 * Supports role-based protection for Admin routes.
 */
export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
