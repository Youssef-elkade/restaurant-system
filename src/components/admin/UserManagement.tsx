import React, { useState } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import DeleteConfirmModal from "../DeleteConfirmModal";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "customer" | "admin" | "chef" | "delivery";
  phone?: string;
  address?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(() => {
    return JSON.parse(localStorage.getItem("users") || "[]");
  });

  const [filterRole, setFilterRole] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    field: "name" | "role" | null;
    direction: "asc" | "desc";
  }>({
    field: null,
    direction: "asc",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "customer" as User["role"],
    phone: "",
    address: "",
  });

  const updateLocalStorage = (updatedUsers: User[]) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleAddUser = () => {
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Please fill in all required fields", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    if (users.some((u) => u.email === formData.email)) {
      toast.error("Email already exists", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    const newUser: User = {
      ...formData,
      id: Date.now().toString(),
    };

    updateLocalStorage([...users, newUser]);
    toast.success("User added successfully", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    if (!formData.email || !formData.name) {
      toast.error("Please fill in all required fields", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    const updatedUsers = users.map((u) =>
      u.id === editingUser.id
        ? { ...u, ...formData, password: formData.password || u.password }
        : u
    );

    updateLocalStorage(updatedUsers);
    toast.success("User updated successfully", {
      action: {
        label: "X",
        onClick: () => toast.dismiss(),
      },
    });
    setEditingUser(null);
    resetForm();
  };

  const openDeleteModal = (userId: string, userName: string) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const handleDeleteUser = () => {
    if (deleteModal.userId) {
      const updatedUsers = users.filter((u) => u.id !== deleteModal.userId);
      updateLocalStorage(updatedUsers);
      toast.success("User deleted successfully", {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      setDeleteModal({ isOpen: false, userId: null, userName: "" });
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "customer",
      phone: "",
      address: "",
    });
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const roles = ["All", ...Array.from(new Set(users.map((user) => user.role)))];
  const capitalizeRole = (role: string) =>
    role.charAt(0).toUpperCase() + role.slice(1);

  const roleOrder: User["role"][] = ["admin", "chef", "delivery", "customer"];

  const handleSort = (field: "name" | "role") => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
  };

  const filteredUsers = users.filter((user) =>
    filterRole === "All" ? true : user.role === filterRole
  );

  const searchedUsers = filteredUsers.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  const displayedUsers = (() => {
    if (!sortConfig.field) return searchedUsers;

    const sorted = [...searchedUsers];

    sorted.sort((a, b) => {
      if (sortConfig.field === "name") {
        const result = a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
        return sortConfig.direction === "asc" ? result : -result;
      } else {
        const aIndex = roleOrder.indexOf(a.role);
        const bIndex = roleOrder.indexOf(b.role);
        const result = aIndex - bIndex;
        return sortConfig.direction === "asc" ? result : -result;
      }
    });

    return sorted;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, userId: null, userName: "" })
        }
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-900 dark:text-white">User Management</h1>
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setEditingUser(null);
              resetForm();
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filterRole === role
                    ? "bg-orange-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {role === "All" ? "All Roles" : capitalizeRole(role)}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    <button
                      type="button"
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 cursor-pointer select-none"
                    >
                      <span>Name</span>
                      {sortConfig.field === "name" ? (
                        <span>
                          {sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )}
                        </span>
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    <button
                      type="button"
                      onClick={() => handleSort("role")}
                      className="flex items-center gap-1 cursor-pointer select-none"
                    >
                      <span>Role</span>
                      {sortConfig.field === "role" ? (
                        <span>
                          {sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )}
                        </span>
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            : user.role === "chef"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : user.role === "delivery"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {user.phone || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user.id, user.name)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {displayedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 px-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users match the current filters/search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 dark:text-white">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[0-9]/g, "");
                    setFormData((prev) => ({ ...prev, name: value }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    let value = e.target.value.replace(
                      /[\s\u00A0\u2000-\u200B\u202F\u205F\u3000]/g,
                      ""
                    );
                    setFormData((prev) => ({
                      ...prev,
                      email: value.toLowerCase(),
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Password {editingUser && "(leave empty to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.value as User["role"],
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="chef">Chef</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, phone: value }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  maxLength={11}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingUser ? "Update" : "Add"} User
              </button>
              <button
                onClick={closeModals}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
