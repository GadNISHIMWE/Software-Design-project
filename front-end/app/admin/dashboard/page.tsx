"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Home, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"

// Sample data for charts
const weeklyData = [
  { name: "Mon", temperature: 24, humidity: 65, soilMoisture: 85, energy: 12.5 },
  { name: "Tue", temperature: 25, humidity: 68, soilMoisture: 82, energy: 13.2 },
  { name: "Wed", temperature: 23, humidity: 70, soilMoisture: 80, energy: 11.8 },
  { name: "Thu", temperature: 26, humidity: 62, soilMoisture: 78, energy: 14.1 },
  { name: "Fri", temperature: 27, humidity: 60, soilMoisture: 75, energy: 15.3 },
  { name: "Sat", temperature: 25, humidity: 63, soilMoisture: 80, energy: 13.7 },
  { name: "Sun", temperature: 24, humidity: 67, soilMoisture: 83, energy: 12.9 },
]

const realtimeData = [
  { time: "00:00", temperature: 22, humidity: 68, soilMoisture: 82 },
  { time: "04:00", temperature: 21, humidity: 70, soilMoisture: 80 },
  { time: "08:00", temperature: 24, humidity: 65, soilMoisture: 78 },
  { time: "12:00", temperature: 27, humidity: 60, soilMoisture: 75 },
  { time: "16:00", temperature: 26, humidity: 62, soilMoisture: 77 },
  { time: "20:00", temperature: 24, humidity: 66, soilMoisture: 80 },
]

const systemStatusData = [
  { name: "Active", value: 85, color: "#10B981" },
  { name: "Warning", value: 10, color: "#F59E0B" },
  { name: "Error", value: 5, color: "#EF4444" },
]

export default function AdminDashboard() {
  const [activeMetric, setActiveMetric] = useState<"temperature" | "humidity" | "soilMoisture" | "energy">(
    "temperature",
  )
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "#EF4444"
      case "humidity":
        return "#3B82F6"
      case "soilMoisture":
        return "#10B981"
      case "energy":
        return "#F59E0B"
      default:
        return "#2e7d32"
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "🌡️"
      case "humidity":
        return "💧"
      case "soilMoisture":
        return "🌱"
      case "energy":
        return "⚡"
      default:
        return "📊"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Admin Gad</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Time</div>
              <div className="text-lg font-semibold text-gray-900">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+12%</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Greenhouses</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">All operational</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600">1 attention</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">98.5%</p>
                  <div className="flex items-center mt-1">
                    <Activity className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Excellent</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Metrics Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {(["temperature", "humidity", "soilMoisture", "energy"] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    activeMetric === metric
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{getMetricIcon(metric)}</div>
                    <div className="text-xs font-medium text-gray-900 capitalize">
                      {metric === "soilMoisture" ? "Soil Moisture" : metric}
                    </div>
                    <div className="text-sm font-bold" style={{ color: getMetricColor(metric) }}>
                      {metric === "temperature" && "24°C"}
                      {metric === "humidity" && "65%"}
                      {metric === "soilMoisture" && "85%"}
                      {metric === "energy" && "13.2 kWh"}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey={activeMetric}
                    fill={getMetricColor(activeMetric)}
                    radius={[4, 4, 0, 0]}
                    name={
                      activeMetric === "temperature"
                        ? "Temperature (°C)"
                        : activeMetric === "humidity"
                          ? "Humidity (%)"
                          : activeMetric === "soilMoisture"
                            ? "Soil Moisture (%)"
                            : "Energy (kWh)"
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time Data and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Real-time Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Real-time Trends</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Temp</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Humidity</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Soil</span>
                </div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
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
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Humidity (%)"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="soilMoisture"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Soil Moisture (%)"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">System Status</h3>
              <div className="flex items-center justify-between h-40">
                <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={systemStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {systemStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-4 space-y-2">
                  {systemStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { action: "User Jean de Dieu logged in", time: "2 min ago", type: "success" },
                  { action: "Temperature alert triggered", time: "15 min ago", type: "warning" },
                  { action: "Irrigation system activated", time: "1 hour ago", type: "info" },
                  { action: "New user registered: Marie", time: "2 hours ago", type: "success" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/user-management"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-900">Manage Users</div>
                </Link>
                <Link
                  href="/admin/real-time-data"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Activity className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-900">View Data</div>
                </Link>
                <Link
                  href="/admin/green-house"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Home className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-900">Control Systems</div>
                </Link>
                <Link
                  href="/admin/recommendations"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-900">View Alerts</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
