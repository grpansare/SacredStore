import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react'; // Assuming you have these icons
import { useCart } from '../context/CartContext'; // Assuming you have a CartContext for managing cart state
import { useNavigate } from 'react-router-dom'; // For navigation   
import axios from 'axios'; // For making API requests

import { useSelector } from 'react-redux'; // For accessing user state
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // For dispatching actions

    const HomepageProductCard = ({ product ,handleAddToCart}) => {
    const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

    const handleAddToCartClick = (e) => {
      e.stopPropagation();
      handleAddToCart({ ...product, quantity: 1 });
      setAddedToCartFeedback(true);
      setTimeout(() => setAddedToCartFeedback(false), 1000);
    };

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md">
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
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors relative"
              onClick={handleAddToCartClick}
            >
              Add to Cart
              {addedToCartFeedback && (
                <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  +1
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
