"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Thermometer, Droplets, Sprout, Sun, Bell, Settings, Wind, Zap, Play, Pause, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import UserSidebar from "@/components/user-sidebar"
import { useGreenhouseMetrics } from "@/hooks/useGreenhouseMetrics"
import { useGreenhouses } from "@/hooks/useGreenhouses"
import { useGreenhouseControl } from "@/hooks/useGreenhouseControl"

// Sample data for charts (we'll keep this for now, but you can update it with real data later)
const environmentalData = [
  { time: "06:00", temperature: 22, humidity: 68, soilMoisture: 82, lightIntensity: 20 },
  { time: "08:00", temperature: 24, humidity: 65, soilMoisture: 80, lightIntensity: 45 },
  { time: "10:00", temperature: 26, humidity: 62, soilMoisture: 78, lightIntensity: 70 },
  { time: "12:00", temperature: 28, humidity: 58, soilMoisture: 75, lightIntensity: 95 },
  { time: "14:00", temperature: 30, humidity: 55, soilMoisture: 73, lightIntensity: 100 },
  { time: "16:00", temperature: 28, humidity: 60, soilMoisture: 75, lightIntensity: 80 },
  { time: "18:00", temperature: 25, humidity: 65, soilMoisture: 78, lightIntensity: 50 },
  { time: "20:00", temperature: 23, humidity: 70, soilMoisture: 80, lightIntensity: 10 },
]

const weeklyGrowthData = [
  { day: "Mon", growth: 2.1, avgTemp: 24, avgHumidity: 65 },
  { day: "Tue", growth: 2.3, avgTemp: 25, avgHumidity: 63 },
  { day: "Wed", growth: 2.0, avgTemp: 23, avgHumidity: 68 },
  { day: "Thu", growth: 2.5, avgTemp: 26, avgHumidity: 60 },
  { day: "Fri", growth: 2.7, avgTemp: 27, avgHumidity: 58 },
  { day: "Sat", growth: 2.4, avgTemp: 25, avgHumidity: 62 },
  { day: "Sun", growth: 2.2, avgTemp: 24, avgHumidity: 66 },
]

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  // Set a default greenhouse ID for demonstration. Change 1 to a valid ID in your DB.
  const defaultGreenhouseId = 1;
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<number | null>(defaultGreenhouseId);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<any>(null); // State to hold the selected greenhouse object with systems

  const { greenhouses, loading: greenhousesLoading, error: greenhousesError, fetchGreenhouses, fetchGreenhouseById, singleGreenhouseLoading, singleGreenhouseError } = useGreenhouses()
  const { metrics, loading: metricsLoading, error: metricsError, lastUpdate } = useGreenhouseMetrics(selectedGreenhouseId || 0)
  const { controlSystem, loading: controlLoading, error: controlError } = useGreenhouseControl();

  const [notifications] = useState([
    { id: 1, message: "Watering completed successfully", time: "10 min ago", type: "success" },
    { id: 2, message: "Temperature slightly high", time: "25 min ago", type: "warning" },
    { id: 3, message: "Optimal growing conditions", time: "1 hour ago", type: "info" },
  ])

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Set selected greenhouse when greenhouses are loaded or when greenhouse list changes
  useEffect(() => {
    // With a default greenhouse, we don't need to select from the user's list initially.
    // The effect below will handle fetching based on selectedGreenhouseId.
    // We can keep the fetchGreenhouses call if needed for other parts of the dashboard
    // that list all greenhouses, but it's not needed for the default view.
    // If you remove fetchGreenhouses completely, also remove greenhousesLoading and greenhousesError checks below.
  }, [greenhouses, selectedGreenhouseId])

  // Effect to fetch single greenhouse details when selectedGreenhouseId changes
  useEffect(() => {
    console.log('UserDashboard useEffect: selectedGreenhouseId changed to', selectedGreenhouseId);
    if (selectedGreenhouseId !== null) {
      const getGreenhouseDetails = async () => {
        try {
          console.log(`Attempting to fetch greenhouse details for ID: ${selectedGreenhouseId}`);
          const greenhouseDetails = await fetchGreenhouseById(selectedGreenhouseId);
          setSelectedGreenhouse(greenhouseDetails);
          console.log('Successfully fetched greenhouse details:', greenhouseDetails);
        } catch (err) {
          // Error is handled within the hook, just set selectedGreenhouse to null
          setSelectedGreenhouse(null);
          console.error('Error in useEffect fetching greenhouse details for ID:', selectedGreenhouseId, err);
        }
      };
      getGreenhouseDetails();
    } else {
      setSelectedGreenhouse(null);
      console.log('selectedGreenhouseId is null, not fetching greenhouse details.');
    }
  }, [selectedGreenhouseId, fetchGreenhouseById]); // Depend on fetchGreenhouseById as well

  const getMetricStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'temperature':
        return value < 20 ? 'low' : value > 30 ? 'high' : 'optimal'
      case 'humidity':
        return value < 50 ? 'low' : value > 80 ? 'high' : 'good'
      case 'soilMoisture':
        return value < 60 ? 'low' : value > 90 ? 'high' : 'optimal'
      case 'lightIntensity':
        return value < 40 ? 'low' : value > 80 ? 'high' : 'good'
      default:
        return 'normal'
    }
  }

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'text-blue-600'
      case 'high':
        return 'text-yellow-600'
      case 'optimal':
      case 'good':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  // Helper functions based on admin page - adapt as needed
  const getStatusColor = (status: string) => {
      switch (status) {
          case "active":
              return "text-green-600 bg-green-100";
          case "inactive":
              return "text-gray-600 bg-gray-100";
          case "maintenance":
              return "text-yellow-600 bg-yellow-100";
          case "error":
              return "text-red-600 bg-red-100";
          default:
              return "text-gray-600 bg-gray-100";
      }
  };

  const getStatusIcon = (status: string) => {
      switch (status) {
          case "active":
              return <CheckCircle className="h-4 w-4" />;
          case "inactive":
              return <Pause className="h-4 w-4" />;
          case "maintenance":
              return <Settings className="h-4 w-4" />;
          case "error":
              return <AlertTriangle className="h-4 w-4" />;
          default:
              return <Settings className="h-4 w-4" />;
      }
  };

  const getSystemIcon = (systemName: string) => {
      switch (systemName.toLowerCase()) {
          case "temperature control":
              return <Thermometer className="h-6 w-6" />;
          case "humidity control":
              return <Droplets className="h-6 w-6" />;
          case "led lighting system":
              return <Sun className="h-6 w-6" />;
          case "ventilation system":
              return <Wind className="h-6 w-6" />;
          case "irrigation system":
              return <Droplets className="h-6 w-6" />;
          case "power management":
              return <Zap className="h-6 w-6" />;
          default:
              return <Settings className="h-6 w-6" />;
      }
  };

  // Handlers for control actions - call the backend hook
  const handleUpdateSystemValue = async (systemId: number, newValue: number) => {
      if (selectedGreenhouseId === null) return; // Should not happen if UI is disabled
      console.log(`Attempting to update system ${systemId} in greenhouse ${selectedGreenhouseId} to value ${newValue}`);
      await controlSystem(selectedGreenhouseId, systemId, 'set_value', newValue);
      // Optionally re-fetch greenhouse data or update local state if controlSystem returns updated state
      // Since controlSystem currently just logs, we might need a mechanism to refresh data after successful control
  };

  const handleToggleSystemStatus = async (systemId: number, currentStatus: string) => {
      if (selectedGreenhouseId === null) return; // Should not happen if UI is disabled
      const action = currentStatus === 'active' ? 'stop' : 'start';
      console.log(`Attempting to ${action} system ${systemId} in greenhouse ${selectedGreenhouseId}`);
      await controlSystem(selectedGreenhouseId, systemId, action);
      // Optionally re-fetch greenhouse data or update local state
  };

  const handleToggleAutoMode = async (systemId: number, currentAutoMode: boolean) => {
       if (selectedGreenhouseId === null) return; // Should not happen if UI is disabled
       const action = currentAutoMode ? 'disable_auto' : 'enable_auto';
       console.log(`Attempting to ${action} for system ${systemId} in greenhouse ${selectedGreenhouseId}`);
       await controlSystem(selectedGreenhouseId, systemId, action);
       // Optionally re-fetch greenhouse data or update local state
  };

  // Always render the main structure, handle loading/errors inside
  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name || "User"}</h1>
              <p className="text-sm text-gray-600">Monitor your greenhouse environment</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Time</div>
                <div className="text-lg font-semibold text-gray-900">{currentTime.toLocaleTimeString()}</div>
              </div>
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Conditional rendering based on whether a greenhouse is selected */}
          {/* Display loading/error for fetching the default greenhouse */}
          {selectedGreenhouseId === null ? (
            <div className="text-center p-12">No default greenhouse specified.</div>
          ) : singleGreenhouseLoading ? (
             <div className="flex h-screen items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div><p className="mt-4 text-gray-600">Loading greenhouse details...</p></div></div>
           ) : singleGreenhouseError ? (
              <div className="flex h-screen items-center justify-center"><div className="text-center"><p className="text-red-600">Error loading greenhouse details: {singleGreenhouseError}</p><button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button></div></div>
           ) : metricsLoading ? (
             <div className="flex h-screen items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div><p className="mt-4 text-gray-600">Loading metrics...</p></div></div>
           ) : metricsError ? (
              <div className="flex h-screen items-center justify-center"><div className="text-center"><p className="text-red-600">Error: {metricsError}</p><button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button></div></div>
           ) : !metrics ? (
                <div className="flex h-screen items-center justify-center"><div className="text-center"><p className="text-gray-600">No metrics available for this greenhouse.</p></div></div>
           ) : (
            // Display metrics, charts, etc. if a greenhouse is selected and metrics are loaded
            <>
              {/* Current Environmental Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Temperature</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {metrics.temperature}
                        {/* Assuming metrics has temperature property directly */}
                        °C {/* Added missing unit */}
                      </p>
                      <p className={`text-sm ${getMetricColor(getMetricStatus('temperature', metrics.temperature))} capitalize`}>
                        {getMetricStatus('temperature', metrics.temperature)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Humidity</p>
                      <p className="text-3xl font-bold text-gray-900">
                         {metrics.humidity}
                        % {/* Added missing unit */}
                      </p>
                      <p className={`text-sm ${getMetricColor(getMetricStatus('humidity', metrics.humidity))} capitalize`}>
                        {getMetricStatus('humidity', metrics.humidity)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Soil Moisture</p>
                      <p className="text-3xl font-bold text-gray-900">
                         {metrics.soilMoisture}
                        % {/* Added missing unit */}
                      </p>
                      <p className={`text-sm ${getMetricColor(getMetricStatus('soilMoisture', metrics.soilMoisture))} capitalize`}>
                        {getMetricStatus('soilMoisture', metrics.soilMoisture)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6a2 2 0 11-4 0 2 2 0 014 0zM17 6a2 2 0 11-4 0 2 2 0 014 0zM12 18v-2m-3 3h6M8 13h.01M16 13h.01M12 16.01V16m0 0v-2m0 2h.01M12 16h-1m1 0h1m-1 0v-2m0 2v2m0 0h.01M12 18v-2m-3 3h6M8 13h.01M16 13h.01M12 16.01V16" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Light Intensity</p>
                      <p className="text-3xl font-bold text-gray-900">
                         {metrics.lightIntensity}
                        % {/* Added missing unit */}
                      </p>
                      <p className={`text-sm ${getMetricColor(getMetricStatus('lightIntensity', metrics.lightIntensity))} capitalize`}>
                        {getMetricStatus('lightIntensity', metrics.lightIntensity)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Environmental Trends */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Environmental Trends</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100" height="100">
                      <LineChart data={environmentalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#EF4444"
                          strokeWidth={2}
                          name="Temperature (°C)"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Humidity (%)"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="soilMoisture"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Soil Moisture (%)"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="lightIntensity"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Light Intensity (%)"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weekly Plant Growth */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Plant Growth</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100" height="100">
                      <AreaChart data={weeklyGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="growth"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.3}
                          name="Growth (cm)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Quick Actions and Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">Water Plants</div>
                      <div className="text-xs text-gray-500">Manual watering</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">Adjust Lighting</div>
                      <div className="text-xs text-gray-500">Control LED lights</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">Climate Control</div>
                      <div className="text-xs text-gray-500">Adjust temperature</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996-.608 2.296-.07 2.572 1.066z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">Settings</div>
                      <div className="text-xs text-gray-500">System preferences</div>
                    </button>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                            notification.type === "success"
                              ? "bg-green-500"
                              : notification.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{notification.message}</div>
                          <div className="text-xs text-gray-500">{notification.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plant Health Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plant Health Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6a2 2 0 11-4 0 2 2 0 014 0zM17 6a2 2 0 11-4 0 2 2 0 014 0zM12 18v-2m-3 3h6M8 13h.01M16 13h.01M12 16.01V16m0 0v-2m0 2h.01M12 16h-1m1 0h1m-1 0v-2m0 2v2m0 0h.01M12 18v-2m-3 3h6M8 13h.01M16 13h.01M12 16.01V16" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Healthy Plants</h4>
                    <p className="text-3xl font-bold text-green-600">95%</p>
                    <p className="text-sm text-gray-600">Plants in optimal condition</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Water Efficiency</h4>
                    <p className="text-3xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-gray-600">Water usage optimization</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Light Exposure</h4>
                    <p className="text-3xl font-bold text-yellow-600">92%</p>
                    <p className="text-sm text-gray-600">Optimal light distribution</p>
                  </div>
                </div>
              </div>

              {/* Greenhouse Systems Control Section */}
              {selectedGreenhouse && selectedGreenhouse.systems && selectedGreenhouse.systems.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Greenhouse Systems Control</h2>
                    {controlLoading && <div className="text-blue-600">Applying control action...</div>}
                    {controlError && <div className="text-red-600">Control Error: {controlError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedGreenhouse.systems.map((system: any) => (
                            <div key={system.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {/* Assuming system object has a 'color' property or derive from type/name */}
                                        <div className={`p-2 rounded-lg bg-${system.color || 'blue'}-100 text-${system.color || 'blue'}-600`}>
                                            {getSystemIcon(system.name)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{system.name}</h3>
                                            <div
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}
                                            >
                                                {getStatusIcon(system.status)}
                                                <span className="ml-1 capitalize">{system.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Current vs Target Values - Adjust property names based on backend response */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm text-gray-600">Current</div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {system.currentValue || 'N/A'}
                                                {system.unit || ''}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Target</div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                 {system.targetValue || 'N/A'}
                                                {system.unit || ''}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar - Adjust property names and logic */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`bg-${system.color || 'blue'}-500 h-2 rounded-full transition-all duration-300`}
                                            style={{ width: system.currentValue !== undefined && system.targetValue !== undefined && system.targetValue > 0 ? `${Math.min((system.currentValue / system.targetValue) * 100, 100)}%` : '0%' }}
                                        ></div>
                                    </div>

                                    {/* Controls */}
                                    <div className="space-y-3">
                                        {/* Target Value Control (if applicable and not in auto mode) */}
                                        {/* Assuming backend system object has a type or flag to indicate if target value is controllable */}
                                        {/* For simplicity, adding a basic slider based on admin, might need refinement */} 
                                        {!system.autoMode && typeof system.targetValue === 'number' && (
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-gray-700">Target Value</label>
                                                <input
                                                    type="range"
                                                    min="0" // Adjust min/max based on system type if needed
                                                    max="100" // Adjust min/max based on system type if needed
                                                    value={system.targetValue}
                                                    onChange={(e) => handleUpdateSystemValue(system.id, Number.parseInt(e.target.value))}
                                                    className="w-24"
                                                />
                                            </div>
                                         )}\n
                                        {/* Auto Mode Toggle */}\n+                                       {/* Assuming backend system object has a autoMode flag */}\n+                                       {'autoMode' in system && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Auto Mode</span>\n+                                               <button
                                                    onClick={() => handleToggleAutoMode(system.id, system.autoMode)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        system.autoMode ? "bg-blue-600" : "bg-gray-200"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            system.autoMode ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                         )}\n
                                        {/* Start/Stop Button */}\n+                                       {/* Assuming backend system object has a status */}\n+                                       {'status' in system && system.status !== 'maintenance' && system.status !== 'error' && (
                                             <div className="flex space-x-2">
                                                 <button
                                                     onClick={() => handleToggleSystemStatus(system.id, system.status)}
                                                     className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                         system.status === "active"
                                                             ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                             : "bg-green-100 text-green-700 hover:bg-green-200"
                                                     }`}
                                                 >
                                                     {system.status === "active" ? (
                                                         <>
                                                             <Pause className="h-4 w-4 inline mr-1" />
                                                             Stop
                                                         </>
                                                     ) : (
                                                         <>
                                                             <Play className="h-4 w-4 inline mr-1" />
                                                             Start
                                                         </>
                                                     )}
                                                 </button>
                                                 {/* Settings button - could link to a system-specific settings page if needed */}
                                                 {/* <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                                      <Settings className="h-4 w-4" />
                                                  </button> */}
                                             </div>
                                         )}

                                        {/* Last Updated Info - Adjust property name */}
                                        {system.updated_at && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Last updated: {new Date(system.updated_at).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
