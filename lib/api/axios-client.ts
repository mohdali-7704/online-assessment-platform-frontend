import axios from 'axios';
import { JUDGE0_API_URL, JUDGE0_API_KEY, RAPIDAPI_HOST } from '../utils/constants';

// Create axios instance for Judge0 API (RapidAPI)
export const judge0Client = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-key': JUDGE0_API_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST
  }
});

// Request interceptor
judge0Client.interceptors.request.use(
  (config) => {
    // You can add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
judge0Client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default judge0Client;
