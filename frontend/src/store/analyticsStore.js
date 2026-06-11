/**
 * Analytics and AI Coach Store
 * Zustand store for fetching combined dashboard stats and AI insights
 */

import { create } from 'zustand';
import apiClient from '../config/api';

export const useAnalyticsStore = create((set, get) => ({
  dashboardData: null,
  aiSuggestions: null,
  aiExpenses: null,
  aiWellness: null,
  aiPlanner: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/analytics/dashboard');
      set({ dashboardData: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch dashboard analytics';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  fetchAISuggestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/ai/coach/suggestions');
      set({ aiSuggestions: response.data.recommendations, isLoading: false });
      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to fetch habit suggestions:', error);
      set({ isLoading: false });
    }
  },

  fetchAIExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/ai/expenses/insights');
      set({ aiExpenses: response.data.insights, isLoading: false });
      return response.data.insights;
    } catch (error) {
      console.error('Failed to fetch expense insights:', error);
      set({ isLoading: false });
    }
  },

  fetchAIWellness: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/ai/wellness/analysis');
      set({ aiWellness: response.data.insights, isLoading: false });
      return response.data.insights;
    } catch (error) {
      console.error('Failed to fetch wellness insights:', error);
      set({ isLoading: false });
    }
  },

  fetchAIPlanner: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/ai/daily-planner');
      set({ aiPlanner: response.data.planner, isLoading: false });
      return response.data.planner;
    } catch (error) {
      console.error('Failed to fetch daily planner:', error);
      set({ isLoading: false });
    }
  },
}));
