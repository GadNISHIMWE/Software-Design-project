import { useState, useEffect } from 'react';
import api, { endpoints } from '@/lib/api';

interface GreenhouseMetrics {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  timestamp: string;
}

export function useGreenhouseMetrics(greenhouseId: number) {
  const [metrics, setMetrics] = useState<GreenhouseMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // Construct the correct URL with the greenhouseId
      const url = `/api/greenhouses/${greenhouseId}/metrics`;
      const response = await api.get(url);
      setMetrics(response.data.data); // Assuming backend returns data in a 'data' key
      setError(null);
    } catch (err) {
      setError('Failed to fetch greenhouse metrics');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (greenhouseId) {
      fetchMetrics();
      // Set up polling every 30 seconds
      const interval = setInterval(fetchMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [greenhouseId]); // Rerun effect when greenhouseId changes

  return { metrics, loading, error, refetch: fetchMetrics };
} 