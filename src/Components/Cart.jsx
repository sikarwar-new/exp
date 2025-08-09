import React from "react";
import { useCart } from "../contexts/CartContext";
import emptyCart from "../assets/emptyCart.png";
import { NavLink, useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleClearCart = () => {
    cartItems.forEach((item) => removeFromCart(item.title));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    navigate("/payment", { state: { cartItems } });
  };

  return (
    <div className="max-w-3xl mx-auto w-[90%] bg-white rounded-xl shadow-lg p-8 text-gray-800">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <img className="w-40 opacity-80" src={emptyCart} alt="Empty cart" />
          <p className="text-xl font-semibold">Your cart is empty!</p>
          <p className="text-gray-500 text-sm">
            Add some notes to get started.
          </p>
          <NavLink
            to="/resources"
            className="mt-4 px-6 py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition"
          >
            Browse Resources
          </NavLink>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Your Cart
          </h2>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.title}
                className="flex justify-between items-center py-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} x {item.quantity || 1}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.title)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center border-t pt-4">
            <p className="text-xl font-semibold">Total: ₹{totalPrice}</p>
            <div className="flex gap-3">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-semibold"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
