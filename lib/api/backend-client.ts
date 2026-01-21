import axios from 'axios';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

export const backendClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
backendClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
backendClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Backend API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
