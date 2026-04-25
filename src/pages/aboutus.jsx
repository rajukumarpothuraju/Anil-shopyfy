import React from "react";

import {
  Truck,
  ShieldCheck,
  Star,
  Zap,
  Globe,
  Target,
  Award,
  ArrowRight,
} from "lucide-react";

const Aboutuspage = () => {
  const photos = {
    // PUBLIC folder lo unte direct ga name ivvali
    founder: "/aboutusimage-anil.jpg",
    collegeHead: "/sanjeev-collage-sir.jpg",
  };

  return (
    <div className="bg-[#05070a] text-white min-h-screen overflow-x-hidden font-sans selection:bg-orange-600">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] md:h-[600px] bg-orange-600/20 blur-[120px] rounded-full animate-pulse"></div>

        <h1 className="relative text-5xl md:text-8xl lg:text-[11rem] font-black tracking-tighter uppercase leading-[0.9] mb-8">
          ANIL <span className="text-orange-600 block md:inline">SHOPIFY</span>
        </h1>
        <div className="relative inline-block px-6 py-2 border border-slate-800 bg-slate-900/50 backdrop-blur-md rounded-full mb-6">
          <p className="text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] text-orange-500 font-bold">
            The Future of E-Commerce
          </p>
        </div>
      </section>

      {/* --- OWNER SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-lg bg-orange-600/10 text-orange-600 border border-orange-600/20">
              <Zap size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Founder & CEO
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
              I AM <br />
              <span className="text-orange-600">ANIL KUMAR</span>
            </h2>
            <p className="text-base md:text-xl text-slate-400 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              "Anil-Shopify is a commitment to excellence. I built this to prove
              that quality and technology can transform the shopping journey."
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-slate-900 pt-8">
              <div>
                <p className="text-3xl md:text-5xl font-black text-white">
                  30+
                </p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                  Projects Mastery
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-5xl font-black text-white">
                  100%
                </p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                  Dedication
                </p>
              </div>
            </div>
          </div>

          <div className="relative group mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-2 bg-orange-600 rounded-[2.5rem] blur-xl opacity-20 transition duration-1000"></div>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 aspect-[4/5]">
              <img
                src={photos.founder}
                alt="Anil Kumar"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x500?text=Check+Image+Path";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP SECTION --- */}
      <section className="bg-[#0a0c10] py-20 md:py-32 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row-reverse gap-12 md:gap-20 items-center">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter">
                Our <span className="text-orange-600">Leadership</span>
              </h3>
              <p className="text-lg md:text-xl text-slate-400 italic border-l-0 md:border-l-4 md:border-orange-600 md:pl-6">
                "Support of visionary leadership is the foundation of
                innovation."
              </p>
              <p className="text-slate-500 text-sm md:text-lg leading-relaxed">
                Special thanks to our College Head for providing the
                infrastructure and guidance that allowed us to scale this
                project from a dream to reality.
              </p>
            </div>
            <div className="w-64 md:w-[400px]">
              <img
                src={photos.collegeHead}
                alt="College Head"
                className="w-full h-auto rounded-[2rem] shadow-2xl border border-slate-800"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x500?text=Head+Image";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER & NAVIGATION --- */}
      <footer className="py-20 text-center bg-[#05070a]">
        <h2 className="text-3xl md:text-5xl font-black uppercase mb-8 tracking-tighter px-4">
          Ready to See the Work?
        </h2>

        {/* Responsive Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
          <button
            onClick={() => (window.location.href = "/")} // Change to your Home path
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => (window.location.href = "/products")} // Change to your Shop path
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-orange-600/20"
          >
            Start Shopping <ArrowRight size={16} />
          </button>
        </div>

        <p className="mt-12 text-slate-600 text-[10px] uppercase tracking-[0.5em]">
          Anil Shopify &copy; 2026
        </p>
      </footer>
    </div>
  );
};

export default Aboutuspage;
