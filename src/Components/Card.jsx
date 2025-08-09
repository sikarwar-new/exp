import React from "react";

function Card({ children, className = "", onClick }) {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
}

export default Card;
