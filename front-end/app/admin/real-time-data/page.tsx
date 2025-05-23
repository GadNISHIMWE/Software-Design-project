"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import AdminSidebar from "@/components/admin-sidebar"

// Sample data for charts
const data = [
  { time: "12h", temperature: 24, humidity: 65, soilMoisture: 85, lightIntensity: 70 },
  { time: "14h", temperature: 25, humidity: 68, soilMoisture: 82, lightIntensity: 75 },
  { time: "16h", temperature: 23, humidity: 70, soilMoisture: 80, lightIntensity: 65 },
  { time: "18h", temperature: 26, humidity: 62, soilMoisture: 78, lightIntensity: 50 },
  { time: "20h", temperature: 27, humidity: 60, soilMoisture: 75, lightIntensity: 30 },
  { time: "22h", temperature: 25, humidity: 63, soilMoisture: 80, lightIntensity: 10 },
]

export default function AdminRealTimeData() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b">
          <h1 className="text-lg font-medium">welcome Admin gad</h1>
        </div>

        <div className="p-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium">Temperature</div>
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                    <span className="text-yellow-600 text-sm">24%</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium">Humidity</div>
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <span className="text-green-600 text-sm">65%</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium">Soil Moisture</div>
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                    <span className="text-red-600 text-sm">80%</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium">LightIntensity</div>
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <span className="text-blue-600 text-sm">64%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="soilMoisture" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="lightIntensity" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
