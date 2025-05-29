"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Search, Filter } from "lucide-react"
import api from "@/lib/api"

interface User {
  id: number
  username: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended"
  isAdmin: boolean
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
  name: string
  is_logged_in: boolean
}

interface Permission {
  key: keyof User["permissions"]
  label: string
  description: string
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)

  const [editingUser, setEditingUser] = useState({
    id: 0,
    username: "",
    email: "",
    role: "",
    farmLocation: "",
    name: "",
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        const response = await api.get("/api/users")

        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          const fetchedUsers: User[] = response.data.data.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.isAdmin ? "Admin" : "User",
            isAdmin: user.isAdmin,
            status: user.status || "N/A",
            permissions: user.permissions || {},
            lastLogin: user.lastLogin,
            greenhouseAccess: user.greenhouseAccess,
            joinDate: user.joinDate,
            farmLocation: user.farmLocation,
            name: user.name,
            is_logged_in: user.is_logged_in,
          }))
          setUsers(fetchedUsers)
        } else {
          setUsersError(response.data.message || "Unexpected response format")
        }
      } catch (err: any) {
        setUsersError(err.message || "Failed to fetch users")
      } finally {
        setUsersLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleEdit = (user: User) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      farmLocation: user.farmLocation || "",
      name: user.name,
    })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await api.delete(`/api/users/${id}`)
        if (response.data.status === 'success') {
          setUsers(users.filter((user) => user.id !== id))
          console.log(response.data.message)
        } else {
          console.error('Failed to delete user:', response.data.message)
        }
      } catch (err: any) {
        console.error('Failed to delete user:', err)
      }
    }
  }

  const handleSave = async () => {
    try {
      if (editingUser.id === 0) {
        // Add new user
        const newUserPayload = {
          name: editingUser.name,
          username: editingUser.username,
          email: editingUser.email,
          password: "password",
          role: editingUser.role,
        }

        const response = await api.post("/api/users", newUserPayload)

        if (response.data.status === "success" && response.data.data) {
          console.log(response.data.message)
          setUsers([...users, response.data.data])
          setEditingUser({ id: 0, username: "", email: "", role: "", farmLocation: "", name: "" })
        } else {
          console.error("Failed to create user:", response.data.message)
        }
      } else {
        // Update existing user
        const updatedUserPayload = {
          name: editingUser.name,
          username: editingUser.username,
          email: editingUser.email,
          role: editingUser.role,
        }

        const response = await api.put(`/api/users/${editingUser.id}`, updatedUserPayload)

        if (response.data.status === "success" && response.data.data) {
          console.log(response.data.message)
          setUsers(users.map(user => user.id === editingUser.id ? response.data.data : user))
          setEditingUser({ id: 0, username: "", email: "", role: "", farmLocation: "", name: "" })
        } else {
          console.error("Failed to update user:", response.data.message)
        }
      }
    } catch (err: any) {
      console.error("Error saving user:", err)
    }
  }

  const updatePermission = async (userId: number, permission: keyof User["permissions"], value: boolean) => {
    try {
      const userToUpdate = users.find(user => user.id === userId)

      if (!userToUpdate) {
        console.error(`User with ID ${userId} not found.`)
        return
      }

      const updatedPermissions = {
        ...userToUpdate.permissions,
        [permission]: value,
      }

      const response = await api.put(`/api/users/${userId}/permissions`, { permissions: updatedPermissions })

      if (response.data.status === 'success') {
        console.log(response.data.message)
        setUsers(users.map(user => user.id === userId ? { ...user, permissions: updatedPermissions } : user))
      } else {
        console.error('Failed to update user permissions:', response.data.message)
      }
    } catch (err: any) {
      console.error('Failed to update user permissions:', err)
    }
  }

  const toggleUserStatus = async (userId: number) => {
    console.log(`Toggling status for user ${userId}`)

    try {
      const response = await api.post(`/api/users/${userId}/toggle-status`)
      if (response.data.status === 'success') {
        console.log(response.data.message)
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: response.data.user.status } : user
        ))
      } else {
        console.error('Failed to toggle user status:', response.data.message)
      }
    } catch (err: any) {
      console.error('Failed to toggle user status:', err)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "farmer":
        return "bg-green-100 text-green-800"
      case "user":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800"
    switch (status.toLowerCase()) {
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.farmLocation && user.farmLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  const fetchUsers = async () => {
    try {
      await useEffect(() => {
        const fetchUsers = async () => {
          try {
            setUsersLoading(true)
            const response = await api.get("/api/users")

            if (response.data.status === "success" && Array.isArray(response.data.data)) {
              const fetchedUsers: User[] = response.data.data.map((user: any) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.isAdmin ? "Admin" : "User",
                isAdmin: user.isAdmin,
                status: user.status || "N/A",
                permissions: user.permissions || {},
                lastLogin: user.lastLogin,
                greenhouseAccess: user.greenhouseAccess,
                joinDate: user.joinDate,
                farmLocation: user.farmLocation,
                name: user.name,
                is_logged_in: user.is_logged_in,
              }))
              setUsers(fetchedUsers)
            } else {
              setUsersError(response.data.message || "Unexpected response format")
            }
          } catch (err: any) {
            setUsersError(err.message || "Failed to fetch users")
          } finally {
            setUsersLoading(false)
          }
        }

        fetchUsers()
      }, [])
    } catch (err: any) {
      console.error("Error refreshing users:", err)
    }
  }

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
            <div className="flex items-center justify-between space-x-4 mb-6">
              <div className="flex items-center space-x-4">
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
                    <option value="admin">Admins</option>
                    <option value="user">Users</option>
                  </select>
                </div>
              </div>
              {/* Refresh Button */}
              <button
                onClick={fetchUsers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Refresh
              </button>
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <div>Loading users...</div>
            ) : usersError ? (
              <div className="text-red-600">Error loading users: {usersError}</div>
            ) : filteredUsers.length === 0 ? (
              <div>No users found matching your criteria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_logged_in ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.is_logged_in ? 'Online' : 'Offline'}
                          </span>
                          {user.status && user.status !== 'active' && (
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status === "inactive" ? "Inactive" : user.status === "suspended" ? "Suspended" : "Unknown"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.farmLocation || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                          <button onClick={() => setShowPermissions(showPermissions === user.id ? null : user.id)} className="text-green-600 hover:text-green-900 mr-4">Permissions</button>
                          <button onClick={() => toggleUserStatus(user.id)} className="text-yellow-600 hover:text-yellow-900 mr-4">Status</button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingUser.id === 0 ? "Add New User" : "Edit User"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="editName" name="name" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="editUsername" className="block text-sm font-medium text-gray-700">Username</label>
                  <input type="text" id="editUsername" name="username" value={editingUser.username} onChange={(e) => setEditingUser({...editingUser, username: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="editEmail" name="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="editRole" className="block text-sm font-medium text-gray-700">Role</label>
                  <select id="editRole" name="role" value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={handleSave} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4">{editingUser.id === 0 ? "Add User" : "Save Changes"}</button>
                <button onClick={() => setEditingUser({ id: 0, username: "", email: "", role: "", farmLocation: "", name: "" })} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
