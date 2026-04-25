import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/context";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Eachproductrouting = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchrelatedproducts, relatedproducts, addtocart, setSingleProduct } =
    useContext(Shopcontext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/getsingleproductbyid/${id}`,
        );
        setProduct(res.data);
        if (res.data) {
          fetchrelatedproducts(res.data.category, id);
        }
      } catch (err) {
        console.log("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    getProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBuyNow = () => {
    if (product) {
      setSingleProduct(product);
      navigate("/buynow");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white font-black animate-pulse">
        LOADING...
      </div>
    );

  return (
    <div className="bg-[#0b0f1a] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-col lg:flex-row gap-12 bg-[#111827] border border-slate-800 rounded-[3rem] overflow-hidden p-6 lg:p-12 shadow-2xl">
          <div className="lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-orange-600/10 blur-[80px] rounded-full group-hover:bg-orange-600/20 transition-all"></div>
            <div className="relative bg-white rounded-[2rem] p-10 flex items-center justify-center aspect-square shadow-inner">
              <img
                src={product?.imgUrl}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                alt={product?.title}
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="text-orange-500 font-black tracking-[0.2em] uppercase text-xs">
                Premium {product?.category}
              </span>
              <h1 className="text-white text-3xl lg:text-5xl font-black leading-tight tracking-tighter">
                {product?.title}
              </h1>
              <div className="flex items-center gap-4 py-2">
                <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-black">
                  IN STOCK
                </span>
                <span className="text-yellow-500 font-bold">
                  ⭐⭐⭐⭐⭐{" "}
                  <span className="text-slate-500 text-sm ml-1">
                    (120 Reviews)
                  </span>
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
              "
              {product?.description ||
                "Experience the perfect blend of style and performance with this exclusive piece."}
              "
            </p>

            <div className="py-6 border-y border-slate-800 flex items-center gap-6">
              <span className="text-white text-5xl font-black tracking-tighter">
                ${product?.price}
              </span>
              <span className="text-slate-500 line-through text-xl">
                ${(product?.price * 1.2).toFixed(2)}
              </span>
              <span className="text-orange-500 font-bold text-sm">20% OFF</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => addtocart(product)}
                className="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
              >
                Add To Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-2 bg-orange-600 rounded-full"></div>
          <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
            Similar Products
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {relatedproducts?.map((item) => (
            <div
              key={item._id}
              className="group bg-[#111827] border border-slate-800 p-3 rounded-[2rem] hover:border-orange-600/50 transition-all cursor-pointer"
              onClick={() => navigate(`/eachproductroute/${item._id}`)}
            >
              <div className="bg-white rounded-[1.5rem] p-4 aspect-square flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={item.imgUrl}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  alt={item.title}
                />
              </div>
              <div className="px-2 pb-2">
                <h3 className="text-white text-[11px] font-black uppercase line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.title}
                </h3>
                <p className="text-orange-500 font-black text-lg mt-1">
                  ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eachproductrouting;
