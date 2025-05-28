import { useState, useEffect } from 'react';
import api, { endpoints } from '@/lib/api';

interface Sensor {
  id: number;
  name: string;
  type: string;
  status: string;
  last_reading: string | null;
  greenhouse_id: number;
  created_at: string;
  updated_at: string;
  greenhouse?: {
    id: number;
    name: string;
    location: string;
  };
}

export function useSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.sensors.list);
      setSensors(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch sensors';
      setError(errorMessage);
      console.error('Error fetching sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSensor = async (data: {
    name: string;
    type: string;
    status: string;
    greenhouse_id: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(endpoints.sensors.create, data);
      setSensors(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create sensor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateSensor = async (id: number, data: Partial<Sensor>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(endpoints.sensors.update(id), data);
      setSensors(prev => prev.map(sensor => sensor.id === id ? response.data : sensor));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update sensor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteSensor = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(endpoints.sensors.delete(id));
      setSensors(prev => prev.filter(sensor => sensor.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete sensor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return {
    sensors,
    loading,
    error,
    fetchSensors,
    createSensor,
    updateSensor,
    deleteSensor,
  };
} 