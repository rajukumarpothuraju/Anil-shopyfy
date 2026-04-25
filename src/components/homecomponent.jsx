import React, { useContext } from "react";
import { Shopcontext } from "../context/context";
import Alltitles from "./alltitles";
import { useNavigate } from "react-router-dom";

const Homecomponent = () => {
  const navigate = useNavigate();
  const { homedata, productsdata } = useContext(Shopcontext);

  return (
    <div className="bg-[#0b0f1a] min-h-screen pb-20">
      {/* 1. TOP PRODUCTS - Minimal Circle Grid */}
      <div className="py-10 px-4 max-w-7xl mx-auto">
        <Alltitles text="Top Categories" className="text-center" />
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-8">
          {homedata.topProducts?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => navigate("/products")}
            >
              <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-full p-4 shadow-lg group-hover:shadow-orange-600/40 group-hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-orange-600">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-white mt-3 text-xs md:text-sm font-bold opacity-70 group-hover:opacity-100 uppercase tracking-tighter">
                {item.title?.slice(0, 10)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN BANNER SECTION */}
      <div className="px-4 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          {homedata.bannerimg?.map((item, id) => (
            <div key={id} className="relative group">
              <img
                src={item.imgurl}
                alt="Banner"
                className="w-full h-64 md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-orange-600 text-white px-8 py-3 rounded-full font-black hover:bg-white hover:text-orange-600 transition-all shadow-xl"
                >
                  SHOP THE COLLECTION
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TYPE 1: GLASS-ELEVATE (Recommended) */}
      <div className="mt-20 px-4 max-w-7xl mx-auto">
        <Alltitles text="Recommended For You" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {productsdata.slice(0, 4).map((item) => (
            <div
              key={item._id}
              className="group bg-[#111827]/50 backdrop-blur-md border border-slate-800 p-4 rounded-3xl transition-all duration-500 hover:border-orange-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white aspect-square flex items-center justify-center p-4">
                <img
                  src={item.imgUrl}
                  className="h-32 group-hover:scale-110 transition-transform duration-500"
                  alt=""
                />
                <div className="absolute top-2 right-2 bg-orange-600 text-[10px] px-2 py-1 rounded-full text-white font-bold">
                  NEW
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-white font-medium text-sm truncate">
                  {item.title}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-orange-500 font-bold text-lg">
                    ${item.price || "49"}
                  </p>
                  <button
                    className="bg-white/10 p-2 rounded-lg text-white hover:bg-orange-600 transition-colors"
                    onClick={() => navigate("/products")}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TYPE 2: LUXURY HERO (Featured) */}
      <div className="mt-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productsdata.slice(4, 6).map((item) => (
            <div
              key={item._id}
              className="relative bg-gradient-to-br from-slate-900 to-[#0b0f1a] rounded-[2.5rem] p-8 border border-white/5 flex items-center overflow-hidden group min-h-[250px] shadow-2xl"
            >
              <div className="z-10 w-1/2">
                <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase">
                  Limited Edition
                </span>
                <h2 className="text-white text-2xl font-black leading-tight mb-4">
                  {item.title.slice(0, 15)}
                </h2>
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 bg-white text-black rounded-full font-bold text-xs hover:bg-orange-600 hover:text-white transition-all shadow-lg"
                >
                  Grab Now
                </button>
              </div>
              <img
                src={item.imgUrl}
                className="absolute -right-8 w-60 h-60 object-contain rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. TOP BRANDS SECTION */}
      <div className="mt-20 px-4 max-w-7xl mx-auto">
        <Alltitles text="Partner Brands" className="text-center" />
        <div className="mt-10">
          {homedata.Topbrands?.map((item, id) => (
            <div
              key={id}
              className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]"
            >
              <img
                src={item.imageUrl}
                className="w-full h-auto object-cover group-hover:scale-105 transition-all duration-1000"
                alt="Brand"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. TYPE 3: ACTION-FOCUS (Trending Grid) */}
      <div className="mt-20 px-4 max-w-7xl mx-auto">
        <Alltitles text="Trending Now" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10">
          {productsdata.slice(6, 11).map((item) => (
            <div
              key={item._id}
              className="group relative bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden p-2 hover:border-blue-500 transition-colors"
            >
              <div className="h-44 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden p-4">
                <img
                  src={item.imgUrl}
                  className="h-32 object-contain group-hover:rotate-6 transition-transform duration-500"
                  alt=""
                />
                <div className="absolute inset-0 bg-blue-600/90 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => navigate("/products")}
                    className="text-white font-bold text-xs border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-all"
                  >
                    QUICK VIEW
                  </button>
                </div>
              </div>
              <div className="p-3 text-center">
                <h3 className="text-white text-xs font-bold truncate">
                  {item.title}
                </h3>
                <p className="text-blue-400 font-black mt-1">
                  ${item.price || "35"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. TYPE 4: GRID-LIST HYBRID (Best Deals) */}
      <div className="mt-20 px-4 max-w-7xl mx-auto mb-10">
        <Alltitles text="Best Deals" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {productsdata.slice(11, 14).map((item) => (
            <div
              key={item._id}
              className="flex gap-5 bg-[#161b22] p-4 rounded-3xl border border-slate-800 hover:bg-[#1c2128] transition-all cursor-pointer group shadow-xl"
              onClick={() => navigate("/products")}
            >
              <div className="w-28 h-28 bg-white rounded-2xl p-3 flex-shrink-0 group-hover:rotate-3 transition-transform">
                <img
                  src={item.imgUrl}
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  In Stock
                </span>
                <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-white text-xl font-black mt-1">
                  ${item.price || "25"}
                </p>
                <div className="flex text-yellow-500 text-[10px] mt-1">
                  ★★★★★
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homecomponent;
