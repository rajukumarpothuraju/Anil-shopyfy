import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Adminloginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/admin-login",
        { email, password },
      );

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        alert("Welcome Boss! admin login sucess");
        navigate("/admin");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed!");
    }
  };
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white rounded-2xl shadow-2xl w-96 border-t-4 border-blue-500"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            placeholder="admin@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default Adminloginpage;
