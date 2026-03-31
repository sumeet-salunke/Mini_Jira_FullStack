import axios from 'axios';
import { clearAuth, getToken } from '../utils/auth';

const api = axios.create({
  baseURL: "https://mini-jira-fullstack.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (status === 401 && !isAuthRequest && getToken()) {
      clearAuth();
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
