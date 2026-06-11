/**
 * Notification Center Component
 * Displays notifications and alerts
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/NotificationCenter.css';

export default function NotificationCenter() {
  const { notifications, removeNotification, clearNotifications } = useNotificationStore();
  const [showCenter, setShowCenter] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getNotificationClass = (type) => {
    return `notification notification-${type || 'info'}`;
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="notification-bell">
        <button
          className="bell-button"
          onClick={() => setShowCenter(!showCenter)}
        >
          <Bell size={24} />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>

        {/* Notification Center Dropdown */}
        <AnimatePresence>
          {showCenter && (
            <motion.div
              className="notification-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="notification-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    className="clear-button"
                    onClick={clearNotifications}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <p className="empty-state">No notifications</p>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={getNotificationClass(notification.type)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="notification-icon">
                          {getIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                        </div>
                        <button
                          className="notification-close"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notifications */}
      <div className="notification-toast-container">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={getNotificationClass(notification.type)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="notification-icon">
                {getIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
              </div>
              <button
                className="notification-close"
                onClick={() => removeNotification(notification.id)}
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
