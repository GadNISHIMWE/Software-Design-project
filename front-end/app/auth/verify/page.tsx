"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function VerifyIdentity() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuth, verifyOTP, resendOTP, loading: authLoading, error: authError } = useAuth()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const email = searchParams.get("email")

  useEffect(() => {
    // Check if user is already authenticated
    if (checkAuth()) {
      router.push("/user/dashboard")
      return
    }

    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setResendDisabled(false)
    }
  }, [countdown, router, checkAuth])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const otpCode = code.join("")
      const response = await verifyOTP(email!, otpCode)
      
      // The redirection is now handled in the useAuth hook
      // No need to explicitly redirect here
    } catch (err: any) {
      setError(err.message || "Invalid verification code")
    }
  }

  const handleResendOTP = async () => {
    if (!email) return
    
    setResendDisabled(true)
    setCountdown(60)
    setError("")
    
    try {
      await resendOTP(email)
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    }
  }

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2e7d32]">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center text-red-600">
            Invalid verification link. Please try signing up again.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#2e7d32]">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#2e7d32]">IDGAS</h1>
            <p className="text-xs text-gray-500">Intelligent IoT-Driven Greenhouse Autonomous System</p>
            <h2 className="mt-4 text-xl font-semibold">Verify your identity</h2>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-700">
              We've sent a verification code to {email}. Please enter the code below to verify your account.
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
                  required
                  disabled={authLoading}
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                disabled={authLoading}
              >
                Back
              </button>

              <button 
                type="submit" 
                className="bg-[#2e7d32] text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              It may take a minute to receive a verification code.
              <br />
              Haven't received code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={resendDisabled || authLoading}
                className="text-[#2e7d32] hover:underline disabled:opacity-50"
              >
                {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <footer className="text-white text-xs text-center py-2 w-full">
        © {new Date().getFullYear()} Smart Greenhouse Management System
      </footer>
    </div>
  )
}
