import { create } from 'zustand';
import apiClient from '../config/api';

export const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/tasks');
      set({ tasks: response.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/tasks', taskData);
      set((state) => ({ tasks: [response.data, ...state.tasks], isLoading: false }));
    } catch (err) {
      set({ error: 'Failed to create task', isLoading: false });
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t)),
      }));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  },

  toggleTask: async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await apiClient.put(`/tasks/${task.id}`, { status: newStatus });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? response.data : t)),
      }));
    } catch (err) {
      console.error('Failed to toggle task', err);
    }
  },

  clearError: () => set({ error: null }),
}));
