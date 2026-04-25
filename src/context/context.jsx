import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const Shopcontext = createContext();

const Context = ({ children }) => {
  const [homedata, sethomedata] = useState([]);
  const [productsdata, setproductsdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [cart, setcart] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [relatedproducts, getrelatedproducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState(null);

  // --- Helper: Token Headers (Memoized for Performance) ---
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
  }, []);

  // 1. Home Data API
  const apicalling = useCallback(async () => {
    setloading(true);
    try {
      const res = await axios.get(
        "https://anil-shopyfy-backend.onrender.com/api/home",
      );
      sethomedata(res.data);
    } catch (err) {
      console.log("Home data error:", err);
    } finally {
      setloading(false);
    }
  }, []);

  // 2. Products Data API
  const apicalling2 = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://anil-shopyfy-backend.onrender.com/api/products",
      );
      setproductsdata(res.data);
    } catch (err) {
      console.log("Products load error:", err);
    }
  }, []);

  const fetchCartItems = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) {
      setcart([]);
      return;
    }

    try {
      const res = await axios.get(
        "https://anil-shopyfy-backend.onrender.com/apicart/get",
        headers,
      );

      setcart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Cart load error:", err);
      if (err.response?.status === 401) {
        setcart([]);
        localStorage.removeItem("token");
      }
    }
  }, [getAuthHeaders]);

  // --- Initial Load Logic ---
  useEffect(() => {
    const initializeAppData = async () => {
      await Promise.all([apicalling(), apicalling2()]);
      const token = localStorage.getItem("token");
      if (token) {
        await fetchCartItems();
      }
    };
    initializeAppData();
  }, [apicalling, apicalling2, fetchCartItems]);

  // 4. Add to Cart
  const addtocart = useCallback(
    async (product) => {
      const headers = getAuthHeaders();
      if (!headers) {
        alert("Please login first! ");
        return;
      }

      setAddLoading(true);
      const payload = {
        productid: product._id || product.id,
        producttitle: product.title || product.producttitle,
        productprice: Number(product.price || product.productprice),
        productdescription:
          product.description ||
          product.productdescription ||
          "Premium Product",
        productimage: product.imgUrl || product.productimage,
        productrating: product.rating || product.productrating || 0,
      };

      try {
        const response = await axios.post(
          "https://anil-shopyfy-backend.onrender.com/apicart/add",
          payload,
          headers,
        );
        if (response.status === 200) {
          await fetchCartItems();
          alert("Item added to your cart! ");
        }
      } catch (err) {
        console.error("Add error:", err.response?.data?.message || err.message);
      } finally {
        setAddLoading(false);
      }
    },
    [fetchCartItems, getAuthHeaders],
  );

  // 5. Delete from Cart
  const deletecart = useCallback(
    async (cartObjectId) => {
      const headers = getAuthHeaders();
      if (!headers) return;

      try {
        const res = await axios.delete(
          `https://anil-shopyfy-backend.onrender.com/apicart/delete/${cartObjectId}`,
          headers,
        );
        if (res.status === 200) {
          await fetchCartItems();
          alert("Removed! ");
        }
      } catch (err) {
        console.log("Delete error:", err);
      }
    },
    [fetchCartItems, getAuthHeaders],
  );

  // 6. Save for Later Toggle
  const savetoggle = useCallback(
    async (id) => {
      const headers = getAuthHeaders();
      if (!headers) {
        alert("login first!");
        return;
      }
      try {
        const response = await axios.patch(
          `https://anil-shopyfy-backend.onrender.com/api/saveforlaterproductstodatabase/${id}`,
          {},
          headers,
        );
        if (response.status === 200) {
          alert(response.data.message);

          await fetchCartItems();
        }
      } catch (err) {
        console.error("Save error detail:", err.response?.data);
      }
    },
    [fetchCartItems, getAuthHeaders],
  );

  // 7. Remove Saved Item
  const removesaveditem = useCallback(
    async (id) => {
      const headers = getAuthHeaders();
      if (!headers) return;
      try {
        await axios.patch(
          `https://anil-shopyfy-backend.onrender.com/api/removesaveditems/${id}`,
          {},
          headers,
        );
        await fetchCartItems();
        alert("Removed from saved!");
      } catch (error) {
        console.error("Remove failed:", error);
      }
    },
    [fetchCartItems, getAuthHeaders],
  );

  // 8. Related Products
  const fetchrelatedproducts = useCallback(async (category, id) => {
    try {
      const res = await axios.get(
        `https://anil-shopyfy-backend.onrender.com/api/relatedproducts/${category}/${id}`,
      );
      getrelatedproducts(res.data);
    } catch (error) {
      console.log("Related products error", error);
    }
  }, []);

  return (
    <Shopcontext.Provider
      value={{
        homedata,
        productsdata,
        loading,
        addtocart,
        addLoading,
        cart,
        deletecart,
        count: cart.length,
        fetchrelatedproducts,
        relatedproducts,
        savetoggle,
        removesaveditem,
        singleProduct,
        setSingleProduct,
      }}
    >
      {children}
    </Shopcontext.Provider>
  );
};

export default Context;
