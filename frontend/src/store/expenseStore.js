/**
 * Expense Store
 * Zustand store for managing expense state
 */

import { create } from 'zustand';
import apiClient from '../config/api';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  stats: null,
  isLoading: false,
  error: null,

  // Fetch all expenses
  fetchExpenses: async (skip = 0, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/expenses', {
        params: { skip, limit },
      });
      set({ expenses: response.data.items, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch expenses';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Create expense
  createExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📤 Sending expense data to API:', expenseData);
      const response = await apiClient.post('/expenses', expenseData);
      console.log('✅ API Response:', response.data);
      
      set((state) => ({
        expenses: [response.data, ...state.expenses],
        isLoading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to create expense';
      console.error('❌ API Error:', error.response?.data || error.message);
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Update expense
  updateExpense: async (expenseId, expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/expenses/${expenseId}`, expenseData);
      set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === expenseId ? response.data : e
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to update expense';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Delete expense
  deleteExpense: async (expenseId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/expenses/${expenseId}`);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== expenseId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to delete expense';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Fetch expense stats
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/expenses/stats/summary');
      set({ stats: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch stats';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
