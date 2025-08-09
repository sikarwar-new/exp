import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust path
import QRCodeImage from "../assets/qr.svg"; // Add your QR code image in assets

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };
  const [paymentId, setPaymentId] = useState("");
  const [error, setError] = useState("");

  const handleFakePayment = () => {
    if (!paymentId.trim()) {
      setError("Please enter your Payment ID.");
      return;
    }
    setError("");
    // Here you might call a real payment verification or just simulate pending state
    // For now, just navigate to pending/success page with purchase info & paymentId
    navigate("/success", {
      state: {
        purchasedItems: cartItems,
        paymentId,
        userEmail: "user@example.com",
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 px-4 pt-24 flex justify-center">
        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto p-6 bg-yellow-100 rounded-xl shadow-lg text-yellow-800 text-center">
            <p className="text-lg font-medium">
              Your cart is empty. Please add some notes before payment.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center bg-white max-w-4xl w-full rounded-xl shadow-lg p-8 space-y-6 lg:space-y-0 lg:space-x-8">
            {/* QR code */}
            <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
              <img
                src={QRCodeImage}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Payment details and form */}
            <div className="w-full lg:w-2/3 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 text-center lg:text-left">
                Payment (Pending)
              </h2>

              <p className="text-gray-600 text-center lg:text-left">
                Review your purchase and enter your Payment ID to confirm.
              </p>

              <ul className="list-disc list-inside text-gray-700 max-h-48 overflow-y-auto space-y-2 px-4 max-w-md mx-auto lg:mx-0">
                {cartItems.map((item) => (
                  <li key={item.title} className="text-base font-medium">
                    {item.title} — ₹{item.price} × {item.quantity || 1}
                  </li>
                ))}
              </ul>

              <div className="max-w-md mx-auto lg:mx-0">
                <label
                  htmlFor="paymentId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment ID
                </label>
                <input
                  id="paymentId"
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="Enter your payment transaction ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {error && (
                  <p className="mt-1 text-red-600 text-sm font-medium">
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleFakePayment}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 max-w-md mx-auto lg:mx-0"
              >
                Submit Payment ID
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
