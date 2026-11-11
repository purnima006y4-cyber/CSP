import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    // If route starts with /admin, prioritize adminToken
    const isAdminRoute = config.url && config.url.startsWith('/admin');
    const token = isAdminRoute
      ? localStorage.getItem('adminToken') || localStorage.getItem('token')
      : localStorage.getItem('token') || localStorage.getItem('adminToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
