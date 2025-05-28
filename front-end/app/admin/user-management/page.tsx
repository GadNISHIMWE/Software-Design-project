"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Search, Filter } from "lucide-react"

interface User {
  id: number
  username: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended"
  permissions: {
    viewData: boolean
    controlSystems: boolean
    manageUsers: boolean
    viewReports: boolean
  }
  lastLogin?: string
  greenhouseAccess?: string[]
  joinDate: string
  farmLocation?: string
}

interface Permission {
  key: keyof User["permissions"]
  label: string
  description: string
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "gad",
      email: "gad@gmail.com",
      role: "Farmer",
      status: "active",
      permissions: { viewData: true, controlSystems: true, manageUsers: false, viewReports: true },
      lastLogin: "1 hour ago",
      greenhouseAccess: ["Greenhouse A"],
      joinDate: "2024-01-15",
      farmLocation: "Kigali, Rwanda",
    },
    {
      id: 2,
      username: "kabera",
      email: "kabera@gmail.com",
      role: "Farmer",
      status: "active",
      permissions: { viewData: true, controlSystems: true, manageUsers: false, viewReports: false },
      lastLogin: "30 minutes ago",
      greenhouseAccess: ["Greenhouse B"],
      joinDate: "2024-02-10",
      farmLocation: "Musanze, Rwanda",
    },
    {
      id: 3,
      username: "alice",
      email: "alice@gmail.com",
      role: "Farmer",
      status: "inactive",
      permissions: { viewData: true, controlSystems: false, manageUsers: false, viewReports: false },
      lastLogin: "2 days ago",
      greenhouseAccess: ["Greenhouse C"],
      joinDate: "2024-01-20",
      farmLocation: "Huye, Rwanda",
    },
    {
      id: 4,
      username: "bob",
      email: "bob@gmail.com",
      role: "Farmer",
      status: "suspended",
      permissions: { viewData: false, controlSystems: false, manageUsers: false, viewReports: false },
      lastLogin: "1 week ago",
      greenhouseAccess: [],
      joinDate: "2024-03-05",
      farmLocation: "Rubavu, Rwanda",
    },
    {
      id: 5,
      username: "jean",
      email: "jean@gmail.com",
      role: "User",
      status: "active",
      permissions: { viewData: true, controlSystems: false, manageUsers: false, viewReports: false },
      lastLogin: "5 minutes ago",
      greenhouseAccess: ["Greenhouse A"],
      joinDate: "2024-02-28",
      farmLocation: "Nyagatare, Rwanda",
    },
  ])

  const [editingUser, setEditingUser] = useState({
    id: 0,
    username: "",
    email: "",
    role: "",
    farmLocation: "",
  })

  const [showPermissions, setShowPermissions] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const permissions: Permission[] = [
    { key: "viewData", label: "View Data", description: "Access to view real-time and historical data" },
    { key: "controlSystems", label: "Control Systems", description: "Ability to control greenhouse systems" },
    { key: "manageUsers", label: "Manage Users", description: "Create, edit, and delete user accounts" },
    { key: "viewReports", label: "View Reports", description: "Access to system reports and analytics" },
  ]

  const handleEdit = (user: User) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      farmLocation: user.farmLocation || "",
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleSave = () => {
    if (editingUser.id === 0) {
      // Add new user
      const newUser: User = {
        ...editingUser,
        id: Math.max(...users.map((u) => u.id)) + 1,
        status: "active",
        permissions: { viewData: true, controlSystems: false, manageUsers: false, viewReports: false },
        lastLogin: "Never",
        greenhouseAccess: [],
        joinDate: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
    } else {
      // Update existing user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...editingUser } : user)))
    }
    setEditingUser({ id: 0, username: "", email: "", role: "", farmLocation: "" })
  }

  const updatePermission = (userId: number, permission: keyof User["permissions"], value: boolean) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, permissions: { ...user.permissions, [permission]: value } } : user,
      ),
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "Farmer":
        return "bg-green-100 text-green-800"
      case "User":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          let newStatus: "active" | "inactive" | "suspended"
          if (user.status === "active") newStatus = "inactive"
          else if (user.status === "inactive") newStatus = "suspended"
          else newStatus = "active"
          return { ...user, status: newStatus }
        }
        return user
      }),
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.farmLocation && user.farmLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Welcome Admin Gad</h1>
          <p className="text-sm text-gray-600">System Owner: Greenhouse Management Corp.</p>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Farmer & User Management</h2>
              <p className="text-gray-700">
                Manage farmer accounts and their access permissions to greenhouse systems. Control who can view data,
                operate systems, and access reports.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Roles</option>
                  <option value="Farmer">Farmers</option>
                  <option value="User">Users</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-gray-900">ID</th>
                    <th className="text-left py-3 font-medium text-gray-900">Username</th>
                    <th className="text-left py-3 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{user.id}</td>
                      <td className="py-3 font-medium">{user.username}</td>
                      <td className="py-3 text-gray-600">{user.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm ${getRoleColor(user.role)}`}>{user.role}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{user.farmLocation}</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowPermissions(showPermissions === user.id ? null : user.id)}
                            className="text-green-600 hover:underline text-sm font-medium"
                          >
                            Permissions
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className="text-orange-600 hover:underline text-sm font-medium"
                          >
                            Status
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:underline text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Permissions Section */}
            {users.map(
              (user) =>
                showPermissions === user.id && (
                  <div key={`permissions-${user.id}`} className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Manage Permissions for {user.username} ({user.role})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {permissions.map((permission) => (
                        <label key={permission.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={user.permissions[permission.key]}
                            onChange={(e) => updatePermission(user.id, permission.key, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      <p>
                        <strong>Last Login:</strong> {user.lastLogin} | <strong>Join Date:</strong> {user.joinDate}
                      </p>
                      <p>
                        <strong>Greenhouse Access:</strong> {user.greenhouseAccess?.join(", ") || "None"}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPermissions(null)}
                      className="mt-3 text-blue-600 text-sm hover:underline"
                    >
                      Close Permissions
                    </button>
                  </div>
                ),
            )}

            {/* Edit/Add User Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">ADD/EDIT FARMER</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select role</option>
                    <option value="Farmer">Farmer</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Farm Location</label>
                  <input
                    type="text"
                    value={editingUser.farmLocation}
                    onChange={(e) => setEditingUser({ ...editingUser, farmLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter farm location"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
