/**
 * Meetings & Reminders Scheduler Page
 * Enables users to schedule meetings and create custom automated alerts
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Plus, Trash2, BellRing, Video } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/MeetingsPage.css';

export default function MeetingsPage() {
  const {
    meetings,
    reminders,
    createMeeting,
    createReminder,
    deleteMeeting,
    deleteReminder,
    fetchMeetings,
    fetchReminders,
    isLoading,
    error,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState('meetings');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Form states
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    attendees: '',
  });

  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    reminder_type: 'reminder',
    scheduled_time: '',
  });

  useEffect(() => {
    fetchMeetings().catch(err => console.error("Error fetching meetings:", err));
    fetchReminders().catch(err => console.error("Error fetching reminders:", err));
  }, []);

  const handleMeetingChange = (e) => {
    const { name, value } = e.target;
    setMeetingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setReminderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.start_time) return;

    try {
      // Format datetime to ISO
      const startIso = new Date(meetingForm.start_time).toISOString();
      const endIso = meetingForm.end_time ? new Date(meetingForm.end_time).toISOString() : null;

      await createMeeting({
        title: meetingForm.title,
        description: meetingForm.description,
        start_time: startIso,
        end_time: endIso,
        location: meetingForm.location,
        attendees: meetingForm.attendees,
      });

      // Reset
      setMeetingForm({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        attendees: '',
      });
      setShowMeetingForm(false);
    } catch (err) {
      console.error('Failed to schedule meeting:', err);
    }
  };

  const handleReminderSubmit = async (e) => {
    e.preventDefault();
    if (!reminderForm.title || !reminderForm.scheduled_time) return;

    try {
      const scheduledIso = new Date(reminderForm.scheduled_time).toISOString();

      await createReminder({
        title: reminderForm.title,
        description: reminderForm.description,
        reminder_type: reminderForm.reminder_type,
        scheduled_time: scheduledIso,
      });

      // Reset
      setReminderForm({
        title: '',
        description: '',
        reminder_type: 'reminder',
        scheduled_time: '',
      });
      setShowReminderForm(false);
    } catch (err) {
      console.error('Failed to create reminder:', err);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="meetings-container">
      <motion.div
        className="meetings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Smart Calendar & Reminders</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn-primary"
            onClick={() => {
              setShowMeetingForm(!showMeetingForm);
              setShowReminderForm(false);
            }}
          >
            <Plus size={18} /> Schedule Meeting
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setShowReminderForm(!showReminderForm);
              setShowMeetingForm(false);
            }}
          >
            <BellRing size={18} /> Add Reminder
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Forms Section */}
      <AnimatePresence>
        {showMeetingForm && (
          <motion.div
            className="meetings-form-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="panel-header">Schedule a New Meeting</h2>
            <form onSubmit={handleMeetingSubmit} className="meetings-form">
              <div className="form-group full-width">
                <label>Meeting Title *</label>
                <input
                  type="text"
                  name="title"
                  value={meetingForm.title}
                  onChange={handleMeetingChange}
                  placeholder="e.g., AI Team Sync & Progress"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={meetingForm.start_time}
                  onChange={handleMeetingChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time (Optional)</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={meetingForm.end_time}
                  onChange={handleMeetingChange}
                />
              </div>

              <div className="form-group">
                <label>Location / Link</label>
                <input
                  type="text"
                  name="location"
                  value={meetingForm.location}
                  onChange={handleMeetingChange}
                  placeholder="e.g., Zoom Link / Conference Room A"
                />
              </div>

              <div className="form-group">
                <label>Attendees (Comma separated emails)</label>
                <input
                  type="text"
                  name="attendees"
                  value={meetingForm.attendees}
                  onChange={handleMeetingChange}
                  placeholder="e.g., dev@example.com, pm@example.com"
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={meetingForm.description}
                  onChange={handleMeetingChange}
                  placeholder="What is this meeting about?"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowMeetingForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {showReminderForm && (
          <motion.div
            className="meetings-form-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="panel-header">Create Custom Reminder</h2>
            <form onSubmit={handleReminderSubmit} className="meetings-form">
              <div className="form-group full-width">
                <label>Reminder Title *</label>
                <input
                  type="text"
                  name="title"
                  value={reminderForm.title}
                  onChange={handleReminderChange}
                  placeholder="e.g., Drink water, Prepare slides"
                  required
                />
              </div>

              <div className="form-group">
                <label>Reminder Type</label>
                <select name="reminder_type" value={reminderForm.reminder_type} onChange={handleReminderChange}>
                  <option value="reminder">Custom Notification</option>
                  <option value="habit">Habit Check</option>
                  <option value="task">Task Deadline</option>
                  <option value="meeting">Meeting Prep</option>
                </select>
              </div>

              <div className="form-group">
                <label>Scheduled Trigger Time *</label>
                <input
                  type="datetime-local"
                  name="scheduled_time"
                  value={reminderForm.scheduled_time}
                  onChange={handleReminderChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description / Subtext</label>
                <textarea
                  name="description"
                  value={reminderForm.description}
                  onChange={handleReminderChange}
                  placeholder="Additional details (optional)..."
                  rows="2"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Set Reminder'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowReminderForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="meetings-tabs">
        <button
          className={`meetings-tab ${activeTab === 'meetings' ? 'active' : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          Meetings ({meetings.length})
        </button>
        <button
          className={`meetings-tab ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          Reminders ({reminders.length})
        </button>
      </div>

      {/* Grid Stack */}
      <div className="content-grid">
        {activeTab === 'meetings' ? (
          <div style={{ gridColumn: 'span 2' }}>
            <h2 className="panel-header">Scheduled Meetings</h2>
            <div className="cards-stack">
              {meetings.length === 0 ? (
                <p className="empty-state">No upcoming meetings scheduled. Click "Schedule Meeting" to get started.</p>
              ) : (
                meetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    className="item-card"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="item-card-header">
                      <div>
                        <h3>{meeting.title}</h3>
                        <span className="badge badge-blue" style={{ marginTop: '0.5rem' }}>
                          <Video size={12} style={{ display: 'inline', marginRight: '3px' }} /> Meeting
                        </span>
                      </div>
                      <button className="item-delete-btn" onClick={() => deleteMeeting(meeting.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {meeting.description && <p className="item-card-desc">{meeting.description}</p>}

                    <div className="item-meta">
                      <span>
                        <Clock size={14} /> {formatDateTime(meeting.start_time)}
                      </span>
                      {meeting.location && (
                        <span>
                          <MapPin size={14} /> {meeting.location}
                        </span>
                      )}
                      {meeting.attendees && (
                        <span>
                          <Users size={14} /> {meeting.attendees}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div style={{ gridColumn: 'span 2' }}>
            <h2 className="panel-header">Active Reminders</h2>
            <div className="cards-stack">
              {reminders.length === 0 ? (
                <p className="empty-state">No reminders set. Click "Add Reminder" or create one above.</p>
              ) : (
                reminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    className="item-card"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="item-card-header">
                      <div>
                        <h3>{reminder.title}</h3>
                        <span className={`badge ${
                          reminder.reminder_type === 'habit' ? 'badge-purple' :
                          reminder.reminder_type === 'task' ? 'badge-orange' : 'badge-green'
                        }`} style={{ marginTop: '0.5rem' }}>
                          {reminder.reminder_type}
                        </span>
                      </div>
                      <button className="item-delete-btn" onClick={() => deleteReminder(reminder.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {reminder.description && <p className="item-card-desc">{reminder.description}</p>}

                    <div className="item-meta">
                      <span>
                        <Clock size={14} /> Trigger: {formatDateTime(reminder.scheduled_time)}
                      </span>
                      <span style={{ color: reminder.sent ? '#10b981' : '#f59e0b' }}>
                        {reminder.sent ? '✓ Sent' : '⏰ Pending'}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
