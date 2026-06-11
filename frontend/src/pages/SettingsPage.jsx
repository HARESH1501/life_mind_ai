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
  Volume2,
  MessageSquare,
  Loader,
} from 'lucide-react';
import '../styles/SettingsPremium.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    updateFromAPI,
  } = useSettingsStore();

  // State Management
  const [activeSection, setActiveSection] = useState('appearance');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Local Form State
  const [formState, setFormState] = useState({
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
    meetingAlertBefore: '15',
    timezone: 'UTC',

    // AI Settings
    aiCoachEnabled: true,
    dailyAiInsights: true,
    expenseAnalysis: true,
    productivitySuggestions: true,
    wellnessRecommendations: true,

    // Profile
    userName: '',
    email: '',
    bio: '',
    profilePicture: null,

    // Security
    twoFactorEnabled: false,
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      if (data) {
        updateFromAPI(data);
        setFormState((prev) => ({
          ...prev,
          theme: data.theme || 'dark',
          accentColor: data.accent_color || 'cyan',
          fontSize: data.font_size || 'medium',
          density: data.ui_density || 'comfortable',
          notificationsEnabled: data.notifications_enabled ?? true,
          habitReminders: data.habit_reminders ?? true,
          taskReminders: data.task_reminders ?? true,
          meetingReminders: data.meeting_reminders ?? true,
          dailySummary: data.daily_summary ?? true,
          browserNotifications: data.browser_notifications ?? true,
          soundNotifications: data.sound_notifications ?? true,
          emailNotifications: data.email_notifications ?? true,
          welcomeEmail: data.welcome_email ?? true,
          habitReminderEmails: data.email_habit_reminders ?? true,
          taskReminderEmails: data.email_task_reminders ?? true,
          meetingReminderEmails: data.email_meeting_reminders ?? true,
          dailySummaryEmail: data.daily_summary_email ?? true,
          reminderTime: data.reminder_time || '09:00',
          meetingAlertBefore: data.meeting_alert_before || '15',
          timezone: data.timezone || 'UTC',
          aiCoachEnabled: data.ai_coach_enabled ?? true,
          dailyAiInsights: data.daily_ai_insights ?? true,
          expenseAnalysis: data.expense_analysis ?? true,
          productivitySuggestions: data.productivity_suggestions ?? true,
          wellnessRecommendations: data.wellness_recommendations ?? true,
          twoFactorEnabled: data.two_factor_enabled ?? false,
        }));
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

  // Convert camelCase to snake_case for API
  const camelToSnake = (str) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  };

  // Convert form state to snake_case for backend API
  const convertFormToAPI = (form) => {
    const converted = {};
    for (const [key, value] of Object.entries(form)) {
      converted[camelToSnake(key)] = value;
    }
    return converted;
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const apiPayload = convertFormToAPI(formState);
      await settingsService.updateSettings(apiPayload);
      setHasChanges(false);
      showToast('Settings saved successfully', 'success');
      loadSettings();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const sections = [
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
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Your profile information',
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
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
            {/* Appearance Section */}
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

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
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
                        'blue',
                        'purple',
                        'green',
                        'red',
                        'pink',
                        'orange',
                        'amber',
                        'cyan',
                        'indigo',
                        'violet',
                      ].map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => {
                            handleInputChange('accentColor', color);
                            setAccentColor(color);
                          }}
                          className={`color-btn ${formState.accentColor === color ? 'active' : ''}`}
                          style={{
                            backgroundColor: getColorValue(color),
                          }}
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

            {/* Notifications Section */}
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

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
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

            {/* Email Section */}
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
                  description="Control which emails you receive"
                />

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
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
                      description="Get onboarding email"
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
                      label="Daily Summary"
                      description="Daily productivity summary email"
                      checked={formState.dailySummaryEmail}
                      onChange={() => handleToggle('dailySummaryEmail')}
                      disabled={!formState.emailNotifications}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Reminders Section */}
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

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
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
                      onChange={(e) => handleInputChange('meetingAlertBefore', e.target.value)}
                      className="select-input"
                    >
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
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
                      <option value="EST">EST</option>
                      <option value="CST">CST</option>
                      <option value="MST">MST</option>
                      <option value="PST">PST</option>
                      <option value="GMT">GMT</option>
                      <option value="IST">IST</option>
                      <option value="JST">JST</option>
                      <option value="AEST">AEST</option>
                    </select>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* AI Coach Section */}
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
                  description="Enable AI assistant features"
                />

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
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
                      description="AI analysis of your expenses"
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
                      description="Wellness and health suggestions"
                      checked={formState.wellnessRecommendations}
                      onChange={() => handleToggle('wellnessRecommendations')}
                      disabled={!formState.aiCoachEnabled}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Profile Section */}
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

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Profile Picture</h3>
                      <p>Upload your profile photo</p>
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
                      />
                    </div>
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>User Name</h3>
                      <p>Your display name</p>
                    </div>
                    <input
                      type="text"
                      value={formState.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      placeholder="Enter your name"
                      className="text-input"
                    />
                  </motion.div>

                  <motion.div className="setting-item" variants={itemVariants}>
                    <div className="setting-header">
                      <h3>Email</h3>
                      <p>Your email address</p>
                    </div>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="text-input"
                    />
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
                    />
                    <p className="char-count">
                      {formState.bio.length}/500 characters
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Security Section */}
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
                  description="Manage your account security"
                />

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card danger">
                      <div className="card-icon">
                        <Lock size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Change Password</h4>
                        <p>Update your password to keep your account secure</p>
                      </div>
                      <button className="btn-secondary">Change</button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <Toggle
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                      checked={formState.twoFactorEnabled}
                      onChange={() => handleToggle('twoFactorEnabled')}
                    />
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <MessageSquare size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Active Sessions</h4>
                        <p>View and manage your active sessions</p>
                      </div>
                      <button className="btn-secondary">Manage</button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card danger">
                      <div className="card-icon">
                        <Lock size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Logout All Devices</h4>
                        <p>Sign out from all your devices</p>
                      </div>
                      <button className="btn-danger">Logout</button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Data Management Section */}
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
                  description="Export and backup your data"
                />

                <motion.div
                  className="settings-grid"
                  variants={containerVariants}
                >
                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Export Expenses</h4>
                        <p>Download your expense data as CSV</p>
                      </div>
                      <button className="btn-secondary">Export</button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Export Habits</h4>
                        <p>Download your habit data as CSV</p>
                      </div>
                      <button className="btn-secondary">Export</button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Export Tasks</h4>
                        <p>Download your task data as CSV</p>
                      </div>
                      <button className="btn-secondary">Export</button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Download Reports</h4>
                        <p>Download your productivity reports</p>
                      </div>
                      <button className="btn-secondary">Download</button>
                    </div>
                  </motion.div>

                  <motion.div className="setting-item full" variants={itemVariants}>
                    <div className="setting-card danger">
                      <div className="card-icon">
                        <Database size={24} />
                      </div>
                      <div className="card-content">
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all data</p>
                      </div>
                      <button className="btn-danger">Delete</button>
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
                You have unsaved changes
              </motion.span>
            )}
          </AnimatePresence>
          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => loadSettings()}>
              Reset
            </button>
            <motion.button
              className={`btn-primary ${!hasChanges ? 'disabled' : ''}`}
              onClick={handleSaveSettings}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <Check size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
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
