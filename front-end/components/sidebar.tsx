"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, ChevronRight, Home, LogOut, User, Users } from "lucide-react"

interface SidebarProps {
  userType: "admin" | "user"
}

export default function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const isActive = (path: string) => pathname === path

  return (
    <aside className={`bg-white border-r transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {expanded ? (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#2e7d32]">IDGAS</span>
          </Link>
        ) : (
          <span className="text-xl font-bold text-[#2e7d32]">ID</span>
        )}
        <button onClick={() => setExpanded(!expanded)} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronRight className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href={`/${userType === "admin" ? "admin" : "user"}/dashboard`}
              className={`sidebar-link ${isActive(`/${userType === "admin" ? "admin" : "user"}/dashboard`) ? "active" : ""}`}
            >
              <Home className="h-5 w-5" />
              {expanded && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link
              href={`/${userType === "admin" ? "admin" : "user"}/profile`}
              className={`sidebar-link ${isActive(`/${userType === "admin" ? "admin" : "user"}/profile`) ? "active" : ""}`}
            >
              <User className="h-5 w-5" />
              {expanded && <span>Profile</span>}
            </Link>
          </li>

          <li>
            <Link
              href={`/${userType === "admin" ? "admin" : "user"}/real-time-data`}
              className={`sidebar-link ${isActive(`/${userType === "admin" ? "admin" : "user"}/real-time-data`) ? "active" : ""}`}
            >
              <BarChart2 className="h-5 w-5" />
              {expanded && <span>Real-time data</span>}
            </Link>
          </li>

          <li>
            <Link
              href={`/${userType === "admin" ? "admin" : "user"}/green-house`}
              className={`sidebar-link ${isActive(`/${userType === "admin" ? "admin" : "user"}/green-house`) ? "active" : ""}`}
            >
              <Home className="h-5 w-5" />
              {expanded && <span>Green House</span>}
            </Link>
          </li>

          {userType === "admin" && (
            <li>
              <Link
                href="/admin/user-management"
                className={`sidebar-link ${isActive("/admin/user-management") ? "active" : ""}`}
              >
                <Users className="h-5 w-5" />
                {expanded && <span>User Management</span>}
              </Link>
            </li>
          )}

          <li>
            <Link href="/logout" className="sidebar-link text-red-500 hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              {expanded && <span>Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
