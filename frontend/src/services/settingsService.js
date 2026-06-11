/**
 * Settings Service - Production Grade
 * Handles all settings-related API calls
 */

import api from './api';

const settingsService = {
  // ============ PROFILE ENDPOINTS ============
  getProfile: async () => {
    const response = await api.get('/settings/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/settings/profile', profileData);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/settings/profile/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ============ APPEARANCE ENDPOINTS ============
  getAppearance: async () => {
    const response = await api.get('/settings/appearance');
    return response.data;
  },

  updateAppearance: async (appearanceData) => {
    const response = await api.put('/settings/appearance', appearanceData);
    return response.data;
  },

  // ============ NOTIFICATION ENDPOINTS ============
  getNotifications: async () => {
    const response = await api.get('/settings/notifications');
    return response.data;
  },

  updateNotifications: async (notificationData) => {
    const response = await api.put('/settings/notifications', notificationData);
    return response.data;
  },

  // ============ EMAIL PREFERENCES ENDPOINTS ============
  getEmailPreferences: async () => {
    const response = await api.get('/settings/email-preferences');
    return response.data;
  },

  updateEmailPreferences: async (emailData) => {
    const response = await api.put('/settings/email-preferences', emailData);
    return response.data;
  },

  testEmail: async () => {
    const response = await api.post('/settings/test-email');
    return response.data;
  },

  // ============ SECURITY ENDPOINTS ============
  getSecurity: async () => {
    const response = await api.get('/settings/security');
    return response.data;
  },

  updateSecurity: async (securityData) => {
    const response = await api.put('/settings/security', securityData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/settings/change-password', passwordData);
    return response.data;
  },

  // ============ ACCOUNT ENDPOINTS ============
  getAccountInfo: async () => {
    const response = await api.get('/settings/account-info');
    return response.data;
  },

  logoutAllDevices: async () => {
    const response = await api.post('/settings/logout-all-devices');
    return response.data;
  },

  exportData: async () => {
    const response = await api.post('/settings/export-data');
    return response.data;
  },

  deleteAccount: async (deleteData) => {
    const response = await api.delete('/settings/account', {
      data: deleteData,
    });
    return response.data;
  },

  // ============ GENERAL ENDPOINTS ============
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },

  updatePreferences: async (preferencesData) => {
    const response = await api.put('/settings/preferences', preferencesData);
    return response.data;
  },
};

export default settingsService;
