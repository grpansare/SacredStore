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
import ProductPage from "./ProductsPage"; // Import ProductPage
import Navbar from "../components/Navbar"; // Import Navbar (adjust path if needed)

const Home = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]); // New state for cart items

  // Function to add item to cart
  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + productToAdd.quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          { ...productToAdd, quantity: productToAdd.quantity || 1 },
        ]; // Ensure quantity is at least 1
      }
    });
  };

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
      category: "Idols & Statues", // Match category name with ProductPage
    },
    {
      id: 2,
      name: "Bhagavad Gita (Hindi)",
      price: 299,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      rating: 4.9,
      reviews: 89,
      category: "Religious Books", // Match category name with ProductPage
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
      category: "Jewelry", // Match category name with ProductPage
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
      category: "Pooja Items", // Match category name with ProductPage
    },
  ];


const categories = [
  {
    name: 'Books',
    count: '120 items',
    icon: '📚', // Example icon
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Idols',
    count: '85 items',
    icon: '🙏', // Example icon
    color: 'from-green-400 to-green-600',
  },
  {
    name: 'Jewelry',
    count: '50 items',
    icon: '💎', // Example icon
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Apparel',
    count: '75 items',
    icon: '👕', // Example icon
    color: 'from-red-400 to-red-600',
  },
  {
    name: 'Home Decor',
    count: '90 items',
    icon: '🏡', // Example icon
    color: 'from-yellow-400 to-yellow-600',
  },
 
  {
    name: 'Music',
    count: '40 items', // Example count, adjust as needed
    icon: '🎵', // A musical note icon
    color: 'from-pink-400 to-pink-600', // A vibrant color for music
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
  }, []);

  // ProductCard for Homepage (similar to ProductPage but without direct link to detail)
  const HomepageProductCard = ({ product }) => {
    const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

    const handleAddToCartClick = (e) => {
      e.stopPropagation(); // Prevent any parent click handlers
      handleAddToCart({ ...product, quantity: 1 }); // Pass to global cart
      setAddedToCartFeedback(true);
      setTimeout(() => setAddedToCartFeedback(false), 1000); // Hide feedback after 1 second
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

  // Conditional render for ProductPage
  if (selectedCategory) {
    return (
      <ProductPage
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      <Navbar
        setSelectedCategory={setSelectedCategory}
        cartItems={cartItems}
      />

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-400/40 z-10"></div>

        <img
          src={heroSlides[currentSlide].image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-center  z-0"
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

      {/* Categories Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Discover our wide range of spiritual and religious products
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedCategory(category.name)}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
              >
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.count}</p>
            </div>
          ))}
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
            onClick={() => setSelectedCategory("All Products")}
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div
                className="flex items-center space-x-3 mb-4 cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🕉</span>
                </div>
                <h3 className="text-xl font-bold">Divine Store</h3>
              </div>
              <p className="text-gray-400">
                Your trusted partner for authentic religious and spiritual
                products.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory("All Products");
                    }}
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to get special offers and updates
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
                />
                <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Divine Store. All rights reserved. | Developed by
              Ganesh for Secbyte Technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home
