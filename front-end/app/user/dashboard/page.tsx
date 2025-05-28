"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Thermometer, Droplets, Sprout, Sun, Bell, Settings } from "lucide-react"
import UserSidebar from "@/components/user-sidebar"
import { useGreenhouseMetrics } from "@/hooks/useGreenhouseMetrics"
import { useGreenhouses } from "@/hooks/useGreenhouses"

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
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<number | null>(null)

  const { greenhouses, loading: greenhousesLoading, error: greenhousesError } = useGreenhouses()
  const { metrics, loading: metricsLoading, error: metricsError } = useGreenhouseMetrics(selectedGreenhouseId!)

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

  // Set selected greenhouse when greenhouses are loaded
  useEffect(() => {
    if (greenhouses && greenhouses.length > 0) {
      setSelectedGreenhouseId(greenhouses[0].id)
    } else {
      setSelectedGreenhouseId(null)
    }
  }, [greenhouses])

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
          <p className="text-center">Please add a greenhouse to view metrics.</p>
        </div>
      </div>
    )
  }

  // If we have greenhouses, proceed to show metrics
  const selectedGreenhouse = greenhouses.find(gh => gh.id === selectedGreenhouseId)

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
        </div>
      </div>
    )
  }

  const currentMetrics = metrics ? {
    temperature: { 
      value: metrics.temperature, 
      unit: "°C", 
      status: getMetricStatus('temperature', metrics.temperature),
      color: getMetricColor(getMetricStatus('temperature', metrics.temperature))
    },
    humidity: { 
      value: metrics.humidity, 
      unit: "%", 
      status: getMetricStatus('humidity', metrics.humidity),
      color: getMetricColor(getMetricStatus('humidity', metrics.humidity))
    },
    soilMoisture: { 
      value: metrics.soilMoisture, 
      unit: "%", 
      status: getMetricStatus('soilMoisture', metrics.soilMoisture),
      color: getMetricColor(getMetricStatus('soilMoisture', metrics.soilMoisture))
    },
    lightIntensity: { 
      value: metrics.lightIntensity, 
      unit: "%", 
      status: getMetricStatus('lightIntensity', metrics.lightIntensity),
      color: getMetricColor(getMetricStatus('lightIntensity', metrics.lightIntensity))
    },
  } : null

  if (!currentMetrics) return null

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
          {selectedGreenhouseId === null ? (
            // Display message if no greenhouses are found
            <div className="text-center p-12 border border-gray-200 rounded-lg bg-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Greenhouses Found</h2>
              <p className="text-gray-600 mb-6">It looks like you haven't added any greenhouses yet.</p>
              {/* You might want to add a button or link to the add greenhouse page here */}
              <button className="px-6 py-3 bg-green-600 text-white rounded-md text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                Add Your First Greenhouse
              </button>
            </div>
          ) : (
            // Display metrics, charts, etc. if a greenhouse is selected
            <>
              {/* Current Environmental Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Temperature</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {currentMetrics.temperature.value}
                        {currentMetrics.temperature.unit}
                      </p>
                      <p className={`text-sm ${currentMetrics.temperature.color} capitalize`}>
                        {currentMetrics.temperature.status}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Thermometer className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Humidity</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {currentMetrics.humidity.value}
                        {currentMetrics.humidity.unit}
                      </p>
                      <p className={`text-sm ${currentMetrics.humidity.color} capitalize`}>
                        {currentMetrics.humidity.status}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Soil Moisture</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {currentMetrics.soilMoisture.value}
                        {currentMetrics.soilMoisture.unit}
                      </p>
                      <p className={`text-sm ${currentMetrics.soilMoisture.color} capitalize`}>
                        {currentMetrics.soilMoisture.status}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Sprout className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Light Intensity</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {currentMetrics.lightIntensity.value}
                        {currentMetrics.lightIntensity.unit}
                      </p>
                      <p className={`text-sm ${currentMetrics.lightIntensity.color} capitalize`}>
                        {currentMetrics.lightIntensity.status}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Sun className="h-6 w-6 text-yellow-600" />
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
                    <ResponsiveContainer width="100%" height="100%">
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
                    <ResponsiveContainer width="100%" height="100%">
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
                      <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Water Plants</div>
                      <div className="text-xs text-gray-500">Manual watering</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <Sun className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Adjust Lighting</div>
                      <div className="text-xs text-gray-500">Control LED lights</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <Thermometer className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Climate Control</div>
                      <div className="text-xs text-gray-500">Adjust temperature</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
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
                      <Sprout className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Healthy Plants</h4>
                    <p className="text-3xl font-bold text-green-600">95%</p>
                    <p className="text-sm text-gray-600">Plants in optimal condition</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Droplets className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Water Efficiency</h4>
                    <p className="text-3xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-gray-600">Water usage optimization</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sun className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Light Exposure</h4>
                    <p className="text-3xl font-bold text-yellow-600">92%</p>
                    <p className="text-sm text-gray-600">Optimal light distribution</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
