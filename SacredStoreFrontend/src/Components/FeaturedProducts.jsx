import { ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom'; // For navigation
import HomepageProductCard from './HomepageCard';

const FeaturedProducts = ({handleAddToCart}) => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://sacredstore.onrender.com/api/products/featured');
                setFeaturedProducts(response.data);
            } catch (error) {
                console.error("Error fetching featured products:", error);
                setError("Failed to load featured products.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    // Simple Loader Component
    const SimpleLoader = () => (
        <div className="flex flex-col items-center justify-center py-16">
            {/* Spinning icon */}
            <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
            
            {/* Loading text */}
            <p className="text-gray-600 font-medium">Loading sacred products...</p>
            
            {/* Animated dots */}
            <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    );

    // Product Grid Skeleton Loader (alternative option)
    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );

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

                {/* Conditional rendering based on loading state */}
                {loading ? (
                    <SimpleLoader />
                    // Alternative: Use <SkeletonLoader /> for a more detailed loading experience
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-red-600 font-medium mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <HomepageProductCard key={product.id} product={product} handleAddToCart={handleAddToCart} />
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}

export default FeaturedProducts