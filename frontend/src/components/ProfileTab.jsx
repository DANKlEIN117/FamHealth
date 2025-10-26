import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Edit, Trash, Lock } from "lucide-react";
import API from "../api";

const ProfileTab = ({ family, onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(family.name);
  const [newEmail, setNewEmail] = useState(family.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Update Family Info
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await API.put("/family/update", { familyName: newName, email: newEmail }, config);
      alert("✅ Profile updated successfully!");
      setEditing(false);
      window.location.reload(); // Refresh to show updated info
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update family info");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Password
  const handleChangePassword = async () => {
  if (!oldPassword.trim() || !newPassword.trim()) {
    return alert("Please fill in both old and new passwords.");
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await API.put("/family/change-password", { oldPassword, newPassword }, config);

    alert("🔒 Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to change password");
  } finally {
    setLoading(false);
  }
};

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.delete("/family/delete-account", config);
      alert("💀 Account deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-xl rounded-2xl p-6 w-full md:w-[500px] mx-auto mt-8 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Family Profile
      </h2>

      {/* Family Info */}
      {!editing ? (
        <div className="space-y-3 text-gray-700">
          <p><strong>Name:</strong> {family.name}</p>
          <p><strong>Email:</strong> {family.email}</p>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              <Edit size={18} /> Edit
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-2 text-black placeholder-gray-400"
            placeholder="Name"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-2 text-black placeholder-gray-400"
            placeholder="Email"
          />

          <div className="flex justify-between">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

        {/* Password Change */}
        <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Lock size={18} /> Change Password
            </h3>

            <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-2 text-black placeholder-gray-400"
            placeholder="Old Password"
            />

            <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-2 text-black placeholder-gray-400"
            placeholder="New Password"
            />


            <button
                onClick={handleChangePassword}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mt-3"
                disabled={loading}
            >
                {loading ? "Updating..." : "Update Password"}
            </button>
        </div>


      {/* Delete Account */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <Trash size={18} /> Danger Zone
        </h3>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-3"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileTab;
