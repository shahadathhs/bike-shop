import React, { useState } from "react";
import { useAuth } from "provider/auth/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import type { IUser } from "provider/auth/AuthProvider";

export default function CustomerProfile() {
  const { user, login } = useAuth();
  const cookieUser = Cookies.get("user");
  const parsedUser: IUser = JSON.parse(cookieUser || "{}");

  const [name, setName] = useState(user?.name || parsedUser.name || "");
  const [email, setEmail] = useState(user?.email || parsedUser.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call backend to update profile info
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/update-profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );
      const responseData = await response.json();
      console.log("responseData", responseData);
      login({ ...user, name });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading1(true);
    try {
      // Call backend to update password (currentPassword is required for security)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/update-password`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      const responseData = await response.json();
      console.log("responseData", responseData);

      toast.success("Password updated successfully!");
      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update password");
    }
    setLoading1(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile Information */}
      <form onSubmit={handleProfileUpdate} className="mb-8 space-y-3">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email (Cannot be changed)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
            disabled
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Password Update Section */}
      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading1}
            className="btn btn-secondary"
          >
            {loading1 ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
