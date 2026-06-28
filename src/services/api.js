import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors and Render cold start retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Check if the request is a safe HTTP method
    const isSafeMethod = config && config.method && ['get', 'head', 'options'].includes(config.method.toLowerCase());

    // Only attempt retry on safe methods for server/network errors (status is 502, 503, 504, or network error / no response)
    const shouldRetry = isSafeMethod && config && (!response || [502, 503, 504].includes(response.status));

    if (shouldRetry) {
      config.__retryCount = config.__retryCount || 0;
      const maxRetries = 5;
      const retryDelay = 3000; // 3 seconds between retries

      if (config.__retryCount < maxRetries) {
        config.__retryCount += 1;
        console.warn(`Render backend might be sleeping. Retrying request (${config.__retryCount}/${maxRetries}) for: ${config.url}`);
        
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return api(config);
      }
    }

    // Handle 401 Unauthorized errors (Redirect to /owner/login instead of /admin/login)
    if (response && response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/owner/login';
    }

    return Promise.reject(error);
  }
);

export default api;
