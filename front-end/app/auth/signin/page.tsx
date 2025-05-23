"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would authenticate with a backend here
    console.log("Signing in with:", formData)

    // Redirect to verification page
    router.push("/auth/verify")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 relative bg-gradient-to-b from-white to-[#2e7d32]">
        {/* Green curved shape at the top right */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2e7d32] rounded-bl-full"></div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 z-10 relative">
          <div className="w-full max-w-md p-8">
            <div className="mb-8 text-left">
              <h1 className="text-2xl font-bold">Welcome</h1>
              <h2 className="text-xl font-bold">To</h2>
              <p className="text-xl font-bold">Intelligent IOT- Driven Green house</p>
              <p className="text-xl font-bold">Authomation System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <div className="mt-1 text-right">
                  <Link href="/auth/forgot-password" className="text-xs text-[#5D3FD3] hover:underline">
                    Forgot password
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#5D3FD3] text-white py-2 rounded-md transition-colors font-bold"
                >
                  SIGN IN
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm">Don&apos;t have an account</p>
              <Link href="/auth/signup" className="font-medium text-[#5D3FD3] hover:underline text-lg">
                SIGN Up here
              </Link>
              <p className="mt-1">or</p>
              <Link href="/auth/guest" className="font-medium text-[#5D3FD3] hover:underline">
                Login as Guest
              </Link>
            </div>
          </div>
        </div>

        <footer className="text-white text-xs text-center py-2 w-full relative z-10">
          © {new Date().getFullYear()} Smart Greenhouse Management System
        </footer>
      </div>
    </div>
  )
}
