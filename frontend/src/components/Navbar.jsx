import { motion } from "framer-motion";
import { Bell, Search, Menu, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import "../styles/Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) {
  const { user } = useAuthStore();

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="navbar-left">
        {/* Sidebar Toggle Button */}
        <motion.button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <Menu size={20} /> : <Menu size={20} />}
        </motion.button>

        {/* Search Box */}
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.full_name || user?.username}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}