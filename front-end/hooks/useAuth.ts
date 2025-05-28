import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface AuthResponse {
  status: string;
  message: string;
  data?: {
    user: any;
    token: string;
  };
  errors?: any;
  requires_otp_verification?: boolean;
  email?: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<AuthResponse>('/api/login', credentials);

      console.log('Login API response:', response);
      console.log('Login API response.data:', response.data);
      
      if (response.data && response.data.requires_otp_verification) {
        console.log('Login successful, OTP verification required.', response.data);
        if (response.data.email) {
          localStorage.setItem('pendingVerificationEmail', response.data.email);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          router.push(`/auth/verify?email=${encodeURIComponent(response.data.email)}`);
          return response.data;
        } else {
          setError(response.data.message || 'Login failed: Email required for verification.');
          throw new Error(response.data.message || 'Login failed: Email required for verification.');
        }
      }
      
      setError('Unexpected response from server. OTP verification required.');
      throw new Error('Unexpected response from server. OTP verification required.');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<AuthResponse>('/api/register', userData);
      
      if (response.data.status === 'success') {
        return response.data;
      }
      
      if (response.data.status === 'error') {
        setError(response.data.message || 'Registration failed');
        throw new Error(response.data.message || 'Registration failed');
      }
      
      setError('An unexpected error occurred during registration.');
      throw new Error('An unexpected error occurred during registration.');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        setError(validationErrors[firstErrorKey][0] || 'Registration failed');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Registration failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<AuthResponse>('/api/verify-otp', { email, otp });
      
      if (response.data.status === 'success' && response.data.data) {
        const { user, token, is_admin } = response.data.data;
        
        console.log('OTP verification successful. Received token and user data.', { token, user, is_admin });
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        localStorage.removeItem('pendingVerificationEmail');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('OTP verification successful, redirecting to dashboard...');
        
        if (is_admin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/dashboard');
        }
        
        return response.data;
      }
      
      if (response.data.status === 'error') {
        setError(response.data.message || 'OTP verification failed');
        throw new Error(response.data.message || 'OTP verification failed');
      }
      
      setError('An unexpected error occurred during OTP verification.');
      throw new Error('An unexpected error occurred during OTP verification.');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during OTP verification.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const resendOTP = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<AuthResponse>('/api/resend-otp', { email });
      
      if (response.data.status === 'success') {
        return response.data;
      }
      
      if (response.data.status === 'error') {
        setError(response.data.message || 'Failed to resend OTP');
        throw new Error(response.data.message || 'Failed to resend OTP');
      }
      
      setError('An unexpected error occurred when trying to resend OTP.');
      throw new Error('An unexpected error occurred when trying to resend OTP.');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Failed to resend OTP');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/api/logout');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    
    return false;
  }, []);

  return {
    login,
    register,
    logout,
    checkAuth,
    verifyOTP,
    resendOTP,
    loading,
    error,
    setError
  };
} 