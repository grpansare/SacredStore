import { ChevronRight } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'

import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom'; // For navigation
import HomepageProductCard from './HomepageCard';

const FeaturedProducts = ({handleAddToCart}) => {

    const [featuredProducts, setFeaturedProducts] = useState([]);

   useEffect(() => {        
    const fetchFeaturedProducts = async () => {
      try {                 
        const response = await axios.get('https://sacredstore.onrender.com/api/products/featured');
        setFeaturedProducts(response.data);         
        } catch (error) {
            console.error("Error fetching featured products:", error);
            setError("Failed to load featured products.");
            }   

        };      
    fetchFeaturedProducts();
    }, []); 

  return (
     <>
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked items for your spiritual journey
            </p>
          </div>
          <button
            className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
            onClick={() => navigate("/products/all-products")} // Navigate to all products
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <HomepageProductCard key={product.id} product={product} handleAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

    </>
  )
}

export default FeaturedProducts