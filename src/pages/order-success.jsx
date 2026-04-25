import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Trash2,
  ShoppingBag,
  Clock,
  PackageCheck,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const Ordersucess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusSteps = [
    "Order Placed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const resHistory = await axios.get(
        "https://anil-shopyfy-backend.onrender.com/api/order/user-orders",
        { headers },
      );
      const ordersList = resHistory.data.orders || [];
      setAllOrders(ordersList);

      if (id) {
        const resCurrent = await axios.get(
          `https://anil-shopyfy-backend.onrender.com/api/order/get/${id}`,
          { headers },
        );
        setCurrentOrder(resCurrent.data.order);
      } else if (ordersList.length > 0) {
        setCurrentOrder(ordersList[0]);
      }
    } catch (err) {
      console.error("Order Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleDeleteOrder = async (orderId, e) => {
    e.stopPropagation();
    if (!window.confirm("ఈ ఆర్డర్ హిస్టరీని డిలీట్ చేయాలా?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://anil-shopyfy-backend.onrender.com/api/order/delete/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const updatedOrders = allOrders.filter((ord) => ord._id !== orderId);
      setAllOrders(updatedOrders);
      if (currentOrder && orderId === currentOrder._id) {
        setCurrentOrder(updatedOrders.length > 0 ? updatedOrders[0] : null);
        navigate("/order-success");
      }
    } catch (err) {
      alert("Delete failed!");
    }
  };

  if (loading)
    return (
      <div className="bg-[#0b0f1a] min-h-screen flex items-center justify-center text-orange-600 font-black animate-pulse">
        RESTORING YOUR ORDERS...
      </div>
    );

  return (
    <div className="bg-[#0b0f1a] min-h-screen p-4 md:p-10 text-white font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        {currentOrder ? (
          <div className="bg-[#111827] border border-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                {currentOrder.paymentStatus === "Paid" ? (
                  <span className="flex items-center gap-1.5 bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} /> Payment Successful
                  </span>
                ) : (
                  <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Cash on Delivery
                  </span>
                )}
              </div>
              <h2 className="text-orange-600 font-black uppercase italic mb-8 tracking-tighter text-xl">
                Track Order: #{currentOrder._id.slice(-6)}
              </h2>
              <div className="relative pl-6 space-y-8">
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-800"></div>
                {statusSteps.map((step, index) => {
                  const currentIdx = statusSteps.indexOf(
                    currentOrder.orderStatus || "Order Placed",
                  );
                  const isDone = index <= currentIdx;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 relative"
                    >
                      <div
                        className={`w-4 h-4 rounded-full z-10 border-4 border-[#111827] ${isDone ? "bg-green-500 shadow-[0_0_15px_green]" : "bg-slate-800"}`}
                      ></div>
                      <p
                        className={`text-xs font-black uppercase tracking-tight ${isDone ? "text-white" : "text-slate-600"}`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between w-full lg:w-[400px]">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">
                  Items
                </p>
                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
                  {currentOrder.items?.map((item, i) => (
                    <img
                      key={i}
                      src={item.imgUrl || item.productimage}
                      className="w-16 h-16 min-w-[64px] rounded-2xl border-2 border-slate-800 bg-white object-contain p-1"
                      alt=""
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <h3 className="text-4xl font-black italic">
                    ₹{currentOrder.amount}
                  </h3>
                  <p className="text-orange-500 text-[10px] font-bold uppercase mt-1">
                    Status: {currentOrder.paymentStatus}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="mt-8 w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Shop More
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-[#111827] rounded-[3rem] border border-dashed border-slate-800">
            <PackageCheck
              className="mx-auto text-slate-700 mb-4 opacity-20"
              size={60}
            />
            <p className="text-slate-500 font-bold uppercase tracking-widest">
              No active orders found!
            </p>
          </div>
        )}

        <div className="pt-6">
          <div className="flex justify-between items-end mb-8 text-2xl font-black uppercase italic border-l-8 border-orange-600 pl-4">
            History
          </div>
          <div className="grid grid-cols-1 gap-4">
            {allOrders.map((ord) => (
              <div
                key={ord._id}
                onClick={() => navigate(`/order-success/${ord._id}`)}
                className={`group relative bg-[#111827]/60 border p-5 md:p-6 rounded-[2rem] cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 ${ord._id === id ? "border-orange-600 shadow-xl" : "border-slate-800 hover:border-slate-700"}`}
              >
                <button
                  onClick={(e) => handleDeleteOrder(ord._id, e)}
                  className="absolute -top-2 -right-2 md:top-4 md:right-4 p-2.5 bg-red-600 text-white rounded-full transition-all shadow-lg hover:scale-110 z-20"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-orange-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      {new Date(ord.createdAt).toDateString()}
                    </p>
                    <p className="font-black text-xl">₹{ord.amount}</p>
                  </div>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-2 max-w-full md:max-w-[200px]">
                  {ord.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.imgUrl || item.productimage}
                      className="w-10 h-10 min-w-[40px] rounded-lg border border-slate-700 bg-white object-contain"
                      alt=""
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${ord.orderStatus === "Delivered" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}
                  >
                    {ord.orderStatus || "Placed"}
                  </p>
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Ordersucess;
