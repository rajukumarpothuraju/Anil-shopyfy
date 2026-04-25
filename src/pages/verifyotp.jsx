import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(40);

  const location = useLocation();
  const navigate = useNavigate();
  const identifier = location.state?.identifier;

  // --- Timer Logic ---
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://anil-shopyfy-backend.onrender.com/api/verify-otp",
        { identifier, otp },
      );
      if (response.status === 200) {
        alert("Account Verified!");
        navigate("/signin");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(
        "https://anil-shopyfy-backend.onrender.com/api/resend-otp",
        { identifier },
      );
      setTimer(40);
      alert("New OTP Sent!");
    } catch (error) {
      alert("Failed to resend.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-[#0b0f1a] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center">
        <h1 className="text-white text-4xl font-black uppercase italic tracking-tighter mb-2">
          Verify <span className="text-orange-600">OTP</span>
        </h1>

        <p className="text-slate-300 text-sm mb-8">Sent to: {identifier}</p>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength="4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="0 0 0 0"
            className="w-full bg-slate-900 border border-slate-700 text-white text-center text-3xl tracking-[0.5em] py-5 rounded-2xl outline-none focus:border-orange-600 font-black"
            required
          />

          {/* --- Timer Display --- */}
          <div className="text-sm font-bold">
            {timer > 0 ? (
              <p className="text-slate-500 italic">
                Resend OTP in <span className="text-orange-600">{timer}s</span>
              </p>
            ) : (
              <p className="text-green-500 animate-pulse">
                You can resend now!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || timer === 0}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm Access"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending || timer > 0}
          className={`mt-6 text-sm font-black uppercase tracking-widest transition-colors ${timer > 0 ? "text-slate-700 cursor-not-allowed" : "text-white hover:text-orange-600"}`}
        >
          {resending ? "Sending..." : "Resend Code"}
        </button>
      </div>
    </div>
  );
};

export default Verifyotp;
