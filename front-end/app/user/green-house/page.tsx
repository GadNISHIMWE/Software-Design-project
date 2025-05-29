"use client"

import { useState, useEffect } from "react"
import UserSidebar from "@/components/user-sidebar"
import { useGreenhouses } from "@/hooks/useGreenhouses"
import { useGreenhouseControl } from "@/hooks/useGreenhouseControl"

export default function GreenhouseControl() {
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<number | null>(null)
  const { greenhouses, loading: greenhousesLoading, error: greenhousesError } = useGreenhouses()
  const { controlSystem, loading: controlLoading, error: controlError } = useGreenhouseControl(selectedGreenhouseId || 0)

  // Set selected greenhouse when greenhouses are loaded
  useEffect(() => {
    if (greenhouses && greenhouses.length > 0 && !selectedGreenhouseId) {
      setSelectedGreenhouseId(greenhouses[0].id)
    }
  }, [greenhouses, selectedGreenhouseId])

  const handleSystemControl = async (system: string, action: 'on' | 'off' | 'auto') => {
    try {
      await controlSystem(system, action)
      // You might want to show a success message here
    } catch (err) {
      console.error('Failed to control system:', err)
      // You might want to show an error message here
    }
  }

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
          <p className="text-center">Please add a greenhouse to control systems.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Greenhouse Control</h1>
          <p className="text-sm text-gray-600">Control your greenhouse systems</p>
        </div>

        {selectedGreenhouse && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {selectedGreenhouse.name} - System Controls
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Ventilation Control */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ventilation System</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSystemControl('ventilation', 'on')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={controlLoading}
                  >
                    Turn On
                  </button>
                  <button
                    onClick={() => handleSystemControl('ventilation', 'off')}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={controlLoading}
                  >
                    Turn Off
                  </button>
                  <button
                    onClick={() => handleSystemControl('ventilation', 'auto')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={controlLoading}
                  >
                    Auto Mode
                  </button>
                </div>
              </div>

              {/* Irrigation Control */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Irrigation System</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSystemControl('irrigation', 'on')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={controlLoading}
                  >
                    Turn On
                  </button>
                  <button
                    onClick={() => handleSystemControl('irrigation', 'off')}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={controlLoading}
                  >
                    Turn Off
                  </button>
                  <button
                    onClick={() => handleSystemControl('irrigation', 'auto')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={controlLoading}
                  >
                    Auto Mode
                  </button>
                </div>
              </div>

              {/* Lighting Control */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Lighting System</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSystemControl('lighting', 'on')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={controlLoading}
                  >
                    Turn On
                  </button>
                  <button
                    onClick={() => handleSystemControl('lighting', 'off')}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={controlLoading}
                  >
                    Turn Off
                  </button>
                  <button
                    onClick={() => handleSystemControl('lighting', 'auto')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={controlLoading}
                  >
                    Auto Mode
                  </button>
                </div>
              </div>
            </div>

            {controlError && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
                {controlError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 