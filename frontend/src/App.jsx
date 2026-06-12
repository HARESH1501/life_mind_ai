import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useEffect, useRef, useState } from "react";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import HabitsPage from "./pages/HabitsPage";
import TasksPage from "./pages/TasksPage";
import MoodPage from "./pages/MoodPage";
import SettingsPage from "./pages/SettingsPage";
import MeetingsPage from "./pages/MeetingsPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const { user, token } = useAuthStore();
  const hasCheckedUser = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    const isDark = initialTheme === "dark";

    document.documentElement.setAttribute("data-theme", initialTheme);
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    if (!savedTheme) {
      localStorage.setItem("theme", initialTheme);
      localStorage.setItem("darkMode", isDark);
    }

    // Check if user is logged in on mount (only once)
    if (token && !user && !hasCheckedUser.current) {
      hasCheckedUser.current = true;
      useAuthStore.getState().getCurrentUser().catch(() => {
        useAuthStore.getState().logout();
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            token ? (
              <div className="app-layout">
                <Sidebar
                  isOpen={sidebarOpen}
                  isCollapsed={sidebarCollapsed}
                />
                <div className="app-main" style={{ marginLeft: sidebarCollapsed ? "80px" : "280px" }}>
                  <Navbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                  />
                  <main className="app-content">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/expenses" element={<ExpensesPage />} />
                      <Route path="/habits" element={<HabitsPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/mood" element={<MoodPage />} />
                      <Route path="/meetings" element={<MeetingsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;