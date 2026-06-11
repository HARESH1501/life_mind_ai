/**
 * Notification Store
 * Zustand store for managing notifications and reminders
 */

import { create } from 'zustand';
import apiClient from '../config/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  reminders: [],
  meetings: [],
  isLoading: false,
  error: null,

  // Add notification
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);

    return id;
  },

  // Remove notification
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // Clear all notifications
  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Fetch notifications
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/notifications');
      set({ notifications: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch notifications';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Create reminder
  createReminder: async (reminderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/notifications/reminders', reminderData);
      set((state) => ({
        reminders: [...state.reminders, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create reminder';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Fetch reminders
  fetchReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/notifications/reminders');
      set({ reminders: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch reminders';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Delete reminder
  deleteReminder: async (reminderId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/notifications/reminders/${reminderId}`);
      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== reminderId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to delete reminder';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Create meeting
  createMeeting: async (meetingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/notifications/meetings', meetingData);
      set((state) => ({
        meetings: [...state.meetings, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create meeting';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Fetch meetings
  fetchMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/notifications/meetings');
      set({ meetings: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch meetings';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Delete meeting
  deleteMeeting: async (meetingId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/notifications/meetings/${meetingId}`);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== meetingId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to delete meeting';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
}));
