import axios from 'axios';

// Get base URL dynamically for Codespaces
const getBaseUrl = () => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    // For Codespaces
    if (window.location.hostname.includes('.preview.app.github.dev')) {
      // Replace the port from 5173 to 8000
      const codespaceUrl = window.location.origin.replace('5173', '8000');
      console.log('Codespaces mode - API URL:', codespaceUrl);
      return codespaceUrl;
    }
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  }
  return process.env.VITE_API_URL || 'http://localhost:8000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;