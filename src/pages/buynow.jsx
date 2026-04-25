import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Shopcontext } from "../context/context";
import axios from "axios";
import { Trash2, CreditCard, Truck } from "lucide-react";

const Buynowform = () => {
  const { cart, deletecart, singleProduct } = useContext(Shopcontext);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const displayItems = singleProduct ? [singleProduct] : cart;

  const totalPrice = displayItems.reduce(
    (acc, item) => acc + (Number(item.productprice || item.price) || 0),
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("login first");
      return;
    }

    if (displayItems.length === 0) {
      alert("కనీసం ఒక ప్రొడక్ట్ ఉండాలి! ");
      return;
    }

    if (orderData.paymentMethod === "online") {
      handleRazorpayPayment(token);
    } else {
      handleCODPayment(token);
    }
  };

  const handleCODPayment = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/order/place",
        {
          ...orderData,
          items: displayItems,
          amount: totalPrice,
          paymentStatus: "Pending",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        alert("Order Placed Successfully (COD)! ");
        navigate(`/order-success/${response.data.order._id}`);
      }
    } catch (err) {
      alert("COD Order Failed! ");
    }
  };

  const handleRazorpayPayment = async (token) => {
    try {
      // Step 1: Create Razorpay Order in Backend
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/order",
        { amount: totalPrice },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { id: razorpayOrderId, amount: orderAmount } = orderRes.data;

      const options = {
        key: "rzp_test_SfwdAHWTfeL52v",
        amount: orderAmount,
        currency: "INR",
        name: "Anil-Shopyfy",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Step 2: Verify Payment
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            if (verifyRes.status === 200) {
              // Step 3: Finalize Order
              const finalOrder = await axios.post(
                "http://localhost:5000/api/order/place",
                {
                  ...orderData,
                  items: displayItems,
                  amount: totalPrice,
                  paymentStatus: "Paid",
                  paymentMethod: "Online",
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                },
                { headers: { Authorization: `Bearer ${token}` } },
              );
              alert("Payment Successful! ");
              navigate(`/order-success/${finalOrder.data.order._id}`);
            }
          } catch (err) {
            alert("Payment Verification Failed! ");
          }
        },
        prefill: {
          name: orderData.fullName,
          contact: orderData.phoneNumber,
        },
        theme: { color: "#ea580c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Razorpay Error! ");
    }
  };

  return (
    <div className="bg-[#0b0f1a] min-h-screen p-4 md:p-10 text-white font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#111827] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-l-4 border-orange-600 pl-4">
            Shipping <span className="text-orange-600">Info</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-orange-600 text-white"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-orange-600 text-white"
                required
              />
            </div>
            <textarea
              name="address"
              placeholder="Full Address"
              onChange={handleChange}
              rows="3"
              className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-orange-600 text-white"
              required
            ></textarea>
            <div className="grid grid-cols-2 gap-5">
              <input
                type="text"
                name="city"
                placeholder="City"
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-orange-600 text-white"
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
                className="bg-slate-900 border border-slate-700 p-4 rounded-2xl outline-none focus:border-orange-600 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border cursor-pointer ${orderData.paymentMethod === "cod" ? "border-orange-600 bg-orange-600/10" : "border-slate-800"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={orderData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="hidden"
                />
                <Truck size={18} />{" "}
                <span className="text-xs font-bold uppercase">COD</span>
              </label>
              <label
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border cursor-pointer ${orderData.paymentMethod === "online" ? "border-orange-600 bg-orange-600/10" : "border-slate-800"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={orderData.paymentMethod === "online"}
                  onChange={handleChange}
                  className="hidden"
                />
                <CreditCard size={18} />{" "}
                <span className="text-xs font-bold uppercase">Pay Online</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl"
            >
              Confirm Order (₹{totalPrice.toFixed(2)})
            </button>
          </form>
        </div>

        <div className="bg-[#111827] border border-slate-800 p-8 rounded-[2.5rem]">
          <h2 className="text-xl font-black uppercase mb-6">
            Summary ({displayItems.length})
          </h2>
          <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {displayItems.map((item) => (
              <div
                key={item._id || item.productid}
                className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800"
              >
                <img
                  src={item.productimage || item.imgUrl}
                  alt=""
                  className="w-16 h-16 object-contain bg-white rounded-xl p-1"
                />
                <div className="flex-1">
                  <h4 className="text-[11px] font-bold line-clamp-1">
                    {item.producttitle || item.title}
                  </h4>
                  <p className="text-orange-500 font-black">
                    ₹{item.productprice || item.price}
                  </p>
                </div>
                {!singleProduct && (
                  <button
                    type="button"
                    onClick={() => deletecart(item._id)}
                    className="p-2 text-slate-500 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between text-white text-xl font-black italic uppercase">
            <span>Total</span>
            <span className="text-orange-600">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buynowform;
