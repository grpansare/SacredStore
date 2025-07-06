// src/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // Import the useCart hook
import { Trash2 } from 'lucide-react'; // For remove icon

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600">Start shopping to add items to your cart!</p>
          <button
            onClick={() => window.history.back()} // Go back to previous page
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Your Shopping Cart</h2>

        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-gray-900 font-bold">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6 flex justify-between items-center">
          <p className="text-xl font-bold text-gray-900">Total:</p>
          <p className="text-2xl font-extrabold text-orange-600">₹{cartTotal.toFixed(2)}</p>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={clearCart}
            className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;