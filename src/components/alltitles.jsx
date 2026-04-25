import React from "react";

const Alltitles = ({ text }) => {
  return (
    <div className="flex items-center gap-4 w-full  sm:mb-1">
      <hr className="flex-1 border-t-2 border-gray-400" />

      <h1 className="font-bold text-slate-100 lg:text-5xl sm:text-3xl md:text-4xl text-center">
        {text}
      </h1>

      <hr className="flex-1 border-t-2 border-gray-400" />
    </div>
  );
};

export default React.memo(Alltitles);
