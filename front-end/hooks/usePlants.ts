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
  created_at: string;
  updated_at: string;
  greenhouse?: {
    id: number;
    name: string;
    location: string;
  };
}

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.plants.list);
      setPlants(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch plants';
      setError(errorMessage);
      console.error('Error fetching plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPlant = async (data: {
    name: string;
    species: string;
    planting_date: string;
    harvest_date?: string | null;
    status: string;
    greenhouse_id: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(endpoints.plants.create, data);
      setPlants(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create plant';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePlant = async (id: number, data: Partial<Plant>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(endpoints.plants.update(id), data);
      setPlants(prev => prev.map(plant => plant.id === id ? response.data : plant));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update plant';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePlant = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(endpoints.plants.delete(id));
      setPlants(prev => prev.filter(plant => plant.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete plant';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return {
    plants,
    loading,
    error,
    fetchPlants,
    createPlant,
    updatePlant,
    deletePlant,
  };
} 