import { useState, useEffect } from 'react';
import api, { endpoints } from '@/lib/api';

interface Plant {
  id: number;
  name: string;
  species: string;
  planting_date: string;
  harvest_date: string | null;
  status: string;
  greenhouse_id: number;
}

interface Sensor {
  id: number;
  name: string;
  type: string;
  status: string;
  last_reading: string | null;
  greenhouse_id: number;
}

interface Greenhouse {
  id: number;
  name: string;
  location: string;
  size: number;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  plants?: Plant[];
  sensors?: Sensor[];
}

export function useGreenhouses() {
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGreenhouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.greenhouses.list);
      setGreenhouses(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch greenhouses';
      setError(errorMessage);
      console.error('Error fetching greenhouses:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGreenhouse = async (data: {
    name: string;
    location: string;
    size: number;
    status: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(endpoints.greenhouses.create, data);
      setGreenhouses(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create greenhouse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateGreenhouse = async (id: number, data: Partial<Greenhouse>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(endpoints.greenhouses.update(id), data);
      setGreenhouses(prev => prev.map(gh => gh.id === id ? response.data : gh));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update greenhouse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteGreenhouse = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(endpoints.greenhouses.delete(id));
      setGreenhouses(prev => prev.filter(gh => gh.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete greenhouse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreenhouses();
  }, []);

  return {
    greenhouses,
    loading,
    error,
    fetchGreenhouses,
    createGreenhouse,
    updateGreenhouse,
    deleteGreenhouse,
  };
} 