import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imgUrl: "",
    description: "",
    category: "general",
    rating: 0,
    discount: 0,
    inStock: true,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) navigate("/adminlogin");
    else fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const resP = await axios.get("http://localhost:5000/api/products");
      setProducts(resP.data);

      const resU = await axios.get(
        "http://localhost:5000/api/admin/users",
        config,
      );
      setUsers(resU.data || []);

      const resO = await axios.get(
        "http://localhost:5000/api/admin/orders",
        config,
      );
      setOrders(resO.data || []);
    } catch (err) {
      console.error("Fetch Error", err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/updatedata/${currentId}`,
          formData,
          config,
        );
        alert("Product Updated Successfully! ");
      } else {
        await axios.post(
          "http://localhost:5000/api/addproduct",
          formData,
          config,
        );
        alert("Product Added Successfully! ");
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Operation Failed!");
    }
  };

  const startEdit = (p) => {
    setIsEditing(true);
    setCurrentId(p._id);
    setFormData({
      title: p.title,
      price: p.price,
      imgUrl: p.imgUrl,
      description: p.description || "",
      category: p.category || "general",
      rating: p.rating || 0,
      discount: p.discount || 0,
      inStock: p.inStock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      imgUrl: "",
      description: "",
      category: "general",
      rating: 0,
      discount: 0,
      inStock: true,
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("ఈ యూజర్‌ని పర్మనెంట్‌గా డిలీట్ చేయాలా?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User Removed! ");
        fetchData();
      } catch (err) {
        alert("User Delete Failed!");
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/order-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(`Order is now ${newStatus} `);
      fetchData();
    } catch (err) {
      alert("Status Update Failed!");
    }
  };

  const categories = [
    "general",
    "electronics",
    "fashion",
    "home",
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-8">
        <div className="mb-12">
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            ANIL shopyfy
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Master Admin Console
          </p>
        </div>
        <nav className="space-y-2">
          {["products", "orders", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                resetForm();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === tab ? "bg-black text-white shadow-xl" : "text-slate-400 hover:bg-slate-100"}`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/adminlogin");
            }}
            className="w-full text-left px-4 py-3 text-red-500 font-bold uppercase text-xs tracking-widest mt-10 hover:bg-red-50 rounded-xl transition-all"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12">
        {activeTab === "products" && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black mb-10 tracking-tighter uppercase">
              {isEditing ? "Edit Product" : "Add New Item"}
            </h2>
            <form
              onSubmit={handleProductSubmit}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Category
                </label>
                <select
                  value={formData.category}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imgUrl}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, imgUrl: e.target.value })
                  }
                  required
                />
              </div>
              <div className="md:col-span-3 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none h-24 resize-none"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Extra Logic Fields: Discount & Rating */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Discount %
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-3 flex gap-4">
                <button className="flex-1 bg-black text-white p-4 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-800 transition-all">
                  {isEditing ? "Update Product" : "Save Product"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-10 bg-slate-200 font-black uppercase text-xs tracking-widest rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-black uppercase text-[10px] text-slate-400">
                      Product
                    </th>
                    <th className="pb-4 font-black uppercase text-[10px] text-slate-400">
                      Price
                    </th>
                    <th className="pb-4 font-black uppercase text-[10px] text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="py-6 flex items-center gap-4">
                        <img
                          src={p.imgUrl}
                          className="w-14 h-14 object-cover rounded-xl"
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-slate-800 mb-1">
                            {p.title}
                          </p>
                          <p className="text-[10px] font-black text-slate-300 uppercase">
                            {p.category}
                          </p>
                        </div>
                      </td>
                      <td className="py-6 font-black italic">₹{p.price}</td>
                      <td className="py-6 text-right">
                        <button
                          onClick={() => startEdit(p)}
                          className="text-[10px] font-black uppercase mr-4 text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Remove?"))
                              axios
                                .delete(
                                  `http://localhost:5000/api/deleteproduct/${p._id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                )
                                .then(fetchData);
                          }}
                          className="text-[10px] font-black uppercase text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map((u) => (
              <div
                key={u._id}
                className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4">
                  Customer ID: {u._id.slice(-6)}
                </p>
                <h3 className="text-xl font-black uppercase mb-1">
                  {u.username}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-8">
                  {u.email}
                </p>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="w-full py-3 bg-red-50 text-red-600 font-black text-[10px] uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  Remove User
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="max-w-4xl space-y-6">
            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8"
              >
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    ID: {o._id.slice(-6)}
                  </p>
                  <p className="text-2xl font-black text-slate-900 mb-2">
                    ₹{o.amount}
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-black px-2 py-1 rounded uppercase border border-blue-500 text-blue-500">
                      {o.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase">
                    Buyer: {o.userId?.username || "Guest"}
                  </p>
                </div>
                <div className="w-full md:w-64">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">
                    Status
                  </label>
                  <select
                    value={o.orderStatus || "Order Placed"}
                    onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase outline-none focus:border-black"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Adminpage;
