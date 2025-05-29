import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/login') {
      originalRequest._retry = true;
      
      // Clear user data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server Error:', error.response?.data);
      return Promise.reject({
        message: 'Server error occurred. Please try again later.'
      });
    }

    // Handle validation errors
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const errorMessage = Object.values(errors).flat().join(', ');
      return Promise.reject({
        message: errorMessage || 'Validation failed'
      });
    }

    // Handle not found errors
    if (error.response?.status === 404) {
      // Use backend message if available, otherwise use generic message
      const message = error.response?.data?.message || 'The requested resource was not found';
      return Promise.reject({
        message: message
      });
    }

    // Handle forbidden errors
    if (error.response?.status === 403) {
      return Promise.reject({
        message: 'You do not have permission to perform this action'
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.'
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.response?.data?.message || 'An unexpected error occurred'
    });
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/login',
    register: '/api/register',
    logout: '/api/logout',
    verifyOTP: '/api/verify-otp',
    resendOTP: '/api/resend-otp',
  },
  greenhouses: {
    list: '/api/greenhouses',
    create: '/api/greenhouses',
    get: (id: number) => `/api/greenhouses/${id}`,
    update: (id: number) => `/api/greenhouses/${id}`,
    delete: (id: number) => `/api/greenhouses/${id}`,
  },
  plants: {
    list: '/api/plants',
    create: '/api/plants',
    get: (id: number) => `/api/plants/${id}`,
    update: (id: number) => `/api/plants/${id}`,
    delete: (id: number) => `/api/plants/${id}`,
  },
  sensors: {
    list: '/api/sensors',
    create: '/api/sensors',
    get: (id: number) => `/api/sensors/${id}`,
    update: (id: number) => `/api/sensors/${id}`,
    delete: (id: number) => `/api/sensors/${id}`,
  },
  posts: {
    list: '/api/posts',
    create: '/api/posts',
    get: (id: number) => `/api/posts/${id}`,
    update: (id: number) => `/api/posts/${id}`,
    delete: (id: number) => `/api/posts/${id}`,
  },
  // Add greenhouse endpoints here once you provide them
  greenhouse: {
    metrics: '/api/greenhouse/metrics', // This needs to be updated with your actual endpoint
    control: '/api/greenhouse/control', // This needs to be updated with your actual endpoint
    settings: '/api/greenhouse/settings', // This needs to be updated with your actual endpoint
  },
  user: {
    profile: '/api/user/profile',
    settings: '/api/user/settings',
  },
};

export default api; 