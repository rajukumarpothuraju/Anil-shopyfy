import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shopcontext } from "../context/context";

const Nav = () => {
  const [open, setopen] = useState(false);
  const { count } = useContext(Shopcontext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#111827]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* --- Logo & Voice Assistant --- */}
        <div className="flex items-center gap-3">
          <h1
            className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            Anil-Shopyfy
          </h1>

          {/* నీ వాయిస్ అసిస్టెంట్ ఇక్కడ యాడ్ అయింది - No design disturbance */}
        </div>

        {/* Desktop Links & Icons - As it is */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 font-medium">
            <Link to="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-orange-500 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/aboutus"
              className="hover:text-orange-500 transition-colors"
            >
              Aboutus
            </Link>
            <Link
              to="/signup"
              className="hover:text-orange-500 transition-colors"
            >
              Signup
            </Link>
            <Link
              to="/signin"
              className="hover:text-orange-500 transition-colors"
            >
              Signin
            </Link>
            <Link
              to="/order-success/all"
              className="hover:text-orange-500 transition-colors"
            >
              Myorders
            </Link>
            <Link
              to="/airecommendation"
              className="hover:text-orange-500 transition-colors"
            >
              Airecommendations
            </Link>
          </div>

          <div className="flex items-center gap-5 border-l border-slate-700 pl-6">
            <img
              src="/user-icon.png"
              className="w-8 h-8 cursor-pointer hover:scale-110 transition-all active:opacity-70"
              alt="User"
              onClick={() => navigate("/user")}
            />

            <div
              className="relative cursor-pointer group"
              onClick={() => navigate("/addtocart")}
            >
              <img
                src="/cart-icon.png"
                className="w-8 h-8 group-hover:scale-110 transition-all"
                alt="Cart"
              />
              {count > 0 && (
                <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {count}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Icons & Menu Toggle - As it is */}
        <div className="flex items-center gap-3 md:hidden">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/addtocart")}
          >
            <img src="/cart-icon.png" className="w-7 h-7" alt="Cart" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            className="text-sm border border-slate-700 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all"
            onClick={() => setopen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - As it is */}
      {open && (
        <div className="md:hidden bg-[#111827] border-b border-slate-800 p-4 space-y-4 shadow-2xl">
          <div className="flex flex-col gap-4 text-lg font-medium px-2">
            <Link
              to="/"
              onClick={() => setopen(false)}
              className="hover:text-orange-500 border-b border-slate-800/50 pb-2"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setopen(false)}
              className="hover:text-orange-500 border-b border-slate-800/50 pb-2"
            >
              Products
            </Link>
            <Link
              to="/user"
              onClick={() => setopen(false)}
              className="hover:text-orange-500 border-b border-slate-800/50 pb-2"
            >
              My Profile
            </Link>
            <Link
              to="/signup"
              className="hover:text-orange-500 transition-colors"
            >
              Signup
            </Link>
            <Link
              to="/signin"
              className="hover:text-orange-500 transition-colors"
            >
              Signin
            </Link>
            <Link
              to="/aboutus"
              onClick={() => setopen(false)}
              className="hover:text-orange-500 border-b border-slate-800/50 pb-2"
            >
              Aboutus
            </Link>
            <Link
              to="/order-success/all"
              onClick={() => setopen(false)}
              className="hover:text-orange-500"
            >
              Myorders
            </Link>
            <Link
              to="/airecommendation"
              className="hover:text-orange-500 transition-colors"
            >
              Airecommendations
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
