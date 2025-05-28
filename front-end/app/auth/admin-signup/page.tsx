"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function AdminSignUp() {
  const router = useRouter()
  const { register, loading: authLoading, error: authError } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "admin" // Set role as admin
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Validate passwords match
      if (formData.password !== formData.password_confirmation) {
        setError("Passwords do not match")
        return
      }

      // Validate password strength
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      // Register admin with backend
      const response = await register(formData)
      
      // Check response for requires_email_verification flag before redirecting
      if (response && response.requires_email_verification && response.email) {
        // Store email in localStorage for OTP verification
        localStorage.setItem('pendingVerificationEmail', response.email);
        // Clear any existing auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to OTP verification page with email
        router.push(`/auth/verify?email=${encodeURIComponent(response.email)}`);
      } else {
        // Handle cases where verification is not required or response is unexpected
        console.log('Registration successful, but email verification not explicitly required in response.', response);
        setError('Registration successful, but email verification is required. Please try logging in.');
        router.push('/auth/signin');
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during registration")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 relative bg-white">
        {/* Green curved shape at the top right */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2e7d32] rounded-bl-full"></div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 z-10 relative">
          <div className="w-full max-w-md p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold">ADMIN SIGNUP</h1>
              <p className="text-sm text-gray-600 mt-2">Create Admin Account</p>
            </div>

            {(error || authError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error || authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]"
                  placeholder="Enter your name"
                  required
                  disabled={authLoading}
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
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]"
                  placeholder="Enter your email"
                  required
                  disabled={authLoading}
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
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]"
                  placeholder="Enter New password"
                  required
                  disabled={authLoading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  *Use strong password
                </span>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3FD3]"
                  placeholder="Confirm password"
                  required
                  disabled={authLoading}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#5D3FD3] text-white py-2 rounded-md transition-colors font-bold hover:bg-[#4A2FB8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "CREATING ADMIN ACCOUNT..." : "SIGN UP AS ADMIN"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm">Already have an account?</p>
              <Link href="/auth/signin" className="font-medium text-[#5D3FD3] hover:underline text-lg">
                Sign In here
              </Link>
            </div>
          </div>
        </div>

        <footer className="text-black text-xs text-center py-2 w-full relative z-10">
          © {new Date().getFullYear()} Smart Greenhouse Management System
        </footer>
      </div>
    </div>
  )
} 