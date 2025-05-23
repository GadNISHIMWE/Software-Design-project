"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function UserSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.includes(path)

  return (
    <div className="w-48 bg-white h-full border-r">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">IDGAS</h1>
        <p className="text-xs text-gray-500">Intelligent IoT-Driven Greenhouse Autonomous System</p>
      </div>

      <div className="p-4">
        <Link
          href="/user/dashboard"
          className={`sidebar-link ${isActive("/dashboard") ? "active" : ""} text-blue-600 font-medium`}
        >
          User Dashboard
        </Link>

        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="/user/profile"
              className={`sidebar-link ${isActive("/profile") ? "active" : ""} flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/user/real-time-data"
              className={`sidebar-link ${isActive("/real-time-data") ? "active" : ""} flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Real-time data
            </Link>
          </li>
          <li>
            <Link
              href="/user/green-house"
              className={`sidebar-link ${isActive("/green-house") ? "active" : ""} flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Green house control
            </Link>
          </li>
          <li>
            <Link
              href="/user/recommendations"
              className={`sidebar-link ${isActive("/recommendations") ? "active" : ""} flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              AI recommendations
            </Link>
          </li>
          <li>
            <Link href="/" className="sidebar-link flex items-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
