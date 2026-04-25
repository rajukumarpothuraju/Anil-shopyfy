import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();

  // Universal Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData,
      );

      if (response.status === 201) {
        alert(response.data.message);

        navigate("/verifyotp", { state: { identifier: formData.identifier } });
      }
    } catch (error) {
      console.error("Axios Error Details:", error.response || error);
      alert(
        error.response?.data?.message || "Something went wrong at backend!",
      );
    }
  };

  return (
    <div className="bg-[#0b0f1a] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-orange-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter italic">
            JOIN THE <span className="text-orange-600">Anil-shopyfy</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Create your account to start shopping
          </p>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-slate-400 text-[10px] font-black uppercase ml-2 tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-orange-600 transition-all font-medium"
                required
              />
            </div>

            {/* Identifier Field (Email or Mobile) */}
            <div className="space-y-2">
              <label className="text-slate-400 text-[10px] font-black uppercase ml-2 tracking-widest">
                Email or Mobile Number
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="commander@gemini.com or 9876543210"
                className="w-full bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-orange-600 transition-all font-medium"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-slate-400 text-[10px] font-black uppercase ml-2 tracking-widest">
                Set Secret Key
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl outline-none focus:border-orange-600 transition-all font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.15em] shadow-xl shadow-orange-600/20 hover:bg-white hover:text-orange-600 transition-all active:scale-95 duration-300 mt-4"
            >
              Initialize Signup
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-slate-500 text-sm font-medium">
              Already a member?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-white font-black hover:text-orange-600 transition-colors uppercase text-xs"
              >
                Login Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
