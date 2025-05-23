"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#2e7d32]">IDGAS</span>
          <span className="hidden text-xs text-gray-500 md:inline-block">
            Intelligent IoT-Driven Green House Automation System
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/" className="text-sm font-medium text-gray-900 hover:text-[#2e7d32]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-sm font-medium text-gray-900 hover:text-[#2e7d32]">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm font-medium text-gray-900 hover:text-[#2e7d32]">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm font-medium text-gray-900 hover:text-[#2e7d32]">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/auth/signin"
                className="bg-[#2e7d32] text-white hover:bg-[#1b5e20] px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className="block md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-b bg-white md:hidden">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/"
                  className="block text-sm font-medium text-gray-900 hover:text-[#2e7d32]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="block text-sm font-medium text-gray-900 hover:text-[#2e7d32]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-sm font-medium text-gray-900 hover:text-[#2e7d32]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block text-sm font-medium text-gray-900 hover:text-[#2e7d32]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="bg-[#2e7d32] text-white hover:bg-[#1b5e20] px-4 py-2 rounded-md transition-colors inline-block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
