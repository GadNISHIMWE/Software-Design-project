"use client"

import type React from "react"

import { useState, useRef } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Camera, Eye, EyeOff, Save, Upload } from "lucide-react"

export default function AdminProfile() {
  const [profileData, setProfileData] = useState({
    username: "NiGad",
    nickname: "Boy",
    firstname: "Gad",
    lastname: "NISHIMWE",
    role: "Admin",
    displayName: "NiGad",
    email: "gad@gmail.com",
    whatsapp: "0790456904",
    website: "App.vercel.web",
    telegram: "@gad",
    bio: "Gad is a good farmer who most of the times use the green house to increase his product and make his farming all the times without considering to the climate he use technology to overcome climate issue.",
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }
    // Here you would typically send the password change request to your backend
    alert("Password changed successfully!")
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b">
          <h1 className="text-lg font-medium">Welcome Admin Gad</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Image and Password Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-6">Account Management</h2>

              {/* Profile Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                      {profileImage ? (
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-gray-600">
                          {profileData.firstname[0]}
                          {profileData.lastname[0]}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Change Password</h3>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-6">Profile Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nickname</label>
                  <input
                    type="text"
                    value={profileData.nickname}
                    onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstname}
                    onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastname}
                    onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={profileData.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={profileData.whatsapp}
                    onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telegram</label>
                  <input
                    type="text"
                    value={profileData.telegram}
                    onChange={(e) => setProfileData({ ...profileData, telegram: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
