import React, { useState } from "react";
import { Heart, ShoppingCart, Star, X, Plus, Minus } from "lucide-react";   
import Swal from "sweetalert2";
  
import { useCart } from "../context/CartContext";

// Product Modal Component
const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();

    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      // Pass the product with the selected quantity
      await addToCart(product, selectedQuantity);

      Swal.fire({
        title: "Added to Cart!",
        text: `${selectedQuantity} x ${product.name} has been added to your cart.`,
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
      
      onClose(); // Close modal after successful add
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

  const increaseQuantity = () => {
    setSelectedQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
              {product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <span className="text-sm text-orange-600 font-medium">
                  {product.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-700">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-green-600 font-medium">
                    You save ₹{product.originalPrice - product.price}
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "High-quality product with excellent features and durability. Perfect for daily use and designed to meet your needs with premium materials and craftsmanship."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={selectedQuantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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