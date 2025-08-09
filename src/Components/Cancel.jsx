import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center px-4 pt-24">
      <div className="max-w-md w-full bg-red-100 rounded-xl shadow-lg p-8 text-center text-red-800">
        <h2 className="text-3xl font-bold mb-4">Payment Cancelled</h2>
        <p className="text-lg mb-6">
          Your payment was not completed. You can try again or browse other
          notes.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;
