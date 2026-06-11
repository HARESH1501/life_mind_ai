/**
 * API Configuration
 * Centralized API client setup with axios
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token added to request:', token.substring(0, 20) + '...');
  } else {
    console.log('⚠️  No token found in localStorage');
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response OK:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized (401):', error.config.url);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
