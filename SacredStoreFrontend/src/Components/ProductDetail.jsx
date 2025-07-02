import React, { useState } from 'react';
import { ChevronLeft, Star, ShoppingCart, Minus, Plus } from 'lucide-react';

const ProductDetail = ({ product, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Product not found.</p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    setAddedToCartFeedback(true);
    setTimeout(() => setAddedToCartFeedback(false), 1500); // Hide feedback after 1.5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2 flex justify-center items-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <div className="text-lg text-orange-600 font-semibold mb-2">{product.category}</div>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-medium text-gray-700">{product.rating}</span>
              <span className="text-md text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-md text-red-500 font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-gray-700 font-medium mr-4">Quantity:</span>
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="mx-4 text-xl font-semibold text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
              {addedToCartFeedback && (
                <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                  Added!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;