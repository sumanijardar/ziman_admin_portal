import axios from 'axios';

const api = axios.create({
  // Pointing to /api in dev for Vite proxy, and real URL in production
  baseURL: import.meta.env.PROD ? 'https://sarsspl.com/ziman/backend/index.php' : '/api'
});

// Interceptor to add auth token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
