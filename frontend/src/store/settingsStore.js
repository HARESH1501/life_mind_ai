import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // ============ PROFILE SETTINGS ============
      fullName: '',
      bio: '',
      profilePictureUrl: null,
      setProfile: (fullName, bio, profilePictureUrl) =>
        set({ fullName, bio, profilePictureUrl }),

      // ============ APPEARANCE SETTINGS ============
      theme: 'dark',
      accentColor: 'cyan',
      fontSize: 'medium',
      density: 'comfortable',
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontSize: (fontSize) => set({ fontSize }),
      setDensity: (density) => set({ density }),

      // ============ NOTIFICATION SETTINGS ============
      notificationsEnabled: true,
      emailNotifications: true,
      browserNotifications: true,
      inAppNotifications: true,
      pushNotifications: true,
      soundNotifications: true,
      habitReminders: true,
      taskReminders: true,
      meetingReminders: true,
      reminderTime: '09:00',
      setNotificationSettings: (settings) => set(settings),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),

      // ============ EMAIL PREFERENCES ============
      emailHabitReminders: true,
      emailTaskReminders: true,
      emailMeetingReminders: true,
      welcomeEmail: true,
      dailySummary: true,
      dailySummaryTime: '08:00',
      dailySummaryEmail: true,
      setEmailSettings: (settings) => set(settings),
      setDailySummary: (dailySummary) => set({ dailySummary }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),

      // ============ REMINDER SETTINGS ============
      meetingAlertBefore: '15',
      setMeetingAlertBefore: (meetingAlertBefore) => set({ meetingAlertBefore }),

      // ============ AI COACH SETTINGS ============
      aiCoachEnabled: true,
      dailyAiInsights: true,
      expenseAnalysis: true,
      productivitySuggestions: true,
      wellnessRecommendations: true,
      setAiCoachSettings: (settings) => set(settings),

      // ============ SECURITY SETTINGS ============
      twoFactorEnabled: false,
      sessionTimeout: 30,
      lastLogin: null,
      lastPasswordChange: null,
      setSecuritySettings: (settings) => set(settings),

      // ============ PREFERENCES ============
      language: 'en',
      timezone: 'UTC',
      setLanguage: (language) => set({ language }),
      setTimezone: (timezone) => set({ timezone }),

      // ============ UI STATE ============
      sidebarMode: 'expanded',
      setSidebarMode: (sidebarMode) => set({ sidebarMode }),
      neonGlow: true,
      setNeonGlow: (neonGlow) => set({ neonGlow }),
      backgroundAnimation: true,
      setBackgroundAnimation: (backgroundAnimation) => set({ backgroundAnimation }),

      // ============ COMBINED UPDATE ============
      updateSettings: (updates) => set(updates),
      updateFromAPI: (apiSettings) =>
        set({
          fullName: apiSettings.full_name || '',
          bio: apiSettings.bio || '',
          profilePictureUrl: apiSettings.profile_picture_url || null,
          theme: apiSettings.theme || 'dark',
          accentColor: apiSettings.accent_color || 'cyan',
          fontSize: apiSettings.font_size || 'medium',
          density: apiSettings.ui_density || 'comfortable',
          notificationsEnabled: apiSettings.notifications_enabled ?? true,
          emailNotifications: apiSettings.email_notifications ?? true,
          browserNotifications: apiSettings.browser_notifications ?? true,
          inAppNotifications: apiSettings.in_app_notifications ?? true,
          pushNotifications: apiSettings.push_notifications ?? true,
          soundNotifications: apiSettings.sound_notifications ?? true,
          habitReminders: apiSettings.habit_reminders ?? true,
          taskReminders: apiSettings.task_reminders ?? true,
          meetingReminders: apiSettings.meeting_reminders ?? true,
          reminderTime: apiSettings.reminder_time || '09:00',
          emailHabitReminders: apiSettings.email_habit_reminders ?? true,
          emailTaskReminders: apiSettings.email_task_reminders ?? true,
          emailMeetingReminders: apiSettings.email_meeting_reminders ?? true,
          welcomeEmail: apiSettings.welcome_email ?? true,
          dailySummary: apiSettings.daily_summary ?? true,
          dailySummaryTime: apiSettings.daily_summary_time || '08:00',
          dailySummaryEmail: apiSettings.daily_summary_email ?? true,
          meetingAlertBefore: apiSettings.meeting_alert_before?.toString() || '15',
          aiCoachEnabled: apiSettings.ai_coach_enabled ?? true,
          dailyAiInsights: apiSettings.daily_ai_insights ?? true,
          expenseAnalysis: apiSettings.expense_analysis ?? true,
          productivitySuggestions: apiSettings.productivity_suggestions ?? true,
          wellnessRecommendations: apiSettings.wellness_recommendations ?? true,
          language: apiSettings.language || 'en',
          timezone: apiSettings.timezone || 'UTC',
          twoFactorEnabled: apiSettings.two_factor_enabled ?? false,
          sessionTimeout: apiSettings.session_timeout || 30,
          lastLogin: apiSettings.last_login || null,
          lastPasswordChange: apiSettings.last_password_change || null,
        }),

      // ============ GETTERS ============
      getAllSettings: () => get(),
    }),
    {
      name: 'lifemind-settings',
      storage: localStorage,
    }
  )
);
