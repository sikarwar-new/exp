import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebase";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState("");

  const { purchasedItems, paymentId } = location.state || {};

  useEffect(() => {
    const processPurchase = async () => {
      if (!user || !purchasedItems || purchasedItems.length === 0) {
        setError("Invalid purchase data");
        setProcessing(false);
        return;
      }

      try {
        // Add purchased items to user's pendingNotes
        const userRef = doc(db, "users", user.uid);
        
        const notesToAdd = purchasedItems.map(item => ({
          title: item.title,
          subject: item.subject,
          price: item.price,
          purchasedAt: new Date(),
          paymentId: paymentId || "manual_payment",
          status: "pending_approval"
        }));

        await updateDoc(userRef, {
          pendingNotes: arrayUnion(...notesToAdd),
          updatedAt: new Date()
        });

        setProcessing(false);
      } catch (err) {
        console.error("Error processing purchase:", err);
        setError("Failed to process purchase. Please contact support.");
        setProcessing(false);
      }
    };

    processPurchase();
  }, [user, purchasedItems, paymentId]);

  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Purchase</h2>
          <p className="text-gray-600">Please wait while we process your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center px-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-4 pt-24">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your purchase has been completed successfully. The notes are now pending admin approval.
        </p>
        
        {purchasedItems && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Purchased Items:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {purchasedItems.map((item, index) => (
                <li key={index}>
                  {item.title} - ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
          >
            Go to Profile
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;