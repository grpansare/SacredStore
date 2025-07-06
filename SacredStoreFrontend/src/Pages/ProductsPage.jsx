// src/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Heart, Filter, X, ChevronDown, Search } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext'; // Import the useCart hook

const ProductPage = () => { // Remove handleAddToCart prop
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [availableCategories, setAvailableCategories] = useState([]);

  // Use the useCart hook to get addToCart function
  const { addToCart } = useCart();

  // Mock product data (as you had it)
  const allProducts = [
    {
      id: 1,
      name: "Lord Ganesha Brass Idol",
      price: 1299,
      originalPrice: 1599,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      rating: 4.8,
      reviews: 124,
      category: "Idols & Statues",
      description: "Beautifully crafted brass idol of Lord Ganesha, perfect for your home altar or as a decorative piece.",
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
      description: "The complete Bhagavad Gita in Hindi, a timeless scripture offering profound spiritual wisdom.",
    },
    {
      id: 3,
      name: "Rudraksha Mala",
      price: 899,
      originalPrice: 1199,
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400",
      rating: 4.7,
      reviews: 156,
      category: "Jewelry",
      description: "Authentic Rudraksha Mala with 108 beads, ideal for meditation and chanting.",
    },
    {
      id: 4,
      name: "Diya Set (Pack of 12)",
      price: 199,
      originalPrice: 299,
      image: "https://images.unsplash.com/photo-1604608672516-f1b2147880a0?w=400",
      rating: 4.6,
      reviews: 203,
      category: "Pooja Items",
      description: "A set of 12 traditional clay diyas, perfect for Diwali and other festive occasions.",
    },
    {
      id: 5,
      name: "Brass Puja Thali",
      price: 499,
      originalPrice: 599,
      image: "https://images.unsplash.com/photo-1628189679198-d2e6b1d1e4e7?w=400",
      rating: 4.5,
      reviews: 90,
      category: "Pooja Items",
      description: "Elegant brass puja thali with intricate designs for your daily rituals.",
    },
    {
      id: 6,
      name: "Srimad Bhagavatam (English)",
      price: 799,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1594904500908-ee9a721c5b8b?w=400",
      rating: 4.9,
      reviews: 75,
      category: "Religious Books",
      description: "The timeless wisdom of Srimad Bhagavatam translated into English, a spiritual masterpiece.",
    },
    {
      id: 7,
      name: "Lakshmi Ganesh Idol Set",
      price: 2499,
      originalPrice: 2999,
      image: "https://images.unsplash.com/photo-1562916698-c1e1c3a6e6a1?w=400",
      rating: 4.8,
      reviews: 110,
      category: "Idols & Statues",
      description: "Exquisite set of Lakshmi and Ganesha idols, symbolizing prosperity and good fortune.",
    },
    {
      id: 8,
      name: "Incense Sticks (Sandalwood)",
      price: 149,
      originalPrice: 180,
      image: "https://images.unsplash.com/photo-1603994326555-d419d2c6c0b3?w=400",
      rating: 4.7,
      reviews: 180,
      category: "Incense",
      description: "High-quality sandalwood incense sticks for a calming and spiritual ambiance.",
    },
  ];

  useEffect(() => {
    setLoading(true);
    const formattedCategory = categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/ And /g, ' & ');

    const initialProducts =
      categoryName === "all-products"
        ? allProducts
        : allProducts.filter((p) => p.category === formattedCategory);

    setProducts(initialProducts);

    // Set available categories for current products
    const categories = [...new Set(initialProducts.map(p => p.category))];
    setAvailableCategories(categories);

    // Set price range based on available products
    if (initialProducts.length > 0) {
      const prices = initialProducts.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([0, 3000]); // Default range if no products
    }


    setLoading(false);
  }, [categoryName]);

  // Apply filters and sorting
  useEffect(() => {
    let currentFiltered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply price filter
    currentFiltered = currentFiltered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply rating filter
    if (selectedRating > 0) {
      currentFiltered = currentFiltered.filter(product => product.rating >= selectedRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        currentFiltered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        currentFiltered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        currentFiltered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        currentFiltered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'discount':
        currentFiltered.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case 'relevance':
        // Sort by search relevance if there's a search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          currentFiltered.sort((a, b) => {
            const aScore = getRelevanceScore(a, query);
            const bScore = getRelevanceScore(b, query);
            return bScore - aScore;
          });
        }
        break;
      default:
        // Keep original order or a stable default if no search query
        break;
    }

    setFilteredProducts(currentFiltered);
  }, [products, searchQuery, priceRange, selectedRating, sortBy]); // products dependency added

  // Function to calculate search relevance score
  const getRelevanceScore = (product, query) => {
    let score = 0;
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const category = product.category.toLowerCase();

    // Exact match in name gets highest score
    if (name.includes(query)) {
      score += name.indexOf(query) === 0 ? 100 : 50; // Higher if starts with query
    }

    // Match in category gets medium score
    if (category.includes(query)) {
      score += 25;
    }

    // Match in description gets lower score
    if (description.includes(query)) {
      score += 10;
    }

    // Boost popular items
    score += product.rating * 2;
    score += Math.min(product.reviews / 10, 10); // Cap review boost

    return score;
  };

  const clearFilters = () => {
    // Reset price range to min/max of currently displayed products
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([0, 3000]); // Fallback default
    }
    setSelectedRating(0);
    setSortBy('default');
    setSearchQuery('');
  };

  const ProductCard = ({ product }) => {
    const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

    const handleAddToCartClick = (e) => {
      e.stopPropagation();
      addToCart({ ...product, quantity: 1 }); // Use addToCart from context
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

  const FilterPanel = () => (
    <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-orange-600 hover:text-orange-800 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-20 px-2 py-1 border rounded text-sm"
              placeholder="Min"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 3000])}
              className="w-20 px-2 py-1 border rounded text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedRating === rating}
                onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
                className="mr-2"
              />
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm text-gray-700">{rating} & above</span>
              </div>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="rating"
              value={0}
              checked={selectedRating === 0}
              onChange={(e) => setSelectedRating(0)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">All Ratings</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-800 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Homepage
          </button>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {categoryName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()).replace(/ And /g, ' & ')}
          </h1>
        </nav>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search products, categories, or descriptions..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Searching for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md border"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="default">Default</option>
              {searchQuery && <option value="relevance">Relevance</option>}
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600 ml-auto">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Panel */}
            <div className="lg:w-64 flex-shrink-0">
              <FilterPanel />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-600">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? `No products match "${searchQuery}". Try different keywords or adjust your filters.`
                      : "Try adjusting your filters or search criteria"
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      onClick={clearFilters}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;