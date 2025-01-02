import axios from 'axios';
export const BASE_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Your backend URL (NestJS server)
});

export const setAuthToken = (token) => {
  if (token) {
    // Set token in a custom header called 'token'
    axios.defaults.headers.common['token'] = token;
  } else {
    // Remove the token header if no token is provided
    delete axios.defaults.headers.common['token'];
  }
};

// Intercept requests to add JWT token if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.role) {
    config.headers['Authorization'] = `Bearer ${user.role}`;
  }
  return config;
});

export default api;
