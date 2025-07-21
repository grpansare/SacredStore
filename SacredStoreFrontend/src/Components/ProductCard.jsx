import React, { useState } from "react";
import { Heart, ShoppingCart, Star, X, Plus, Minus } from "lucide-react";
import Swal from "sweetalert2";

import { useCart } from "../context/CartContext";

// Product Modal Component
import ProductModal from "./ProductModal";

// Updated ProductCard Component
const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation(); // Prevent modal from opening

    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      await addToCart({ ...product, quantity: 1 });

      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        icon: "success",
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
        customClass: {
          popup: "swal2-toast-custom",
          title: "swal2-toast-title",
          icon: "swal2-toast-icon",
        },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to add item to cart. Please try again.",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-fill group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <button
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button>
          </div>
          {product.originalPrice > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % OFF
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="text-sm text-orange-600 font-medium mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating}
            </span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <button
              className={`${
                isAddingToCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
              onClick={handleAddToCartClick}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
