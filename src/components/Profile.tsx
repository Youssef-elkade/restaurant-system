import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Lock,
  Edit,
  Save,
  X,
  Camera,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    user?.profileImage || ""
  );
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const roleColors = {
    customer:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    admin:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    chef: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    delivery:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  };

  const roleIcons = {
    customer: UserIcon,
    admin: Shield,
    chef: UserIcon,
    delivery: UserIcon,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB", {
          action: {
            label: "✕",
            onClick: () => toast.dismiss(),
          },
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = users.some(
      (u: any) => u.email === formData.email && u.id !== user?.id
    );

    if (emailExists) {
      toast.error("Email is already taken", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return {
          ...u,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          profileImage: profileImage,
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (user) {
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        profileImage: profileImage,
      });
    }

    toast.success("Profile updated successfully", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "phone") {
      newValue = value.replace(/\D/g, "");
    }
    if (name === "name") {
      newValue = value.replace(/[0-9]/g, "");
    }
    if (name === "email") {
      newValue = value.replace(
        /[\s\u00A0\u2000-\u200B\u202F\u205F\u3000]/g,
        ""
      );
      newValue = newValue.toLowerCase();
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: any) => u.id === user?.id);

    if (currentUser.password !== passwordData.currentPassword) {
      toast.error("Current password is incorrect", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return {
          ...u,
          password: passwordData.newPassword,
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast.success("Password changed successfully", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setProfileImage(user?.profileImage || "");
  };

  const RoleIcon = roleIcons[user?.role || "customer"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 dark:text-white mb-8">My Profile</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <UserIcon className="w-16 h-16" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-gray-900 dark:text-white mb-2">
                {user?.name}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                    roleColors[user?.role || "customer"]
                  }`}
                >
                  <RoleIcon className="w-4 h-4" />
                  {(user?.role || "customer").charAt(0).toUpperCase() +
                    (user?.role || "customer").slice(1)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Full Name
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white px-4 py-2">
                      {user?.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      disabled
                      type="email"
                      value={formData.email}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white px-4 py-2">
                      {user?.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="123-456-7890"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white px-4 py-2">
                      {user?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white px-4 py-2">
                      {user?.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 dark:text-white">
                  Change Password
                </h2>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    New Password * (min. 6 characters)
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
