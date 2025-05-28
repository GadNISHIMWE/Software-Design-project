"use client"

import type React from "react"

import { useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import {
  Settings,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Zap,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"

interface EnvironmentalMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  color: string
  trend: number[]
}

interface SystemControl {
  id: string
  name: string
  status: "on" | "off" | "normal" | "action_required"
  action?: string
}

interface GreenhouseSystem {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance" | "error"
  currentValue: number
  targetValue: number
  unit: string
  icon: React.ReactNode
  color: string
  autoMode: boolean
  lastUpdated: string
}

export default function AdminGreenhouseControl() {
  const [viewMode, setViewMode] = useState<"simple" | "advanced">("simple")

  const [metrics] = useState<EnvironmentalMetric[]>([
    {
      id: "temperature",
      name: "Temperature",
      value: 75,
      unit: "%",
      status: "normal",
      color: "bg-yellow-400",
      trend: [72, 74, 75, 76, 75, 74, 75],
    },
    {
      id: "soil_moisture",
      name: "Soil Moisture",
      value: 50,
      unit: "%",
      status: "warning",
      color: "bg-pink-200",
      trend: [55, 52, 50, 48, 50, 51, 50],
    },
    {
      id: "humidity",
      name: "Humidity",
      value: 81,
      unit: "%",
      status: "normal",
      color: "bg-green-500",
      trend: [78, 79, 80, 81, 82, 81, 81],
    },
    {
      id: "light_intensity",
      name: "Light Intensity",
      value: 50,
      unit: "%",
      status: "normal",
      color: "bg-gray-300",
      trend: [45, 47, 48, 50, 52, 50, 50],
    },
  ])

  const [controls, setControls] = useState<SystemControl[]>([
    {
      id: "ventilation",
      name: "Ventilation Fans",
      status: "off",
      action: "Turn On",
    },
    {
      id: "system1",
      name: "No action required",
      status: "normal",
    },
    {
      id: "irrigation",
      name: "Irrigation System",
      status: "off",
      action: "Turn On",
    },
    {
      id: "system2",
      name: "No action required",
      status: "normal",
    },
  ])

  const [systems, setSystems] = useState<GreenhouseSystem[]>([
    {
      id: "temperature",
      name: "Temperature Control",
      status: "active",
      currentValue: 24,
      targetValue: 25,
      unit: "°C",
      icon: <Thermometer className="h-6 w-6" />,
      color: "red",
      autoMode: true,
      lastUpdated: "2 minutes ago",
    },
    {
      id: "humidity",
      name: "Humidity Control",
      status: "active",
      currentValue: 65,
      targetValue: 70,
      unit: "%",
      icon: <Droplets className="h-6 w-6" />,
      color: "blue",
      autoMode: true,
      lastUpdated: "1 minute ago",
    },
    {
      id: "lighting",
      name: "LED Lighting System",
      status: "active",
      currentValue: 80,
      targetValue: 85,
      unit: "%",
      icon: <Sun className="h-6 w-6" />,
      color: "yellow",
      autoMode: false,
      lastUpdated: "5 minutes ago",
    },
    {
      id: "ventilation",
      name: "Ventilation System",
      status: "inactive",
      currentValue: 0,
      targetValue: 30,
      unit: "%",
      icon: <Wind className="h-6 w-6" />,
      color: "green",
      autoMode: true,
      lastUpdated: "10 minutes ago",
    },
    {
      id: "irrigation",
      name: "Irrigation System",
      status: "maintenance",
      currentValue: 45,
      targetValue: 60,
      unit: "%",
      icon: <Droplets className="h-6 w-6" />,
      color: "cyan",
      autoMode: false,
      lastUpdated: "30 minutes ago",
    },
    {
      id: "power",
      name: "Power Management",
      status: "active",
      currentValue: 87,
      targetValue: 90,
      unit: "%",
      icon: <Zap className="h-6 w-6" />,
      color: "purple",
      autoMode: true,
      lastUpdated: "1 minute ago",
    },
  ])

  const [schedules] = useState([
    { id: 1, system: "lighting", action: "Turn On", time: "06:00", active: true },
    { id: 2, system: "lighting", action: "Turn Off", time: "20:00", active: true },
    { id: 3, system: "irrigation", action: "Water Cycle", time: "08:00", active: true },
    { id: 4, system: "irrigation", action: "Water Cycle", time: "16:00", active: true },
  ])

  const handleControlAction = (controlId: string) => {
    setControls(
      controls.map((control) =>
        control.id === controlId
          ? {
              ...control,
              status: control.status === "off" ? "on" : "off",
              action: control.status === "off" ? "Turn Off" : "Turn On",
            }
          : control,
      ),
    )
  }

  const updateSystemValue = (systemId: string, newValue: number) => {
    setSystems(
      systems.map((system) =>
        system.id === systemId ? { ...system, targetValue: newValue, lastUpdated: "Just now" } : system,
      ),
    )
  }

  const toggleSystemStatus = (systemId: string) => {
    setSystems(
      systems.map((system) =>
        system.id === systemId
          ? {
              ...system,
              status: system.status === "active" ? "inactive" : "active",
              lastUpdated: "Just now",
            }
          : system,
      ),
    )
  }

  const toggleAutoMode = (systemId: string) => {
    setSystems(
      systems.map((system) =>
        system.id === systemId ? { ...system, autoMode: !system.autoMode, lastUpdated: "Just now" } : system,
      ),
    )
  }

  const renderSimpleChart = (trend: number[]) => {
    const max = Math.max(...trend)
    const min = Math.min(...trend)
    const range = max - min || 1

    return (
      <div className="h-16 flex items-end space-x-1">
        {trend.map((value, index) => (
          <div
            key={index}
            className="bg-gray-600 w-2 rounded-t"
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: "4px",
            }}
          />
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100"
      case "inactive":
        return "text-gray-600 bg-gray-100"
      case "maintenance":
        return "text-yellow-600 bg-yellow-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "inactive":
        return <Pause className="h-4 w-4" />
      case "maintenance":
        return <Settings className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  // Advanced Control View
  if (viewMode === "advanced") {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode("simple")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Simple View</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Advanced Greenhouse Control</h1>
                  <p className="text-sm text-gray-600">Full system control and monitoring</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Emergency Stop
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Auto Mode All
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((system) => (
                <div key={system.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${system.color}-100 text-${system.color}-600`}>
                        {system.icon}
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
                    {/* Current vs Target Values */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Current</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {system.currentValue}
                          {system.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Target</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {system.targetValue}
                          {system.unit}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${system.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min((system.currentValue / system.targetValue) * 100, 100)}%` }}
                      ></div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Target Value</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={system.targetValue}
                          onChange={(e) => updateSystemValue(system.id, Number.parseInt(e.target.value))}
                          className="w-24"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Auto Mode</span>
                        <button
                          onClick={() => toggleAutoMode(system.id)}
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

                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleSystemStatus(system.id)}
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
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Last updated: {system.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Automation Schedules */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Automation Schedules</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Schedule
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">System</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 capitalize">{schedule.system}</td>
                        <td className="py-3 px-4">{schedule.action}</td>
                        <td className="py-3 px-4">{schedule.time}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              schedule.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {schedule.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
              <div className="space-y-3">
                {[
                  { time: "14:30", action: "Temperature system adjusted to 25°C", type: "info" },
                  { time: "14:15", action: "Irrigation cycle completed", type: "success" },
                  { time: "14:00", action: "Humidity sensor calibrated", type: "info" },
                  { time: "13:45", action: "Warning: Ventilation system offline", type: "warning" },
                  { time: "13:30", action: "LED lighting schedule activated", type: "success" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${
                          log.type === "success"
                            ? "bg-green-500"
                            : log.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      ></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.action}</div>
                        <div className="text-xs text-gray-500">{log.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Simple Control View (Default)
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Greenhouse Control</h1>
              <p className="text-sm text-gray-600">Welcome Admin Gad</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewMode("advanced")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Advanced Control</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Environmental Metrics */}
          <div className="bg-white rounded-lg border-2 border-blue-300 p-6 mb-6">
            <h2 className="text-xl font-semibold text-center mb-6 border-b border-gray-300 pb-2">
              Welcome User Jean de Dieu
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => (
                <div key={metric.id} className="text-center">
                  <div className={`${metric.color} rounded-lg p-6 mb-2`}>
                    <div className="text-lg font-semibold text-gray-800 mb-1">{metric.name}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metric.value}
                      {metric.unit}
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="bg-gray-50 rounded p-2">
                    {renderSimpleChart(metric.trend)}
                    <div className="text-xs text-gray-500 mt-1">12h 14h 15h 16h</div>
                  </div>
                </div>
              ))}
            </div>

            {/* System Controls */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {controls.map((control) => (
                <div key={control.id} className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">{control.name}</div>

                  {control.action ? (
                    <button
                      onClick={() => handleControlAction(control.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        control.status === "on"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {control.action}
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">Normal</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <Thermometer className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Avg Temperature</div>
                  <div className="text-xl font-bold">24.5°C</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <Droplets className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Water Usage</div>
                  <div className="text-xl font-bold">245L</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <Sun className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Energy Usage</div>
                  <div className="text-xl font-bold">12.3kWh</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-600 text-white text-center py-3 mt-8">
          <p className="text-sm">© 2028 Smart Greenhouse Management System</p>
        </div>
      </div>
    </div>
  )
}
