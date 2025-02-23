import React, { useState } from "react";
import { useAuth } from "provider/auth/AuthContext";
import toast from "react-hot-toast";

export default function CustomerProfile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call backend to update profile info
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );
      const responseData = await response.json();
      // Update context (and possibly cookies/local storage) with new user info
      login(responseData.data.data);
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
    setLoading(true);
    try {
      // Call backend to update password (currentPassword is required for security)
      await fetch(`${import.meta.env.VITE_API_URL}/users/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success("Password updated successfully!");
      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update password");
    }
    setLoading(false);
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
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
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
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
