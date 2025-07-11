// src/Homepage.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Star,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// ProductPage and Navbar are no longer imported here, as they are handled by App.jsx and Routes.

const Homepage = ({ handleAddToCart }) => {
  // Receive handleAddToCart as prop
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Mock data (same as before)
  const featuredProducts = [
    {
      id: 1,
      name: "Lord Ganesha Brass Idol",
      price: 1299,
      originalPrice: 1599,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      rating: 4.8,
      reviews: 124,
      category: "Idols & Statues",
    },
    {
      id: 2,
      name: "Bhagavad Gita (Hindi)",
      price: 299,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      rating: 4.9,
      reviews: 89,
      category: "Religious Books",
    },
    {
      id: 3,
      name: "Rudraksha Mala",
      price: 899,
      originalPrice: 1199,
      image:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400",
      rating: 4.7,
      reviews: 156,
      category: "Jewelry",
    },
    {
      id: 4,
      name: "Diya Set (Pack of 12)",
      price: 199,
      originalPrice: 299,
      image:
        "https://images.unsplash.com/photo-1604608672516-f1b2147880a0?w=400",
      rating: 4.6,
      reviews: 203,
      category: "Pooja Items",
    },
  ];
  const categories = [
    {
      name: "Idols & Statues",
      image: "/assets/category-idols.png", // Added image
      count: "150+ Items",
      color: "from-orange-400 to-red-500",
      fetchName: "Idols & Statues", // Added fetchName
    },
    {
      name: "Religious Books",
      image: "/assets/category-books.png", // Added image
      count: "200+ Items",
      color: "from-blue-400 to-indigo-500",
      fetchName: "Books",
    },
    {
      name: "Pooja Items",
      image: "/assets/category-pooja.png", // Added image
      count: "300+ Items",
      color: "from-yellow-400 to-orange-500",
      fetchName: "Prayer Items",
    },
    {
      name: "Jewelry",
      image: "/assets/category-jewelry.png", // Added image
      count: "80+ Items",
      color: "from-purple-400 to-pink-500",
      fetchName: "Jewelry",
    },
    {
      name: "Home Décor",
      image: "/assets/category-homedecor.png", // Added image
      count: "120+ Items",
      color: "from-green-400 to-blue-500",
      fetchName: "Decor", // Added fetchName
    },

    {
      name: "Music",
      count: "40 items",
      image: "/assets/category-music.jpg", // Added image
      color: "from-pink-400 to-pink-600",
      fetchName: "Music", // Added fetchName
    },
  ];

  const heroSlides = [
    {
      title: "Divine Blessings Await",
      subtitle: "Discover sacred items for your spiritual journey",
      image: "/assets/ganesh-idol.jpg",
      cta: "Shop Now",
    },
    {
      title: "Festival Special Collection",
      subtitle: "Celebrate with authentic religious products",
      image: "/assets/diya.webp",
      cta: "Explore Deals",
    },
    {
      title: "Sacred Books & Scriptures",
      subtitle: "Expand your spiritual knowledge with ancient wisdom",
      image: "/assets/books.png",
      cta: "Browse Books",
    },
    {
      title: "Handcrafted Jewelry",
      subtitle: "Adorn yourself with sacred symbols and gemstones",
      image: "/assets/jewellery.png",
      cta: "View Collection",
    },
    {
      title: "Temple Essentials",
      subtitle: "Everything you need for daily worship and rituals",
      image: "/assets/temple.jpg",
      cta: "Shop Essentials",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]); // Add heroSlides.length to dependency array

  const HomepageProductCard = ({ product }) => {
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
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[550px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-400/40 z-10"></div>

        <img
          src={heroSlides[currentSlide].image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-center z-0"
        />

        <div className="relative z-20 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              {heroSlides[currentSlide].title}
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              {heroSlides[currentSlide].cta}
              <ChevronRight className="inline w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-amber-50/30 rounded-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our curated collection of spiritual and religious
              products designed to enhance your journey
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative h-52 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/products/${category.fetchName
                      }`
                  )
                }
                  
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.image})`,
                  }}
                ></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-500"></div>

                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                  <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-200 group-hover:text-white transition-colors duration-300 font-medium">
                      {category.count}
                    </p>

                    {/* Animated underline */}
                    <div className="w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-500 mt-2"></div>
                  </div>
                </div>

                {/* Hover arrow indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-2 left-2 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-0"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-100 scale-0"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="mt-16 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-amber-500 rounded-full"></div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
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
            <HomepageProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Festival Special Offers
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get up to 50% off on selected religious items
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Shop Offers
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Will be rendered by App.jsx */}
    </div>
  );
};

export default Homepage;
