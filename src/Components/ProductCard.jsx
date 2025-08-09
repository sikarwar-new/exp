import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Card = ({
  title,
  subject,
  numRatings,
  price,
  driveLink, // Pass the drive link as prop to redirect if accessed
  btn = "Add to Cart",
  isBought = false,
}) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { currentUser } = useAuth();

  const [accessStatus, setAccessStatus] = useState(null); // 'approved', 'pending', 'denied' or null

  const alreadyInCart = isInCart(title);

  useEffect(() => {
    if (!currentUser) {
      setAccessStatus(null);
      return;
    }

    const fetchAccessStatus = async () => {
      try {
        // Query accessRequests where userId == currentUser.uid and requestedNotes contains this title
        const accessReqRef = collection(db, "accessRequests");
        const q = query(
          accessReqRef,
          where("userId", "==", currentUser.uid),
          where("requestedNotes", "array-contains", { title })
        );

        const querySnapshot = await getDocs(q);

        let statusFound = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Check if requestedNotes includes the note with this title
          const requestedNote = data.requestedNotes.find(
            (note) => note.title === title
          );

          if (requestedNote) {
            // Take the highest status if multiple requests exist for the same note
            if (data.status === "approved") statusFound = "approved";
            else if (data.status === "pending" && statusFound !== "approved")
              statusFound = "pending";
            else if (
              data.status === "denied" &&
              statusFound !== "approved" &&
              statusFound !== "pending"
            )
              statusFound = "denied";
          }
        });

        setAccessStatus(statusFound);
      } catch (error) {
        console.error("Error fetching access status:", error);
        setAccessStatus(null);
      }
    };

    fetchAccessStatus();
  }, [currentUser, title]);

  const handleClick = () => {
    if (alreadyInCart) {
      removeFromCart(title);
    } else {
      addToCart({ title, subject, numRatings, price, driveLink });
    }
  };

  // Redirect to drive if access granted or pending
  const handleAccessClick = () => {
    if (driveLink) {
      window.open(driveLink, "_blank");
    } else {
      alert("Drive link not available");
    }
  };

  // Button content and action depends on access status and cart state
  let buttonText = btn;
  let buttonAction = handleClick;
  let buttonClasses =
    "w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 bg-orange-500 text-white hover:bg-orange-600";

  if (isBought) {
    buttonText = "Start Reading";
    buttonAction = () => {
      if (driveLink) window.open(driveLink, "_blank");
      else alert("Drive link not available");
    };
    buttonClasses =
      "w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 bg-gray-200 text-gray-700 hover:bg-gray-300";
  } else if (accessStatus === "approved" || accessStatus === "pending") {
    buttonText = "Access";
    buttonAction = handleAccessClick;
    buttonClasses =
      "w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 bg-green-600 text-white hover:bg-green-700";
  } else if (alreadyInCart) {
    buttonText = "Remove Item";
    buttonAction = handleClick;
    buttonClasses =
      "w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 bg-red-500 text-white hover:bg-red-600";
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-1">{subject}</p>
      <p className="text-xs text-gray-400 mb-3">⭐ {numRatings} ratings</p>

      {!isBought && (
        <p className="text-md font-semibold text-green-600 mb-4">₹{price}</p>
      )}

      <button onClick={buttonAction} className={buttonClasses}>
        {buttonText}
      </button>
    </div>
  );
};

export default Card;
