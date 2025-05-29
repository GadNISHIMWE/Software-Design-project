import { useState, useCallback } from 'react';
import api, { endpoints } from '@/lib/api';

interface ControlResponse {
  status: string;
  message: string;
  data?: any;
}

export function useGreenhouseControl(greenhouseId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controlSystem = useCallback(async (system: string, action: 'on' | 'off' | 'auto', value?: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<ControlResponse>(endpoints.greenhouse.control(greenhouseId), {
        system,
        action,
        value
      });

      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to control system');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to control system';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [greenhouseId]);

  return {
    controlSystem,
    loading,
    error
  };
} 