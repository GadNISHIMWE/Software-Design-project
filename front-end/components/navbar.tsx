"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState("")

  useEffect(() => {
    // Set active link based on current path
    if (pathname === "/") setActiveLink("home")
    else if (pathname === "/about") setActiveLink("about")
    else if (pathname === "/contact") setActiveLink("contact")
    else if (pathname.includes("/dashboard")) setActiveLink("dashboard")
  }, [pathname])

  return (
    <div className="flex h-14 items-center justify-between bg-white px-4 md:px-8 border-b border-gray-300">
      <div className="flex items-center">
        <h1 className="text-xl font-bold uppercase">IDGAS</h1>
        <p className="ml-2 hidden text-[10px] text-gray-600 md:block">
          Intelligent IoT-Driven Greenhouse Autonomous System
        </p>
      </div>

      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className={`text-sm ${activeLink === "home" ? "text-[#2e7d32] font-medium" : "text-gray-700"}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/auth/signin"
              className={`text-sm ${activeLink === "dashboard" ? "text-[#2e7d32] font-medium" : "text-gray-700"}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`text-sm ${activeLink === "contact" ? "text-[#2e7d32] font-medium" : "text-gray-700"}`}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`text-sm ${activeLink === "about" ? "text-[#2e7d32] font-medium" : "text-gray-700"}`}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
