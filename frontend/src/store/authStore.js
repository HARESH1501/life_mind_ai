/**
 * Authentication Store
 * Zustand store for managing authentication state
 */

import { create } from 'zustand';
import apiClient from '../config/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('access_token') || null,
  isLoading: false,
  error: null,

  // Register user
  register: async (email, username, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        username,
        password,
        full_name: fullName,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Registration failed';
      set({ isLoading: false, error: errorMsg });
      throw error;
    } finally {
      // Ensure loading state is always cleared
      set((state) => ({ ...state, isLoading: state.isLoading }));
    }
  },

  // Login user
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid response from server');
      }
      
      const { access_token, user } = response.data;
      
      console.log('✅ Login successful! Token:', access_token.substring(0, 20) + '...');
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token: access_token, 
        isLoading: false,
        error: null
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Login failed';
      console.error('❌ Login error:', errorMsg);
      set({ isLoading: false, error: errorMsg });
      throw error;
    } finally {
      // Ensure loading state is always cleared
      set((state) => ({ ...state, isLoading: state.isLoading }));
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      set({ user: response.data });
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      set({ user: null, token: null });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
