"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import UserSidebar from "@/components/user-sidebar"
import { useGreenhouseMetrics } from "@/hooks/useGreenhouseMetrics"
import { useGreenhouses } from "@/hooks/useGreenhouses"

export default function RealTimeData() {
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<number | null>(null)
  const { greenhouses, loading: greenhousesLoading, error: greenhousesError } = useGreenhouses()
  const { metrics, loading: metricsLoading, error: metricsError, lastUpdate } = useGreenhouseMetrics(selectedGreenhouseId || 0)

  // Set selected greenhouse when greenhouses are loaded
  useEffect(() => {
    if (greenhouses && greenhouses.length > 0 && !selectedGreenhouseId) {
      setSelectedGreenhouseId(greenhouses[0].id)
    }
  }, [greenhouses, selectedGreenhouseId])

  if (greenhousesLoading) {
    return <div>Loading greenhouses...</div>
  }

  if (greenhousesError) {
    return <div>Error loading greenhouses: {greenhousesError}</div>
  }

  if (!greenhouses || greenhouses.length === 0) {
    return (
      <div className="flex min-h-screen">
        <UserSidebar />
        <div className="flex-1 p-6">
          <h2 className="text-xl font-semibold text-center mb-6">No Greenhouses Found</h2>
          <p className="text-center">Please add a greenhouse to view real-time data.</p>
        </div>
      </div>
    )
  }

  if (metricsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading metrics...</p>
        </div>
      </div>
    )
  }

  if (metricsError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {metricsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const selectedGreenhouse = greenhouses.find(gh => gh.id === selectedGreenhouseId)

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Real-time Data</h1>
          <p className="text-sm text-gray-600">
            Last updated: {lastUpdate ? new Date(lastUpdate).toLocaleString() : 'Never'}
          </p>
        </div>

        {selectedGreenhouse && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedGreenhouse.name} - Real-time Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Temperature</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics?.temperature}°C</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Humidity</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics?.humidity}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Soil Moisture</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics?.soilMoisture}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">Light Intensity</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics?.lightIntensity}%</p>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[metrics]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#EF4444" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#3B82F6" name="Humidity (%)" />
                  <Line type="monotone" dataKey="soilMoisture" stroke="#10B981" name="Soil Moisture (%)" />
                  <Line type="monotone" dataKey="lightIntensity" stroke="#F59E0B" name="Light Intensity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 