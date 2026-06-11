/**
 * EmailPreferencesTab Component - Production Grade
 * Email notification and daily summary preferences
 */

import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import { Loader, AlertCircle, Mail, CheckCircle2, Clock, Send } from 'lucide-react';

const EMAIL_OPTIONS = [
  { id: 'email_habit_reminders', label: 'Habit Reminders', description: 'Email when habits are due' },
  { id: 'email_task_reminders', label: 'Task Reminders', description: 'Email when tasks are due' },
  { id: 'email_meeting_reminders', label: 'Meeting Reminders', description: 'Email before meetings' },
];

export default function EmailPreferencesTab({ onSuccess }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dailySummaryTime, setDailySummaryTime] = useState('08:00');

  useEffect(() => {
    loadEmailPreferences();
  }, []);

  const loadEmailPreferences = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getEmailPreferences();
      setSettings(data);
      setDailySummaryTime(data.daily_summary_time || '08:00');
    } catch (err) {
      console.error('Error loading email preferences:', err);
      setError('Failed to load email preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key, value) => {
    try {
      setSaving(true);
      setError(null);
      const updatedData = { [key]: !value };
      await settingsService.updateEmailPreferences(updatedData);
      setSettings((prev) => ({ ...prev, [key]: !value }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update email preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDailySummaryToggle = async (value) => {
    try {
      setSaving(true);
      setError(null);
      await settingsService.updateEmailPreferences({ daily_summary: !value });
      setSettings((prev) => ({ ...prev, daily_summary: !value }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update daily summary settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDailySummaryTimeChange = async (newTime) => {
    try {
      setSaving(true);
      setError(null);
      await settingsService.updateEmailPreferences({ daily_summary_time: newTime });
      setDailySummaryTime(newTime);
      setSettings((prev) => ({ ...prev, daily_summary_time: newTime }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update daily summary time');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      setError(null);
      setSuccess(null);
      await settingsService.testEmail();
      setSuccess('Test email sent successfully! Check your inbox.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send test email');
    } finally {
      setTestingEmail(false);
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
        <h2>Email Preferences</h2>
        <p>Control which emails and notifications you receive</p>
      </div>

      <form className="settings-form">
        {/* Email Notification Types */}
        <div className="form-group">
          <label className="form-label text-base font-semibold mb-4 block">Email Notification Types</label>
          <p className="form-description mb-4">Choose which emails to receive</p>
          
          <div className="space-y-3">
            {EMAIL_OPTIONS.map((option) => (
              <div key={option.id} className="settings-option border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Mail size={20} className="text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <label className="option-label font-medium text-gray-900">{option.label}</label>
                      <p className="option-description text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                  <label className="toggle-switch flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={settings[option.id] || false}
                      onChange={(e) => handleToggle(option.id, settings[option.id])}
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Summary */}
        <div className="form-group bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={20} className="text-orange-500" />
                <label className="form-label text-base font-semibold text-gray-900">Daily Summary Email</label>
              </div>
              <p className="form-description">Get a daily summary of your activities and insights</p>
            </div>
            <label className="toggle-switch flex-shrink-0 ml-4">
              <input
                type="checkbox"
                checked={settings.daily_summary || false}
                onChange={(e) => handleDailySummaryToggle(settings.daily_summary)}
                disabled={saving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Daily Summary Time */}
          {settings.daily_summary && (
            <div className="mt-4 pt-4 border-t border-orange-200">
              <label className="form-label flex items-center gap-2 mb-3" htmlFor="summary-time">
                <Clock size={18} className="text-orange-500" />
                <span>Summary Delivery Time</span>
              </label>
              <input
                id="summary-time"
                type="time"
                value={dailySummaryTime}
                onChange={(e) => handleDailySummaryTimeChange(e.target.value)}
                disabled={saving}
                className="form-input max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">You'll receive your daily summary at {dailySummaryTime}</p>
            </div>
          )}
        </div>

        {/* Test Email Section */}
        <div className="form-group bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 size={24} className="text-green-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Test Email Connection</h3>
              <p className="text-sm text-gray-700 mb-4">
                Send a test email to verify your email notification settings are working correctly.
              </p>
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={testingEmail || saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {testingEmail ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Email Privacy</p>
            <p className="text-xs text-blue-800">
              We respect your privacy. You can unsubscribe from any email at any time using the link in the email footer.
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="form-error mt-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 text-green-800 mt-4">
            <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{success}</span>
          </div>
        )}
      </form>
    </div>
  );
}
