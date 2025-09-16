import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const increment = (item) => addToCart(item, 1);
  const decrement = (item) => {
    if (item.quantity === 1) removeFromCart(item.productId);
    else updateQuantity(item.productId, item.quantity - 1);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Separate free and paid items
    const freeItems = cartItems.filter((item) => item.price === 0);
    const paidItems = cartItems.filter((item) => item.price > 0);

    // If all items are free
    if (paidItems.length === 0 && freeItems.length > 0) {
      const downloads = freeItems
        .map((item) => item.file_url || item.file_path) // use file_url or file_path
        .filter(Boolean);

      if (downloads.length === 0) {
        alert("No download links available for free items.");
        return;
      }

      // Remove free items from cart
      freeItems.forEach((item) => removeFromCart(item.productId));

      // Navigate to ThankYou page with downloads
      navigate(
        `/thank-you?downloads=${encodeURIComponent(JSON.stringify(downloads))}`
      );
      return;
    }

    // Paid items flow (if any)
    if (paidItems.length > 0) {
      // Your Stripe checkout flow would go here
      alert("Paid items flow not implemented in this free-only version.");
    }
  };

  if (cartItems.length === 0)
    return <p className="p-4 text-center">Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.productId} className="cart-item">
            <div className="flex items-center gap-4">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} />
              )}
              <div>
                <p className={item.price === 0 ? "free" : ""}>{item.name}</p>
                <p>{item.price === 0 ? "Free" : `$${item.price.toFixed(2)}`}</p>
              </div>
            </div>

            <div className="quantity-controls">
              <button onClick={() => decrement(item)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increment(item)}>+</button>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.productId)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <p className="total">Total: ${totalPrice.toFixed(2)}</p>
        <div className="flex gap-2">
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Download Free Items"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
