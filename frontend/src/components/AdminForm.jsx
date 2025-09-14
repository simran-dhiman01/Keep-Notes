import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import api from "../utils/Api";

const AdminForm = ({ refreshUsers }) => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !role) {
      setMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await api.post("/user/invite",{ email, role });

      if (res.data.success) {
        setMessage(`User ${email} invited successfully!`);
        setEmail("");
        setRole("member");
        if (refreshUsers) refreshUsers(); 
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to invite user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Invite User</h2>
      {message && (
        <p className="mb-2 text-sm text-green-600">{message}</p>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 px-3 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"/>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full mb-3 px-3 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400">
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-lg py-2 rounded-md text-white font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r cursor-pointer from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        }`}>
        {loading ? "Inviting..." : "Invite User"}
      </button>
    </form>
  );
};

export default AdminForm;
