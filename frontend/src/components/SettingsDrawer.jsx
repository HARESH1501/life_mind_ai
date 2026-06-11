import { motion } from "framer-motion";
import { ChevronLeft, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/SettingsDrawer.css";

export default function SettingsDrawer({ isOpen, onClose }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <motion.div
      className="settings-drawer"
      initial={{ x: 320 }}
      animate={{ x: isOpen ? 0 : 320 }}
      transition={{ duration: 0.3 }}
    >
      <div className="settings-header">
        <button className="back-btn" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <h2 className="settings-title">Settings</h2>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3 className="section-title">
            <Palette size={16} />
            Theme
          </h3>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(e) => setTheme(e.target.value)}
              />
              <span className="radio-label">Light</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.value)}
              />
              <span className="radio-label">Dark</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={(e) => setTheme(e.target.value)}
              />
              <span className="radio-label">System</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}