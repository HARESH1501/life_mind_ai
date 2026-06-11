import { create } from 'zustand';
import apiClient from '../config/api';

export const useHabitStore = create((set, get) => ({
  habits: [],
  recommendations: [],
  isLoading: false,
  isAiLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/habits');
      set({ habits: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch habits', isLoading: false });
    }
  },

  createHabit: async (habitData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/habits', habitData);
      console.log('✅ Habit created successfully:', response.data);
      set((state) => ({ 
        habits: [...state.habits, response.data], 
        isLoading: false,
        error: null 
      }));
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create habit:', error.response?.data || error.message);
      set({ error: 'Failed to create habit', isLoading: false });
      throw error;
    }
  },

  logHabit: async (habitId) => {
    try {
      await apiClient.post(`/habits/${habitId}/log`);
      // Optimistically update the streak locally
      set((state) => ({
        habits: state.habits.map((habit) => 
          habit.id === habitId ? { ...habit, streak: habit.streak + 1 } : habit
        )
      }));
    } catch (error) {
      console.error('Failed to log habit', error);
    }
  },

  deleteHabit: async (habitId) => {
    try {
      await apiClient.delete(`/habits/${habitId}`);
      set((state) => ({
        habits: state.habits.filter(h => h.id !== habitId)
      }));
    } catch (error) {
      console.error('Failed to delete habit', error);
    }
  },

  fetchAiRecommendations: async () => {
    set({ isAiLoading: true, error: null });
    try {
      const response = await apiClient.get('/habits/recommendations');
      set({ recommendations: response.data.recommendations, isAiLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch AI recommendations', isAiLoading: false });
    }
  }
}));
