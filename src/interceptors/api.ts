import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;
      console.log('in interceptors Invalid credentials');
      
      
      if (status === 401) {
        // Handle unauthorized (token expired, invalid credentials)
        localStorage.removeItem('token');
        return Promise.reject(data?.message || 'Session expired. Please log in again.');
      } else if (status === 400) {
        // Bad request
        return Promise.reject(data?.message || 'Invalid request');
      } else if (status === 500) {
        // Server error
        return Promise.reject('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      return Promise.reject('Request error. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;