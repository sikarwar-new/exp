import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

function ProductCard({ title, subject, numRatings, price, noteData, onAddToCart }) {
  const { user, loggedIn } = useAuth();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  // Real-time listener for user document
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setUserDoc(doc.data());
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const getButtonState = () => {
    if (!loggedIn) {
      return { text: "Login to Purchase", color: "bg-gray-400", disabled: true };
    }

    if (!userDoc) {
      return { text: "Loading...", color: "bg-gray-400", disabled: true };
    }

    // Check if note is in approvedNotes
    const isApproved = userDoc.approvedNotes?.some(note => note.title === title);
    if (isApproved) {
      return { text: "Start Reading", color: "bg-green-500 hover:bg-green-600", disabled: false, action: "read" };
    }

    // Check if note is in pendingNotes
    const isPending = userDoc.pendingNotes?.some(note => note.title === title);
    if (isPending) {
      return { text: "Pending", color: "bg-yellow-500", disabled: true };
    }

    // Check if note is in cart
    if (isInCart(title)) {
      return { text: "Remove Item", color: "bg-red-500 hover:bg-red-600", disabled: false, action: "remove" };
    }

    // Default: Add to Cart
    return { text: "Add to Cart", color: "bg-orange-500 hover:bg-orange-600", disabled: false, action: "add" };
  };

  const handleButtonClick = () => {
    const buttonState = getButtonState();
    
    if (buttonState.disabled) return;

    switch (buttonState.action) {
      case "read":
        // Open drive link
        const approvedNote = userDoc.approvedNotes?.find(note => note.title === title);
        if (approvedNote?.driveLink) {
          window.open(approvedNote.driveLink, '_blank');
        }
        break;
      case "remove":
        removeFromCart(title);
        break;
      case "add":
        const cartItem = {
          title,
          subject,
          price: price || 25,
          quantity: 1,
          ...noteData
        };
        addToCart(cartItem);
        break;
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{subject}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {numRatings} reviews
          </span>
          <span className="text-lg font-bold text-orange-600">
            ₹{price || 25}
          </span>
        </div>
      </div>
      
      <button
        onClick={handleButtonClick}
        disabled={buttonState.disabled || loading}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${buttonState.color} text-white ${
          buttonState.disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {loading ? 'Processing...' : buttonState.text}
      </button>
    </div>
  );
}

export default ProductCard;