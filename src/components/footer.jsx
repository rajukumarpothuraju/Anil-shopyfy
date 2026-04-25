import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b0f1a] border-t border-slate-800 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Brand Section */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase tracking-wider">
              Anil-Shopyfy
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your one-stop destination for premium products. Experience the
              future of shopping with our curated collections and seamless
              service.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="text-orange-500 font-bold text-xl uppercase tracking-widest">
              Our Pages
            </h2>
            <div className="flex flex-col gap-2 text-slate-300">
              <Link
                to="/"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                Home Page
              </Link>
              <Link
                to="/aboutus"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                About Us
              </Link>
              <Link
                to="/products"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                All Products
              </Link>
              <Link
                to="/addtocart"
                className="hover:text-white hover:translate-x-1 transition-all"
              >
                Your Cart
              </Link>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2 className="text-orange-500 font-bold text-xl uppercase tracking-widest">
              Follow Us
            </h2>
            <div className="flex flex-col gap-2 text-slate-300">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-500 flex items-center gap-2 transition-colors"
              >
                <span>Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 flex items-center gap-2 transition-colors"
              >
                <span>Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-500 flex items-center gap-2 transition-colors"
              >
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-slate-800 py-6 text-center">
          <p className="text-slate-500 text-xs md:text-sm italic">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-orange-600 font-bold">Anil-Shopyfy</span>.
            Build with passion by Anil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
