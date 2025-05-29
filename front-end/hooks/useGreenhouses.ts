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
  const [singleGreenhouseLoading, setSingleGreenhouseLoading] = useState(false);
  const [singleGreenhouseError, setSingleGreenhouseError] = useState<string | null>(null);

  const fetchGreenhouses = async () => {
    try {
      console.log('Fetching greenhouses...');
      console.log('API endpoint:', endpoints.greenhouses.list);
      
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.greenhouses.list);
      
      console.log('Greenhouses response:', response.data);
      
      if (response.data.status === 'success' && Array.isArray(response.data.data)) {
        setGreenhouses(response.data.data);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      const errorMessage = err.response?.data?.message || 'Failed to fetch greenhouses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchGreenhouseById = async (id: number) => {
    try {
      console.log(`Fetching greenhouse with ID: ${id}...`);
      console.log('API endpoint:', endpoints.greenhouses.show(id));

      setSingleGreenhouseLoading(true);
      setSingleGreenhouseError(null);
      const response = await api.get(endpoints.greenhouses.show(id));

      console.log('Greenhouse by ID response:', response.data);

      if (response.data.status === 'success' && response.data.data) {
        return response.data.data as Greenhouse;
      } else {
        console.error('Invalid response format for single greenhouse:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching single greenhouse details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });

      const errorMessage = err.response?.data?.message || 'Failed to fetch greenhouse details';
      setSingleGreenhouseError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSingleGreenhouseLoading(false);
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
    console.log('useGreenhouses hook mounted');
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
    fetchGreenhouseById,
    singleGreenhouseLoading,
    singleGreenhouseError,
  };
} 