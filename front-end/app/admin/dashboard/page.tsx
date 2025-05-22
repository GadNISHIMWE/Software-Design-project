"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowRight } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"

// Sample data for charts
const data = [
  { name: "Mon", temperature: 24, humidity: 65, soilMoisture: 85 },
  { name: "Tue", temperature: 25, humidity: 68, soilMoisture: 82 },
  { name: "Wed", temperature: 23, humidity: 70, soilMoisture: 80 },
  { name: "Thu", temperature: 26, humidity: 62, soilMoisture: 78 },
  { name: "Fri", temperature: 27, humidity: 60, soilMoisture: 75 },
  { name: "Sat", temperature: 25, humidity: 63, soilMoisture: 80 },
  { name: "Sun", temperature: 24, humidity: 67, soilMoisture: 83 },
]

export default function AdminDashboard() {
  const [activeMetric, setActiveMetric] = useState<"temperature" | "humidity" | "soilMoisture">("temperature")

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "#f44336"
      case "humidity":
        return "#2196f3"
      case "soilMoisture":
        return "#4caf50"
      default:
        return "#2e7d32"
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b">
          <h1 className="text-lg font-medium">Welcome Admin Gad</h1>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-medium mb-4">Dashboard Overview</h2>

            <p className="text-sm text-gray-700">
              Welcome to the IDGAS Admin Dashboard. From here, you can manage users, view real-time data, and access all
              administrative functions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700">Users</h3>
                <p className="text-2xl font-bold mt-2">3</p>
                <p className="text-sm text-gray-600 mt-1">Total registered users</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-700">Greenhouses</h3>
                <p className="text-2xl font-bold mt-2">1</p>
                <p className="text-sm text-gray-600 mt-1">Active greenhouses</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-700">Alerts</h3>
                <p className="text-2xl font-bold mt-2">0</p>
                <p className="text-sm text-gray-600 mt-1">Active alerts</p>
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className={`cursor-pointer rounded-lg p-4 shadow-sm transition-all ${activeMetric === "temperature" ? "bg-red-50 ring-2 ring-red-500" : "bg-white hover:bg-red-50"}`}
              onClick={() => setActiveMetric("temperature")}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Temperature</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <span className="text-sm font-semibold text-red-600">24°C</span>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-red-500" style={{ width: "70%" }}></div>
              </div>
            </div>

            <div
              className={`cursor-pointer rounded-lg p-4 shadow-sm transition-all ${activeMetric === "humidity" ? "bg-blue-50 ring-2 ring-blue-500" : "bg-white hover:bg-blue-50"}`}
              onClick={() => setActiveMetric("humidity")}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Humidity</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-semibold text-blue-600">65%</span>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div
              className={`cursor-pointer rounded-lg p-4 shadow-sm transition-all ${activeMetric === "soilMoisture" ? "bg-green-50 ring-2 ring-green-500" : "bg-white hover:bg-green-50"}`}
              onClick={() => setActiveMetric("soilMoisture")}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Soil Moisture</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="text-sm font-semibold text-green-600">85%</span>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-green-500" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Weekly{" "}
              {activeMetric === "temperature"
                ? "Temperature"
                : activeMetric === "humidity"
                  ? "Humidity"
                  : "Soil Moisture"}{" "}
              Trends
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey={activeMetric}
                    fill={getMetricColor(activeMetric)}
                    name={
                      activeMetric === "temperature"
                        ? "Temperature (°C)"
                        : activeMetric === "humidity"
                          ? "Humidity (%)"
                          : "Soil Moisture (%)"
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  There is no recommendation at this moment as things in the green house is normal. We&apos;ll notify
                  you in case of any anomaly you can solve or try our recommendations.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 font-medium">Username</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Role</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">user1</td>
                      <td className="py-2">user1@example.com</td>
                      <td className="py-2">User</td>
                      <td className="py-2">
                        <button className="text-xs text-blue-600 hover:underline">Edit</button>
                        {" | "}
                        <button className="text-xs text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">user2</td>
                      <td className="py-2">user2@example.com</td>
                      <td className="py-2">User</td>
                      <td className="py-2">
                        <button className="text-xs text-blue-600 hover:underline">Edit</button>
                        {" | "}
                        <button className="text-xs text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-right">
                <Link
                  href="/admin/user-management"
                  className="text-sm text-[#2e7d32] hover:underline inline-flex items-center"
                >
                  View all users
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
