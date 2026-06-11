import { create } from 'zustand';
import apiClient from '../config/api';

export const useMoodStore = create((set) => ({
  moodEntries: [],
  stats: null,
  aiInsight: null,
  isLoading: false,
  isAiLoading: false,

  fetchMoodEntries: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/mood');
      set({ moodEntries: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  logMood: async (moodData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/mood', moodData);
      set((state) => ({ 
        moodEntries: [response.data, ...state.moodEntries],
        isLoading: false 
      }));
    } catch (err) {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const response = await apiClient.get('/mood/stats');
      set({ stats: response.data });
    } catch (err) {
      console.error('Failed to fetch mood stats', err);
    }
  },

  fetchAiInsight: async () => {
    set({ isAiLoading: true });
    try {
      const response = await apiClient.get('/mood/ai-insight');
      set({ aiInsight: response.data.insight, isAiLoading: false });
    } catch (err) {
      set({ isAiLoading: false });
    }
  },

  clearInsight: () => set({ aiInsight: null }),
}));
