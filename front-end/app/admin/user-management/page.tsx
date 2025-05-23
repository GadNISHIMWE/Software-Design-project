"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"

interface User {
  id: number
  username: string
  email: string
  role: string
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "Kabera", email: "kabera@gmail.com", role: "admin" },
    { id: 2, username: "gad@gmail.com", email: "gad@gmail.com", role: "farmer" },
    { id: 3, username: "Leti", email: "leti@gmail.com", role: "farmer" },
  ])

  const [editingUser, setEditingUser] = useState({
    id: 0,
    username: "",
    email: "",
    role: "",
  })

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleSave = () => {
    // In a real app, you would update the user in the backend
    setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
    setEditingUser({ id: 0, username: "", email: "", role: "" })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b">
          <h1 className="text-lg font-medium">welcome Admin gad</h1>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-medium mb-4">
              Welcome to the admin portal following are the number of users in the system you can modify them or delete
              them
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-medium">Username</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3">{user.username}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">{user.role}</td>
                      <td className="py-3">
                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline mr-2">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editingUser.id > 0 && (
              <div className="mt-6 p-4 border border-gray-300 rounded-md">
                <h3 className="text-lg font-medium mb-4">Edit/Add User</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="admin">Admin</option>
                      <option value="farmer">Farmer</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <button
                    onClick={() => setEditingUser({ id: 0, username: "", email: "", role: "" })}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-md">
                    SAVE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
