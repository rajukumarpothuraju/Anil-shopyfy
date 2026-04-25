import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signinform = () => {
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();

  // 2. Universal Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://anil-shopyfy-backend.onrender.com/api/signin",
        loginData,
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert(`Welcome back, ${response.data.user.username}!`);

        window.location.href = "/";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="bg-[#0b0f1a] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter italic">
            Anil-shopyfy <span className="text-orange-600">signin</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">
            Authentication Required to shop in Anil-shopyfy
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-orange-600/30 rounded-tr-[3rem]"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group space-y-2">
              <label className="text-slate-500 text-[10px] font-black uppercase ml-2 tracking-widest group-focus-within:text-orange-600 transition-colors">
                Personnel Email or Mobile
              </label>
              <input
                type="text"
                name="identifier"
                value={loginData.identifier}
                onChange={handleChange}
                placeholder="Email or Mobile Number"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all font-medium placeholder:text-slate-700"
                required
              />
            </div>

            {/* Password Field */}
            <div className="group space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-focus-within:text-orange-600 transition-colors">
                  Password
                </label>
                <button
                  type="button"
                  className="text-orange-600 text-[9px] font-black hover:underline uppercase tracking-tighter"
                >
                  Recovery Needed?
                </button>
              </div>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all font-medium placeholder:text-slate-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-white hover:text-orange-600 transition-all duration-300 active:scale-95"
            >
              Authorize Login
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-800/50 pt-8">
            <p className="text-slate-500 text-xs font-medium">
              Not registered yet?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-white font-black hover:text-orange-600 transition-colors uppercase ml-1 border-b-2 border-orange-600/0 hover:border-orange-600"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signinform;
