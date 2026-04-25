import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/home";
import Aboutuspage from "./pages/aboutus";
import Productspage from "./pages/products";
import Adminpage from "./pages/admin";
import Nav from "./components/nav";
import Footer from "./components/footer";
import Addtocart from "./pages/addtocart";
import Userinfopage from "./pages/user";
import Eachproductrouting from "./pages/eachproductroute";
import Buynow from "./pages/buynow";
import SignupForm from "./pages/signup";
import Signinform from "./pages/signin";
import Verifyotp from "./pages/verifyotp";
import Ordersucess from "./pages/order-success";
import Adminloginpage from "./pages/adminlogin";
import Airecomandation from "./pages/airecommendation";

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<Aboutuspage />} />
          <Route path="/addtocart" element={<Addtocart />} />
          <Route path="/products" element={<Productspage />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Adminpage />
              </ProtectedAdminRoute>
            }
          />

          <Route path="/adminlogin" element={<Adminloginpage />} />
          <Route path="/user" element={<Userinfopage />} />
          <Route path="eachproductroute/:id" element={<Eachproductrouting />} />
          <Route path="buynow" element={<Buynow />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signin" element={<Signinform />} />
          <Route path="/verifyotp" element={<Verifyotp />} />
          <Route path="/order-success/:id" element={<Ordersucess />} />

          <Route path="/airecommendation" element={<Airecomandation />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
