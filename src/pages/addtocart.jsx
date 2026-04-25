import React, { useContext } from "react";
import { Shopcontext } from "../context/context";
import { useNavigate } from "react-router-dom";

const Addtocart = () => {
  const { cart, deletecart, carterror, savetoggle, setSingleProduct } =
    useContext(Shopcontext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) =>
      acc + (Number(item.productprice) * (item.quantity || 1) || 0),
    0,
  );

  const handleCheckout = () => {
    setSingleProduct(null);
    navigate("/buynow");
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a] p-5">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-600/20 blur-[100px] rounded-full"></div>
          <img
            src="cartisempty-final.jpg"
            alt="Empty Cart"
            className="w-64 h-64 object-contain mb-8 relative z-10 animate-pulse"
          />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          cart empty
        </h2>
        <p className="text-slate-500 mt-2 mb-8 font-medium">
          Add your faviourate product
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-orange-600 text-white px-10 py-3 rounded-full font-black hover:bg-white hover:text-orange-600 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
        >
          START SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0f1a] min-h-screen p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl font-black mb-10 border-l-4 border-orange-600 pl-4 uppercase tracking-tighter">
          Shopping Cart <span className="text-orange-600">({cart.length})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="group relative bg-[#111827] border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-center gap-6 hover:border-orange-600/50 transition-all shadow-xl"
              >
                <div className="w-40 h-40 bg-white rounded-2xl p-4 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.productimage}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    alt={item.producttitle}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-bold text-lg line-clamp-1">
                    {item.producttitle}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2 font-medium">
                    {item.productdescription ||
                      "Premium quality product from our exclusive collection."}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                    <p className="text-orange-500 font-black text-2xl">
                      ${item.productprice}
                    </p>
                    <span className="text-yellow-500 text-xs">★★★★★</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
                    <button
                      onClick={() => deletecart(item._id)}
                      className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => savetoggle(item._id)}
                      className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-slate-700 transition-all"
                    >
                      {item.isSaved ? "Remove Saved" : "Save for Later"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#111827] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-white text-xl font-black uppercase mb-6 border-b border-slate-800 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm font-bold">
                <div className="flex justify-between text-slate-400 uppercase">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 uppercase">
                  <span>Shipping</span>
                  <span className="text-emerald-500">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400 uppercase border-b border-slate-800 pb-4">
                  <span>Tax</span>
                  <span className="text-white">$0.00</span>
                </div>

                <div className="flex justify-between text-white text-2xl font-black pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-8 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
              >
                Checkout Now
              </button>

              <p className="text-[10px] text-slate-500 mt-4 text-center font-bold uppercase tracking-tighter">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>

        {carterror && (
          <div className="mt-10 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <h1 className="text-red-500 font-bold uppercase tracking-widest">
              {carterror}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addtocart;
