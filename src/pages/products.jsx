import React, { useContext, useState, useMemo } from "react";
import { Shopcontext } from "../context/context";
import Alltitles from "../components/alltitles";
import { useNavigate } from "react-router-dom";

const Productspage = () => {
  const { productsdata, addtocart } = useContext(Shopcontext);
  const [productshow, setproductshow] = useState(false);
  const [category, setcategory] = useState("all");
  const [sorttype, setsorttype] = useState("relevant");
  const [searchQuery, setSearchQuery] = useState(""); // Search state add chesam
  const navigate = useNavigate();

  const categories = [
    "all",
    "electronics",
    "fashion",
    "shirts",
    "pants",
    "womenswear",
    "menswear",
    "footwear",
    "bags",
    "fitness",
    "toys",
    "kidswear",
  ];

  const productfilter = useMemo(() => {
    // 1. First, Search & Category filter logic
    let filtered = productsdata.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 2. Then, Sorting logic
    if (sorttype === "low-high")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sorttype === "high-low")
      return [...filtered].sort((a, b) => b.price - a.price);

    return filtered;
  }, [category, productsdata, sorttype, searchQuery]);

  return (
    <div className="bg-[#0b0f1a] min-h-screen pb-20">
      {/* 1. SEARCH & CATEGORY STICKY BAR */}
      <div className="sticky top-[64px] z-40 bg-[#111827]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Search Input Field */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search premium products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all placeholder:text-slate-500 font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center justify-between lg:hidden mb-2">
            <button
              className="text-white bg-orange-600 px-4 py-1.5 rounded-full text-xs font-bold"
              onClick={() => setproductshow(!productshow)}
            >
              {productshow ? "✕ Close Filters" : "☰ Browse Categories"}
            </button>
          </div>

          <div
            className={`${productshow ? "flex" : "hidden"} lg:flex flex-wrap items-center justify-center gap-2 transition-all`}
          >
            {categories.map((item, id) => (
              <button
                key={id}
                onClick={() => setcategory(item)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all border ${
                  category === item
                    ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/30"
                    : "bg-slate-900 border-slate-700 text-slate-500 hover:border-orange-500 hover:text-white"
                } uppercase`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Sorting & Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-l-4 border-orange-600 pl-4">
          <div>
            <h1 className="text-white text-3xl font-black uppercase tracking-tighter">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : `${category} Collection`}
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-1">
              Found {productfilter.length} items for you
            </p>
          </div>

          <select
            className="bg-slate-900 text-white border border-slate-700 p-3 rounded-xl outline-none cursor-pointer text-[10px] font-black tracking-widest hover:border-orange-600 transition-all uppercase"
            onChange={(e) => setsorttype(e.target.value)}
          >
            <option value="relevant">SORT BY: RELEVANT</option>
            <option value="low-high">PRICE: LOW TO HIGH</option>
            <option value="high-low">PRICE: HIGH TO LOW</option>
          </select>
        </div>

        {/* 3. PRODUCT GRID */}
        {productfilter.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {productfilter.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-[#111827] border border-slate-800 rounded-[2rem] p-3 hover:border-orange-600/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative aspect-square bg-white rounded-[1.5rem] p-6 overflow-hidden">
                  <img
                    src={item.imgUrl}
                    onClick={() => navigate(`/eachproductroute/${item._id}`)}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                  {item.price < 50 && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg">
                      HOT DEAL
                    </div>
                  )}
                </div>

                <div className="mt-4 px-2 pb-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-xs font-bold line-clamp-2 group-hover:text-orange-500 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-orange-500 font-black text-xl mt-2 tracking-tighter">
                      ${item.price}
                    </p>
                  </div>

                  <button
                    className="w-full mt-4 bg-orange-600 text-white py-3 text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-600/10"
                    onClick={() => addtocart(item)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when no results found */
          <div className="py-20 text-center">
            <h2 className="text-slate-600 text-2xl font-black uppercase">
              No products found...
            </h2>
            <p className="text-slate-500 mt-2">
              Try searching for something else!
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setcategory("all");
              }}
              className="mt-6 text-orange-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productspage;
