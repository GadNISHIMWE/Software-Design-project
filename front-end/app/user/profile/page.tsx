"use client"

import { useState } from "react"
import UserSidebar from "@/components/user-sidebar"

export default function UserProfile() {
  const [profileData, setProfileData] = useState({
    username: "NiGad",
    nickname: "Boy",
    firstname: "Gad",
    lastname: "NISHIMWE",
    role: "User",
    displayName: "NiGad",
    email: "gad@gmail.com",
    whatsapp: "0790456904",
    website: "App.vercel.web",
    telegram: "@gad",
    bio: "Gad NISHIMWE is a student in University of Rwanda. He is also certified in Cisco with different certificate. He has currently residence in Kigali Rwanda",
  })

  const [oldPassword, setOldPassword] = useState("********")
  const [newPassword, setNewPassword] = useState("********")

  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b">
          <h1 className="text-lg font-medium">Welcome User NiGad</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium mb-4">Account Management</h2>

              <div className="w-32 h-32 bg-gray-300 rounded-md mb-4 relative">
                <button className="absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Upload Image +
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button className="bg-green-100 text-green-800 px-4 py-1 rounded text-sm">Change Password</button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium mb-4">Profile information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nickname</label>
                  <input
                    type="text"
                    value={profileData.nickname}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Firstname</label>
                  <input
                    type="text"
                    value={profileData.firstname}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ROLE</label>
                  <input
                    type="text"
                    value={profileData.role}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Lastname</label>
                  <input
                    type="text"
                    value={profileData.lastname}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Display name publicly as</label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">Contact info</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email (required)</label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={profileData.whatsapp}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="text"
                    value={profileData.website}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telegram</label>
                  <input
                    type="text"
                    value={profileData.telegram}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                    readOnly
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">About User</h3>
              <h4 className="text-sm font-medium mb-2">Biographic information</h4>

              <p className="text-sm text-gray-700">{profileData.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
