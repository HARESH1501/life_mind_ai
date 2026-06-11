import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Wallet,
  CheckSquare,
  Zap,
  Smile,
  Settings,
  LogOut,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import "../styles/Sidebar.css";

export default function Sidebar({ isOpen, isCollapsed, onSettingsClick }) {
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/expenses", label: "Expenses", icon: Wallet },
    { path: "/habits", label: "Habits", icon: CheckSquare },
    { path: "/tasks", label: "Tasks", icon: Zap },
    { path: "/mood", label: "Wellness", icon: Smile },
    { path: "/meetings", label: "Meetings", icon: Calendar },
  ];

  return (
    <motion.aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <h1 className="sidebar-title">LifeMind AI</h1>
        <p className="sidebar-subtitle">Life Optimization</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {isActive && <div className="nav-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-btn settings-btn"
          onClick={onSettingsClick}
          title={isCollapsed ? "Settings" : ""}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button
          className="sidebar-btn logout-btn"
          onClick={logout}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}