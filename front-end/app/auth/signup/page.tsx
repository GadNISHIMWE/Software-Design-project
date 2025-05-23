"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock } from "lucide-react"

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would register with a backend here
    console.log("Signing up with:", formData)

    // Redirect to verification page
    router.push("/auth/verify")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 relative bg-white">
        {/* Green curved shape at the top right */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2e7d32] rounded-bl-full"></div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 z-10 relative">
          <div className="w-full max-w-md p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold">SIGNUP FORM</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter New password"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  *Use strong password
                </span>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#5D3FD3] text-white py-2 rounded-md transition-colors font-bold"
                >
                  SIGN UP
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer className="text-black text-xs text-center py-2 w-full relative z-10">
          © {new Date().getFullYear()} Smart Greenhouse Management System
        </footer>
      </div>
    </div>
  )
}
