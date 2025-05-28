"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Thermometer, Droplets, Sprout, Sun } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"

// Sample data for charts - matching version 28
const data = [
  { time: "12h", temperature: 24, humidity: 65, soilMoisture: 85, lightIntensity: 70 },
  { time: "14h", temperature: 25, humidity: 68, soilMoisture: 82, lightIntensity: 75 },
  { time: "16h", temperature: 23, humidity: 70, soilMoisture: 80, lightIntensity: 65 },
  { time: "18h", temperature: 26, humidity: 62, soilMoisture: 78, lightIntensity: 50 },
  { time: "20h", temperature: 27, humidity: 60, soilMoisture: 75, lightIntensity: 30 },
  { time: "22h", temperature: 25, humidity: 63, soilMoisture: 80, lightIntensity: 10 },
]

const currentMetrics = [
  { name: "Temperature", value: 75, color: "#F59E0B", icon: Thermometer, unit: "°C", actual: "24°C" },
  { name: "Humidity", value: 65, color: "#10B981", icon: Droplets, unit: "%", actual: "65%" },
  { name: "Soil Moisture", value: 80, color: "#EF4444", icon: Sprout, unit: "%", actual: "80%" },
  { name: "Light Intensity", value: 50, color: "#3B82F6", icon: Sun, unit: "%", actual: "64%" },
]

export default function AdminRealTimeData() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium">Welcome Admin gad</h1>
            <div className="text-sm text-gray-600">Last Updated: {currentTime.toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            {/* Current Metrics Display */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {currentMetrics.map((metric, index) => {
                  const IconComponent = metric.icon
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-sm font-medium">{metric.name}</div>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <span className="text-sm" style={{ color: metric.color }}>
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Main Chart - Same as Version 28 */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} name="Temperature" />
                  <Line type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={2} name="Humidity" />
                  <Line type="monotone" dataKey="soilMoisture" stroke="#EF4444" strokeWidth={2} name="Soil Moisture" />
                  <Line
                    type="monotone"
                    dataKey="lightIntensity"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Light Intensity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
