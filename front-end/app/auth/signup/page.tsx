"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function SignUp() {
  const router = useRouter()
  const { register, loading: authLoading, error: authError } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
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

      // Register user with backend
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
      <div className="flex-1 relative bg-gradient-to-b from-white to-[#2e7d32]">
        {/* Green curved shape at the top right */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2e7d32] rounded-bl-full"></div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 z-10 relative">
          <div className="w-full max-w-md p-8">
            <div className="mb-8 text-left">
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-sm text-gray-600 mt-2">Join our system</p>
            </div>

            {(error || authError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error || authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="enter your full name"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Repeat your password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#2e7d32] text-white py-2 rounded-md transition-colors font-bold hover:bg-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Creating Account..." : "Sign up"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/signin" className="font-medium text-[#2e7d32] hover:text-[#1b5e20]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
