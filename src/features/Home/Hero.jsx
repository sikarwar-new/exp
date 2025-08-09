import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

function Hero() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="text-center max-w-[800px] mt-32 mx-auto px-4 rounded-xl py-8 transition-colors duration-300">
      <h1 className="text-4xl sm:text-6xl font-bold text-black mb-10">
        Study Smarter with Notes That Actually Work.
      </h1>

      <p className="text-gray-500">
        Get top-rated notes from seniors who’ve been there, done that. Save
        time, boost your grades, and focus on what really matters.
      </p>

      <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
        <button className="bg-white text-black border border-gray-500 rounded-3xl px-6 py-2 font-semibold shadow hover:bg-gray-100 transition">
          Free Notes
        </button>
        <NavLink to="/resources">
          <button className="bg-orange-500 text-white rounded-3xl px-6 py-2 font-semibold hover:bg-orange-600 transition">
            Explore Notes
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Hero;
