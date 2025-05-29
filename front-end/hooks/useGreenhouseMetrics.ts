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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    if (!greenhouseId) {
      console.log('No greenhouse ID provided');
      setMetrics(null);
      setError('No greenhouse selected');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching metrics for greenhouse:', greenhouseId);
      console.log('API endpoint:', endpoints.greenhouse.metrics(greenhouseId));
      
      setLoading(true);
      const response = await api.get(endpoints.greenhouse.metrics(greenhouseId));
      
      console.log('API response:', response.data);
      
      if (response.data.status === 'success' && response.data.data) {
        // Transform the data to match the frontend interface
        const transformedData = {
          temperature: response.data.data.temperature,
          humidity: response.data.data.humidity,
          soilMoisture: response.data.data.soil_moisture,
          lightIntensity: response.data.data.light_intensity,
          timestamp: response.data.timestamp || new Date().toISOString()
        };
        
        console.log('Transformed metrics:', transformedData);
        
        setMetrics(transformedData);
        setLastUpdate(new Date());
        setError(null);
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
      
      const errorMessage = err.response?.data?.message || 'Failed to fetch greenhouse metrics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with greenhouseId:', greenhouseId);
    if (greenhouseId) {
      fetchMetrics();
      // Set up polling every 15 seconds for more frequent updates
      const interval = setInterval(fetchMetrics, 15000);
      return () => clearInterval(interval);
    } else {
      setMetrics(null);
      setError('No greenhouse selected');
      setLoading(false);
    }
  }, [greenhouseId]);

  return { 
    metrics, 
    loading, 
    error, 
    lastUpdate,
    refetch: fetchMetrics 
  };
} 