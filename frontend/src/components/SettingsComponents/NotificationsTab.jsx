/**
 * NotificationsTab Component - Production Grade
 * Comprehensive notification preferences management
 */

import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import { Loader, AlertCircle, Bell, Mail, MessageSquare, Smartphone, Clock } from 'lucide-react';

const REMINDER_TYPES = [
  { id: 'habit_reminders', label: 'Habit Reminders', description: 'Get reminded about your habits', icon: Bell },
  { id: 'task_reminders', label: 'Task Reminders', description: 'Get reminded about upcoming tasks', icon: Bell },
  { id: 'meeting_reminders', label: 'Meeting Reminders', description: 'Get reminded about meetings', icon: Bell },
];

const NOTIFICATION_CHANNELS = [
  { id: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications via email', icon: Mail },
  { id: 'browser_notifications', label: 'Browser Notifications', description: 'Browser push notifications', icon: MessageSquare },
  { id: 'in_app_notifications', label: 'In-App Notifications', description: 'Show notifications in the app', icon: Bell },
  { id: 'push_notifications', label: 'Push Notifications', description: 'Mobile push notifications', icon: Smartphone },
];

export default function NotificationsTab({ onSuccess }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [reminderTime, setReminderTime] = useState('09:00');

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getNotifications();
      setSettings(data);
      setReminderTime(data.reminder_time || '09:00');
    } catch (err) {
      console.error('Error loading notification settings:', err);
      setError('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key, value) => {
    try {
      setSaving(true);
      setError(null);
      const updatedData = { [key]: !value };
      await settingsService.updateNotifications(updatedData);
      setSettings((prev) => ({ ...prev, [key]: !value }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeChange = async (newTime) => {
    try {
      setSaving(true);
      setError(null);
      await settingsService.updateNotifications({ reminder_time: newTime });
      setReminderTime(newTime);
      setSettings((prev) => ({ ...prev, reminder_time: newTime }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update reminder time');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-tab">
        <div className="flex items-center justify-center h-64">
          <Loader size={24} className="animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Notifications</h2>
        <p>Manage how and when you receive notifications</p>
      </div>

      <form className="settings-form">
        {/* Master Notifications Toggle */}
        <div className="form-group bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="form-label text-lg font-semibold text-gray-900">Master Notifications</label>
              <p className="form-description mt-2">Turn all notifications on or off</p>
            </div>
            <label className="toggle-switch flex-shrink-0 ml-4">
              <input
                type="checkbox"
                checked={settings.notifications_enabled}
                onChange={(e) => handleToggle('notifications_enabled', settings.notifications_enabled)}
                disabled={saving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="form-group">
          <label className="form-label text-base font-semibold mb-4 block">Notification Channels</label>
          <p className="form-description mb-4">Choose which channels to receive notifications through</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NOTIFICATION_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.id} className="settings-option border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition">
                  <div className="flex items-start gap-3">
                    <Icon size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <label className="option-label font-medium text-gray-900">{channel.label}</label>
                      <p className="option-description text-sm text-gray-600 mt-1">{channel.description}</p>
                    </div>
                    <label className="toggle-switch flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings[channel.id] || false}
                        onChange={(e) => handleToggle(channel.id, settings[channel.id])}
                        disabled={saving || !settings.notifications_enabled}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reminder Types */}
        <div className="form-group">
          <label className="form-label text-base font-semibold mb-4 block">Reminder Types</label>
          <p className="form-description mb-4">Choose what types of reminders to receive</p>
          
          <div className="space-y-3">
            {REMINDER_TYPES.map((reminder) => {
              const Icon = reminder.icon;
              return (
                <div key={reminder.id} className="settings-option border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <label className="option-label font-medium text-gray-900">{reminder.label}</label>
                        <p className="option-description text-sm text-gray-600 mt-1">{reminder.description}</p>
                      </div>
                    </div>
                    <label className="toggle-switch flex-shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={settings[reminder.id] || false}
                        onChange={(e) => handleToggle(reminder.id, settings[reminder.id])}
                        disabled={saving || !settings.notifications_enabled}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Default Reminder Time */}
        <div className="form-group">
          <label className="form-label flex items-center gap-2 mb-3" htmlFor="reminder-time">
            <Clock size={18} className="text-blue-500" />
            <span>Default Reminder Time</span>
          </label>
          <p className="form-description mb-3">Set the time you want to receive reminders (24-hour format)</p>
          <div className="mt-3">
            <input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={saving || !settings.notifications_enabled}
              className="form-input max-w-xs"
            />
            <p className="text-xs text-gray-500 mt-2">Your reminders will be delivered at {reminderTime} daily</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mt-6">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Notification settings are saved automatically. Changes take effect immediately.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="form-error mt-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
