import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface Greenhouse {
  id: number;
  name: string;
  location: string;
  status: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  light_intensity: number;
  created_at: string;
  updated_at: string;
}

interface GreenhouseResponse {
  status: string;
  message: string;
  data?: Greenhouse | Greenhouse[];
}

export function useGreenhouse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGreenhouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<GreenhouseResponse>('/greenhouses');
      return response.data.data as Greenhouse[];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch greenhouses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGreenhouse = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<GreenhouseResponse>(`/greenhouses/${id}`);
      return response.data.data as Greenhouse;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch greenhouse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGreenhouse = useCallback(async (data: Partial<Greenhouse>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<GreenhouseResponse>('/greenhouses', data);
      return response.data.data as Greenhouse;
    } catch (err: any) {
      setError(err.message || 'Failed to create greenhouse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGreenhouse = useCallback(async (id: number, data: Partial<Greenhouse>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put<GreenhouseResponse>(`/greenhouses/${id}`, data);
      return response.data.data as Greenhouse;
    } catch (err: any) {
      setError(err.message || 'Failed to update greenhouse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGreenhouse = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/greenhouses/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete greenhouse');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGreenhouseMetrics = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<GreenhouseResponse>(`/greenhouses/${id}/metrics`);
      return response.data.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch greenhouse metrics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getGreenhouses,
    getGreenhouse,
    createGreenhouse,
    updateGreenhouse,
    deleteGreenhouse,
    getGreenhouseMetrics,
  };
} 