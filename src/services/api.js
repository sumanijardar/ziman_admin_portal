import axios from 'axios';

const api = axios.create({
  // Pointing to /api so Vite proxy intercepts it and handles CORS
  baseURL: '/api'
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
