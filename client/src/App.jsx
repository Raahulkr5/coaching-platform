import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Courses        from "./pages/Courses";
import About          from "./pages/About";
import AdminDashboard   from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import PrivateRoute     from "./components/PrivateRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about"  element={<About />} />

            {/* Protected Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />

            {/* Protected Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
