import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Shopcontext } from "../context/context";

const Userinfopage = () => {
  const Navigate = useNavigate();
  const { removesaveditem } = useContext(Shopcontext);
  const [savedItems, setSavedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- SIGN OUT LOGIC (SAFE & CLEAN) ---
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    window.location.href = "/signin";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if user is logged in
    if (!token) {
      Navigate("/signin");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const savedRes = await axios.get(
          "http://localhost:5000/api/getsaveforlaterproductsfromdatabase",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSavedItems(savedRes.data);

        const orderRes = await axios.get(
          "http://localhost:5000/api/order/user-orders",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setOrders(orderRes.data.orders);
      } catch (error) {
        console.error("Data fetch error:", error);
        // Token expire ayite auto logout
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleSignOut();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 font-black animate-pulse text-orange-600">
        LOADING YOUR PROFILE... ⚡
      </div>
    );

  return (
    <div className="bg-[#0b0f1a] min-h-screen p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* --- ADDED: PROFILE HEADER WITH SIGN OUT BUTTON --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              My <span className="text-orange-600">Account</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
              Manage your orders and saved items
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-600/10 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2"
          >
            SIGN OUT
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
                strokeWidth={3}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>

        {/* SECTION 1: MY SAVED PRODUCTS */}
        <section>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 border-l-4 border-orange-600 pl-4">
            Saved <span className="text-orange-600">Later Products</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedItems.length > 0 ? (
              savedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#111827] border border-slate-800 p-4 rounded-[2rem] hover:border-orange-600 transition-all group"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      Navigate(`/eachproductroute/${item.productid}`)
                    }
                  >
                    <img
                      src={item.productimage}
                      alt=""
                      className="w-full h-40 object-contain bg-white rounded-2xl p-2 group-hover:scale-105 transition-transform"
                    />
                    <h3 className="font-bold mt-4 truncate">
                      {item.producttitle}
                    </h3>
                    <p className="text-orange-500 font-black italic">
                      ₹{item.productprice}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No saved items yet.</p>
            )}
          </div>
        </section>

        {/* SECTION 2: ORDER HISTORY */}
        <section>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 border-l-4 border-green-500 pl-4">
            Order <span className="text-green-500">History</span>
          </h2>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#111827] border border-slate-800 p-6 rounded-[2rem] flex flex-wrap justify-between items-center gap-4 hover:bg-slate-900/50 transition-all"
                >
                  <div className="flex gap-4 items-center">
                    <div className="bg-green-500/20 p-3 rounded-full text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        Order ID
                      </p>
                      <p className="font-mono text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                      Amount
                    </p>
                    <p className="font-black text-orange-500">
                      ₹{order.amount}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                      Status
                    </p>
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-green-500/20">
                      {order.orderStatus || order.paymentStatus}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      Navigate("/order-success/all", {
                        state: { orderData: order },
                      })
                    }
                    className="bg-slate-800 hover:bg-white hover:text-black px-6 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    VIEW DETAILS
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-[#111827] rounded-[2rem] border border-dashed border-slate-800">
                <p className="text-slate-500">empty orders my friend</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Userinfopage;
