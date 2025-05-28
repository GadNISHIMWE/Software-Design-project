"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Lightbulb, Thermometer, LogOut, User } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/real-time-data", icon: BarChart3, label: "Real-time Data" },
    { href: "/admin/green-house", icon: Thermometer, label: "Greenhouse Control" },
    { href: "/admin/user-management", icon: Users, label: "User Management" },
    { href: "/admin/recommendations", icon: Lightbulb, label: "AI Recommendations" },
    { href: "/admin/profile", icon: User, label: "Profile" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Thermometer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">IDGAS</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-green-100 text-green-700 border-r-2 border-green-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-green-600" : "text-gray-500"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Admin Gad</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
        </div>

        <Link
          href="/auth/signin"
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  )
}
