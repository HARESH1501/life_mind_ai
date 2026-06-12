/**
 * SettingsPage - Premium SaaS Grade Settings Panel
 * Similar to Notion, Linear, Slack, Motion AI
 * Production-grade with glassmorphism design
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import settingsService from '../services/settingsService';
import {
  X,
  Check,
  AlertCircle,
  Save,
  Palette,
  Bell,
  Mail,
  Clock,
  Zap,
  User,
  Lock,
  Database,
  Settings as SettingsIcon,
  ChevronRight,
  Sun,
  Moon,
  Sliders,
  Loader,
  Send,
  Download,
  Trash2,
  Shield,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';
import '../styles/SettingsPremium.css';

export default function SettingsPage() {
  const { logout } = useAuthStore();
  const {
    setTheme,
    setAccentColor,
    updateFromAPI,
  } = useSettingsStore();

  // State Management
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Action loading states
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  // Local Form State
  const [formState, setFormState] = useState({
    // Profile
    userName: '',
    email: '',
    bio: '',
    profilePicture: null,

    // Appearance
    theme: 'dark',
    accentColor: 'cyan',
    fontSize: 'medium',
    density: 'comfortable',

    // Notifications
    notificationsEnabled: true,
    habitReminders: true,
    taskReminders: true,
    meetingReminders: true,
    dailySummary: true,
    browserNotifications: true,
    soundNotifications: true,

    // Email
    emailNotifications: true,
    welcomeEmail: true,
    habitReminderEmails: true,
    taskReminderEmails: true,
    meetingReminderEmails: true,
    dailySummaryEmail: true,

    // Reminders
    reminderTime: '09:00',
    meetingAlertBefore: 15,
    timezone: 'UTC',

    // AI Settings
    aiCoachEnabled: true,
    dailyAiInsights: true,
    expenseAnalysis: true,
    productivitySuggestions: true,
    wellnessRecommendations: true,

    // Security
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Load general settings and profile in parallel
      const [data, profile] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getProfile().catch(() => null),
      ]);

      if (data) {
        updateFromAPI(data);
        setFormState((prev) => ({
          ...prev,
          // Profile from User model
          userName: profile?.full_name || profile?.username || '',
          email: profile?.email || '',
          // Bio from settings
          bio: data.bio || '',
          profilePicture: data.profile_picture_url || null,
          // Appearance
          theme: data.theme || 'dark',
          accentColor: data.accent_color || 'cyan',
          fontSize: data.font_size || 'medium',
          density: data.ui_density || 'comfortable',
          // Notifications
          notificationsEnabled: data.notifications_enabled ?? true,
          habitReminders: data.habit_reminders ?? true,
          taskReminders: data.task_reminders ?? true,
          meetingReminders: data.meeting_reminders ?? true,
          dailySummary: data.daily_summary ?? true,
          browserNotifications: data.browser_notifications ?? true,
          soundNotifications: data.sound_notifications ?? true,
          // Email
          emailNotifications: data.email_notifications ?? true,
          welcomeEmail: data.welcome_email ?? true,
          habitReminderEmails: data.email_habit_reminders ?? true,
          taskReminderEmails: data.email_task_reminders ?? true,
          meetingReminderEmails: data.email_meeting_reminders ?? true,
          dailySummaryEmail: data.daily_summary_email ?? true,
          // Reminders
          reminderTime: data.reminder_time || '09:00',
          meetingAlertBefore: Number(data.meeting_alert_before) || 15,
          timezone: data.timezone || 'UTC',
          // AI
          aiCoachEnabled: data.ai_coach_enabled ?? true,
          dailyAiInsights: data.daily_ai_insights ?? true,
          expenseAnalysis: data.expense_analysis ?? true,
          productivitySuggestions: data.productivity_suggestions ?? true,
          wellnessRecommendations: data.wellness_recommendations ?? true,
          // Security
          twoFactorEnabled: data.two_factor_enabled ?? false,
          sessionTimeout: data.session_timeout ?? 30,
        }));
        // Reset hasChanges after load
        setHasChanges(false);
      }
    } catch (error) {
      showToast('Failed to load settings', 'error');
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleToggle = (field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setHasChanges(true);
  };

  // Save Profile — uses dedicated /settings/profile endpoint
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await settingsService.updateProfile({
        full_name: formState.userName,
        bio: formState.bio,
      });
      setHasChanges(false);
      showToast('Profile saved successfully', 'success');
      loadSettings();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save general settings (appearance, notifications, email, reminders, AI, security)
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({
        // Appearance
        theme: formState.theme,
        accent_color: formState.accentColor,
        font_size: formState.fontSize,
        ui_density: formState.density,
        // Notifications
        notifications_enabled: formState.notificationsEnabled,
        habit_reminders: formState.habitReminders,
        task_reminders: formState.taskReminders,
        meeting_reminders: formState.meetingReminders,
        daily_summary: formState.dailySummary,
        browser_notifications: formState.browserNotifications,
        sound_notifications: formState.soundNotifications,
        // Email
        email_notifications: formState.emailNotifications,
        welcome_email: formState.welcomeEmail,
        email_habit_reminders: formState.habitReminderEmails,
        email_task_reminders: formState.taskReminderEmails,
        email_meeting_reminders: formState.meetingReminderEmails,
        daily_summary_email: formState.dailySummaryEmail,
        // Reminders
        reminder_time: formState.reminderTime,
        meeting_alert_before: Number(formState.meetingAlertBefore),
        timezone: formState.timezone,
        // AI
        ai_coach_enabled: formState.aiCoachEnabled,
        daily_ai_insights: formState.dailyAiInsights,
        expense_analysis: formState.expenseAnalysis,
        productivity_suggestions: formState.productivitySuggestions,
        wellness_recommendations: formState.wellnessRecommendations,
        // Security
        two_factor_enabled: formState.twoFactorEnabled,
        session_timeout: Number(formState.sessionTimeout),
      });
      setHasChanges(false);
      showToast('Settings saved successfully', 'success');
      loadSettings();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      setSavingPassword(true);
      await settingsService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // Logout all devices
  const handleLogoutAllDevices = async () => {
    try {
      setLoggingOutAll(true);
      await settingsService.logoutAllDevices();
      showToast('Logged out from all devices', 'success');
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to logout all devices', 'error');
    } finally {
      setLoggingOutAll(false);
    }
  };

  // Send test email
  const handleSendTestEmail = async () => {
    try {
      setSendingTestEmail(true);
      await settingsService.testEmail();
      showToast('Test email sent! Check your inbox.', 'success');
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to send test email', 'error');
    } finally {
      setSendingTestEmail(false);
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      setExportingData(true);
      await settingsService.exportData();
      showToast('Data export initiated — check your email for the download link', 'success');
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to export data', 'error');
    } finally {
      setExportingData(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showToast('Please enter your password to confirm', 'error');
      return;
    }
    try {
      setDeletingAccount(true);
      await settingsService.deleteAccount({
        password: deletePassword,
        confirmation: true,
      });
      showToast('Account deleted successfully', 'success');
      setTimeout(() => logout(), 2000);
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to delete account', 'error');
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const sections = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Your profile information',
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      description: 'Theme, colors, and UI preferences',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Notification channels and preferences',
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Email notification preferences',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Clock,
      description: 'Reminder times and settings',
    },
    {
      id: 'ai',
      label: 'AI Coach',
      icon: Zap,
      description: 'AI assistant and insights settings',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Lock,
      description: 'Password and security options',
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: Database,
      description: 'Export and backup options',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="settings-premium-container">
        <div className="loading-state">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader size={40} className="text-accent" />
          </motion.div>
          <p>Loading your settings...</p>
        </div>
      </div>
    );
  }

  // Determine whether to use profile save or general save
  const isProfileSection = activeSection === 'profile';
  const handlePrimarySave = isProfileSection ? handleSaveProfile : handleSaveSettings;

  return (
    <div className="settings-premium-container">
      {/* Header */}
      <motion.div
        className="settings-header-premium"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="header-content">
          <SettingsIcon size={32} className="text-accent" />
          <div>
            <h1>Settings</h1>
            <p>Customize your LifeMind experience</p>
          </div>
        </div>
      </motion.div>

      <div className="settings-main-grid">
        {/* Sidebar Navigation */}
        <motion.div
          className="settings-sidebar-premium"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <nav className="sections-nav">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="nav-icon">
                    <Icon size={20} />
                  </div>
                  <div className="nav-text">
                    <div className="nav-label">{section.label}</div>
                    <div className="nav-description">{section.description}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      className="nav-indicator"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="settings-content-premium"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={activeSection}
        >
          <AnimatePresence mode="wait">

            {/* ====== PROFILE SECTION ====== */}
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Profile Settings"
                  description="Update your profile information"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Profile Picture</h3>
                      <p>Upload your profile photo (max 5MB)</p>
                    </div>
                    <div className="profile-picture-upload">
                      <div className="picture-preview">
                        {formState.profilePicture ? (
                          <img
                            src={formState.profilePicture}
                            alt="Profile"
                            className="preview-img"
                          />
                        ) : (
                          <div className="placeholder">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              handleInputChange('profilePicture', event.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="file-input"
                        id="profile-picture-input"
                      />
                      <label htmlFor="profile-picture-input" className="btn-secondary file-label">
                        Choose Photo
                      </label>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Full Name</h3>
                      <p>Your display name</p>
                    </div>
                    <input
                      type="text"
                      value={formState.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      placeholder="Enter your full name"
                      className="text-input"
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Email</h3>
                      <p>Your account email address</p>
                    </div>
                    <input
                      type="email"
                      value={formState.email}
                      readOnly
                      placeholder="your@email.com"
                      className="text-input readonly"
                      title="Email cannot be changed here"
                    />
                    <p className="field-hint">Email cannot be changed</p>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Bio</h3>
                      <p>Tell us about yourself (max 500 characters)</p>
                    </div>
                    <textarea
                      value={formState.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Write something about yourself..."
                      className="textarea-input"
                      maxLength={500}
                      rows={4}
                    />
                    <p className="char-count">
                      {(formState.bio || '').length}/500 characters
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== APPEARANCE SECTION ====== */}
            {activeSection === 'appearance' && (
              <motion.div
                key="appearance"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Appearance"
                  description="Customize how LifeMind looks and feels"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  {/* Theme Selection */}
                  <motion.div className="setting-item large" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Theme</h3>
                      <p>Choose your preferred color scheme</p>
                    </div>
                    <div className="theme-selector">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Sliders },
                      ].map((t) => (
                        <motion.button
                          key={t.value}
                          onClick={() => {
                            handleInputChange('theme', t.value);
                            setTheme(t.value);
                            // Apply theme to DOM immediately
                            const themeToApply = t.value === 'system'
                              ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                              : t.value;
                            document.documentElement.setAttribute('data-theme', themeToApply);
                            if (themeToApply === 'dark') {
                              document.body.classList.add('dark-mode');
                            } else {
                              document.body.classList.remove('dark-mode');
                            }
                            localStorage.setItem('theme', t.value);
                          }}
                          className={`theme-btn ${formState.theme === t.value ? 'active' : ''}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <t.icon size={24} />
                          <span>{t.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Accent Color */}
                  <motion.div className="setting-item large" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Accent Color</h3>
                      <p>Choose your accent color</p>
                    </div>
                    <div className="color-grid">
                      {[
                        'blue', 'purple', 'green', 'red', 'pink',
                        'orange', 'amber', 'cyan', 'indigo', 'violet',
                      ].map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => {
                            handleInputChange('accentColor', color);
                            setAccentColor(color);
                            // Apply accent color to CSS variable immediately
                            const colorValue = getColorValue(color);
                            document.documentElement.style.setProperty('--accent-color', colorValue);
                          }}
                          className={`color-btn ${formState.accentColor === color ? 'active' : ''}`}
                          style={{ backgroundColor: getColorValue(color) }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={color}
                        >
                          {formState.accentColor === color && <Check size={16} />}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Font Size */}
                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Font Size</h3>
                      <p>Adjust text size for readability</p>
                    </div>
                    <select
                      value={formState.fontSize}
                      onChange={(e) => handleInputChange('fontSize', e.target.value)}
                      className="select-input"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </motion.div>

                  {/* UI Density */}
                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>UI Density</h3>
                      <p>Comfortable or compact layout</p>
                    </div>
                    <select
                      value={formState.density}
                      onChange={(e) => handleInputChange('density', e.target.value)}
                      className="select-input"
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== NOTIFICATIONS SECTION ====== */}
            {activeSection === 'notifications' && (
              <motion.div
                key="notifications"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Notifications"
                  description="Control how you receive notifications"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <Toggle
                      label="Enable All Notifications"
                      description="Master toggle for all notifications"
                      checked={formState.notificationsEnabled}
                      onChange={() => handleToggle('notificationsEnabled')}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Habit Reminders"
                      description="Get reminded about your habits"
                      checked={formState.habitReminders}
                      onChange={() => handleToggle('habitReminders')}
                      disabled={!formState.notificationsEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Task Reminders"
                      description="Get reminded about tasks"
                      checked={formState.taskReminders}
                      onChange={() => handleToggle('taskReminders')}
                      disabled={!formState.notificationsEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Meeting Reminders"
                      description="Get reminded about meetings"
                      checked={formState.meetingReminders}
                      onChange={() => handleToggle('meetingReminders')}
                      disabled={!formState.notificationsEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Daily Summary"
                      description="Receive daily summary notifications"
                      checked={formState.dailySummary}
                      onChange={() => handleToggle('dailySummary')}
                      disabled={!formState.notificationsEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Browser Notifications"
                      description="Show desktop notifications"
                      checked={formState.browserNotifications}
                      onChange={() => handleToggle('browserNotifications')}
                      disabled={!formState.notificationsEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Sound Notifications"
                      description="Play sound for notifications"
                      checked={formState.soundNotifications}
                      onChange={() => handleToggle('soundNotifications')}
                      disabled={!formState.notificationsEnabled}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== EMAIL SECTION ====== */}
            {activeSection === 'email' && (
              <motion.div
                key="email"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Email Preferences"
                  description="Control which emails you receive from LifeMind"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <Toggle
                      label="Email Notifications"
                      description="Receive emails from LifeMind"
                      checked={formState.emailNotifications}
                      onChange={() => handleToggle('emailNotifications')}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Welcome Email"
                      description="Get onboarding email on signup"
                      checked={formState.welcomeEmail}
                      onChange={() => handleToggle('welcomeEmail')}
                      disabled={!formState.emailNotifications}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Habit Reminders"
                      description="Habit reminder emails"
                      checked={formState.habitReminderEmails}
                      onChange={() => handleToggle('habitReminderEmails')}
                      disabled={!formState.emailNotifications}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Task Reminders"
                      description="Task reminder emails"
                      checked={formState.taskReminderEmails}
                      onChange={() => handleToggle('taskReminderEmails')}
                      disabled={!formState.emailNotifications}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Meeting Reminders"
                      description="Meeting reminder emails"
                      checked={formState.meetingReminderEmails}
                      onChange={() => handleToggle('meetingReminderEmails')}
                      disabled={!formState.emailNotifications}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Daily Summary Email"
                      description="Daily productivity summary email"
                      checked={formState.dailySummaryEmail}
                      onChange={() => handleToggle('dailySummaryEmail')}
                      disabled={!formState.emailNotifications}
                    />
                  </motion.div>

                  {/* Test Email Button */}
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Send size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Send Test Email</h4>
                        <p>Verify your email configuration is working correctly</p>
                      </div>
                      <motion.button
                        className="btn-secondary"
                        onClick={handleSendTestEmail}
                        disabled={sendingTestEmail}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {sendingTestEmail ? (
                          <><Loader size={15} className="animate-spin" /> Sending...</>
                        ) : (
                          'Send Test'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== REMINDERS SECTION ====== */}
            {activeSection === 'reminders' && (
              <motion.div
                key="reminders"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Reminder Settings"
                  description="Configure reminder times and alerts"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Default Reminder Time</h3>
                      <p>Time when you want to receive reminders</p>
                    </div>
                    <input
                      type="time"
                      value={formState.reminderTime}
                      onChange={(e) => handleInputChange('reminderTime', e.target.value)}
                      className="input-time"
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Meeting Alert Before</h3>
                      <p>Minutes before meeting to alert you</p>
                    </div>
                    <select
                      value={formState.meetingAlertBefore}
                      onChange={(e) => handleInputChange('meetingAlertBefore', Number(e.target.value))}
                      className="select-input"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Timezone</h3>
                      <p>Your timezone for reminders</p>
                    </div>
                    <select
                      value={formState.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="select-input"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST (UTC-5)</option>
                      <option value="CST">CST (UTC-6)</option>
                      <option value="MST">MST (UTC-7)</option>
                      <option value="PST">PST (UTC-8)</option>
                      <option value="GMT">GMT (UTC+0)</option>
                      <option value="IST">IST (UTC+5:30)</option>
                      <option value="JST">JST (UTC+9)</option>
                      <option value="AEST">AEST (UTC+10)</option>
                    </select>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== AI COACH SECTION ====== */}
            {activeSection === 'ai' && (
              <motion.div
                key="ai"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="AI Coach Settings"
                  description="Personalize your AI assistant experience"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <Toggle
                      label="Enable AI Coach"
                      description="Activate your personal AI assistant"
                      checked={formState.aiCoachEnabled}
                      onChange={() => handleToggle('aiCoachEnabled')}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Daily AI Insights"
                      description="Get daily insights and analysis"
                      checked={formState.dailyAiInsights}
                      onChange={() => handleToggle('dailyAiInsights')}
                      disabled={!formState.aiCoachEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Expense Analysis"
                      description="AI analysis of your spending patterns"
                      checked={formState.expenseAnalysis}
                      onChange={() => handleToggle('expenseAnalysis')}
                      disabled={!formState.aiCoachEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Productivity Suggestions"
                      description="Get AI productivity recommendations"
                      checked={formState.productivitySuggestions}
                      onChange={() => handleToggle('productivitySuggestions')}
                      disabled={!formState.aiCoachEnabled}
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <Toggle
                      label="Wellness Recommendations"
                      description="Personalized wellness and health suggestions"
                      checked={formState.wellnessRecommendations}
                      onChange={() => handleToggle('wellnessRecommendations')}
                      disabled={!formState.aiCoachEnabled}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== SECURITY SECTION ====== */}
            {activeSection === 'security' && (
              <motion.div
                key="security"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Security Settings"
                  description="Manage your account security and access"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  {/* Two-Factor Auth */}
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <Toggle
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                      checked={formState.twoFactorEnabled}
                      onChange={() => handleToggle('twoFactorEnabled')}
                    />
                  </motion.div>

                  {/* Session Timeout */}
                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Session Timeout</h3>
                      <p>Auto-logout after inactivity</p>
                    </div>
                    <select
                      value={formState.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
                      className="select-input"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                      <option value={1440}>24 hours</option>
                    </select>
                  </motion.div>

                  {/* Change Password — Inline Form */}
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="password-change-card">
                      <div className="card-title-row">
                        <Lock size={20} />
                        <h4>Change Password</h4>
                      </div>
                      <p className="card-subtitle">Use a strong password with uppercase, lowercase letters and numbers</p>

                      <div className="password-fields">
                        <PasswordField
                          label="Current Password"
                          value={passwordForm.currentPassword}
                          onChange={(v) => setPasswordForm(p => ({ ...p, currentPassword: v }))}
                          show={showPasswords.current}
                          onToggleShow={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                          placeholder="Enter current password"
                        />
                        <PasswordField
                          label="New Password"
                          value={passwordForm.newPassword}
                          onChange={(v) => setPasswordForm(p => ({ ...p, newPassword: v }))}
                          show={showPasswords.new}
                          onToggleShow={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                          placeholder="Enter new password (min 8 chars)"
                        />
                        <PasswordField
                          label="Confirm New Password"
                          value={passwordForm.confirmPassword}
                          onChange={(v) => setPasswordForm(p => ({ ...p, confirmPassword: v }))}
                          show={showPasswords.confirm}
                          onToggleShow={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <motion.button
                        className="btn-primary"
                        onClick={handleChangePassword}
                        disabled={savingPassword}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                      >
                        {savingPassword ? (
                          <><Loader size={16} className="animate-spin" /> Changing...</>
                        ) : (
                          <><Shield size={16} /> Change Password</>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Logout All Devices */}
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card warning">
                      <div className="card-icon">
                        <LogOut size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Logout All Devices</h4>
                        <p>Sign out from all your active sessions and devices</p>
                      </div>
                      <motion.button
                        className="btn-warning"
                        onClick={handleLogoutAllDevices}
                        disabled={loggingOutAll}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loggingOutAll ? (
                          <><Loader size={15} className="animate-spin" /> Logging out...</>
                        ) : (
                          'Logout All'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ====== DATA MANAGEMENT SECTION ====== */}
            {activeSection === 'data' && (
              <motion.div
                key="data"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="settings-section"
              >
                <SectionHeader
                  title="Data Management"
                  description="Export, backup, and manage your personal data"
                />

                <motion.div className="settings-grid" variants={containerVariants}>
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Download size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Export All Data</h4>
                        <p>Download all your data (habits, tasks, expenses, mood) as a ZIP file</p>
                      </div>
                      <motion.button
                        className="btn-secondary"
                        onClick={handleExportData}
                        disabled={exportingData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {exportingData ? (
                          <><Loader size={15} className="animate-spin" /> Exporting...</>
                        ) : (
                          'Export'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Export Expenses</h4>
                        <p>Download your expense data as CSV</p>
                      </div>
                      <motion.button
                        className="btn-secondary"
                        onClick={handleExportData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Export CSV
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Export Habits &amp; Tasks</h4>
                        <p>Download your habits and task data as CSV</p>
                      </div>
                      <motion.button
                        className="btn-secondary"
                        onClick={handleExportData}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Export CSV
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Danger Zone */}
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="danger-zone">
                      <div className="danger-zone-header">
                        <Trash2 size={20} className="text-red" />
                        <h4>Danger Zone</h4>
                      </div>
                      <div className="setting-card danger">
                        <div className="card-icon">
                          <Trash2 size={24} />
                        </div>
                        <div className="card-content">
                          <h4>Delete Account</h4>
                          <p>Permanently delete your account and all associated data. This cannot be undone.</p>
                        </div>
                        <motion.button
                          className="btn-danger"
                          onClick={() => setShowDeleteModal(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        className="settings-action-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="action-bar-content">
          <AnimatePresence>
            {hasChanges && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="unsaved-indicator"
              >
                ● You have unsaved changes
              </motion.span>
            )}
          </AnimatePresence>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => loadSettings()}>
              Reset
            </button>
            <motion.button
              className={`btn-primary ${!hasChanges ? 'disabled' : ''}`}
              onClick={handlePrimarySave}
              disabled={!hasChanges || saving}
              whileHover={hasChanges ? { scale: 1.02 } : {}}
              whileTap={hasChanges ? { scale: 0.98 } : {}}
            >
              {saving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast-premium ${toast.type}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <Check size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="modal-card danger-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <Trash2 size={24} className="text-red" />
                <h3>Delete Account</h3>
              </div>
              <p className="modal-description">
                This will permanently delete your account and all your data (habits, tasks, expenses, mood entries). <strong>This action cannot be undone.</strong>
              </p>
              <div className="modal-field">
                <label>Enter your password to confirm:</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your current password"
                  className="text-input"
                />
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <motion.button
                  className="btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount || !deletePassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {deletingAccount ? (
                    <><Loader size={15} className="animate-spin" /> Deleting...</>
                  ) : (
                    'Delete My Account'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ====== HELPER COMPONENTS ======

function SectionHeader({ title, description }) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
    </motion.div>
  );
}

function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <div className={`toggle-item ${disabled ? 'disabled' : ''}`}>
      <div className="toggle-text">
        <h4>{label}</h4>
        <p>{description}</p>
      </div>
      <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggleShow, placeholder }) {
  return (
    <div className="password-field-group">
      <label className="field-label">{label}</label>
      <div className="password-input-wrapper">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-input"
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={onToggleShow}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function getColorValue(color) {
  const colors = {
    blue: '#3B82F6',
    purple: '#A855F7',
    green: '#10B981',
    red: '#EF4444',
    pink: '#EC4899',
    orange: '#F97316',
    amber: '#FBBF24',
    cyan: '#06B6D4',
    indigo: '#4F46E5',
    violet: '#8B5CF6',
  };
  return colors[color] || '#3B82F6';
}
