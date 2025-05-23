"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyIdentity() {
  const router = useRouter()
  const [code, setCode] = useState(["", "", "", "", "", ""])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would verify the code with a backend here
    console.log("Verifying with code:", code.join(""))

    // Redirect to dashboard based on role (for demo, we'll go to admin)
    router.push("/admin/dashboard")
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
              protecting your account is our priority, please confirm your identity by providing the code sent to your
              Email/ Phone
            </p>
          </div>

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
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                cancel
              </button>

              <button type="submit" className="bg-[#2e7d32] text-white px-4 py-2 rounded-md text-sm">
                Next
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              It may take a minute to receive a verification Message.
              <br />
              Haven't received code? <button className="text-[#2e7d32] hover:underline">Resend it</button>
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
