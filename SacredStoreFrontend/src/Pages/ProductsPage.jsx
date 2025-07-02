import React, { useState, useEffect, useMemo } from 'react';
import { Star, ChevronLeft, ShoppingCart, Heart, Search, Filter, X, ChevronRight } from 'lucide-react';
import ProductDetail from '../Components/ProductDetail'; // Import the new ProductDetail component

const ProductPage = ({ category, onBack, onAddToCart: handleGlobalAddToCart }) => {
  const [allProductsData] = useState([ // Renamed to avoid confusion with filtered products state
    {
      id: 1,
      name: "Lord Ganesha Brass Idol",
      price: 1299,
      originalPrice: 1599,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      rating: 4.8,
      reviews: 124,
      category: "Idols & Statues",
      description: "A beautifully crafted brass idol of Lord Ganesha, perfect for your home altar or as a decorative piece. Symbolizes wisdom and prosperity."
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
      description: "The timeless scripture of Bhagavad Gita in an easy-to-understand Hindi translation. A must-have for spiritual seekers."
    },
    {
      id: 3,
      name: "Rudraksha Mala (108 Beads)",
      price: 899,
      originalPrice: 1199,
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400",
      rating: 4.7,
      reviews: 156,
      category: "Jewelry",
      description: "Authentic 108-bead Rudraksha Mala, traditionally used for meditation and prayer. Believed to offer protection and inner peace."
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
      description: "A set of 12 traditional clay diyas, perfect for Diwali, pujas, and everyday spiritual practices. Adds a warm glow to any space."
    },
    {
      id: 5,
      name: "Lakshmi Narayana Idol",
      price: 1800,
      image: "https://images.unsplash.com/photo-1621257406140-fd530b1b1c67?w=400",
      rating: 4.9,
      reviews: 95,
      category: "Idols & Statues",
      description: "Exquisite Lakshmi Narayana idol, symbolizing prosperity and divine union. Crafted with intricate details."
    },
    {
      id: 6,
      name: "Upanishads Collection",
      price: 450,
      image: "https://images.unsplash.com/photo-1582218903323-95889753c13b?w=400",
      rating: 4.8,
      reviews: 60,
      category: "Religious Books",
      description: "A comprehensive collection of major Upanishads, essential texts of Hindu philosophy. Deep insights into the nature of reality."
    },
    {
      id: 7,
      name: "Panchmukhi Hanuman Pendant",
      price: 650,
      image: "https://images.unsplash.com/photo-1634731301032-15f5a8c2f1f2?w=400",
      rating: 4.7,
      reviews: 70,
      category: "Jewelry",
      description: "A powerful Panchmukhi Hanuman pendant, believed to bring strength and protection. A spiritual adornment."
    },
    {
      id: 8,
      name: "Brass Puja Thali Set",
      price: 750,
      image: "https://images.unsplash.com/photo-1596700021319-74d39f8d5f2a?w=400",
      rating: 4.8,
      reviews: 110,
      category: "Pooja Items",
      description: "Complete brass puja thali set with all essentials for daily worship. Adds elegance to your rituals."
    },
     {
      id: 9,
      name: "Om Wall Hanging (Metal)",
      price: 950,
      image: "https://images.unsplash.com/photo-1627768593414-b5b6a7e0c8d7?w=400",
      rating: 4.5,
      reviews: 45,
      category: "Home Décor",
      description: "Beautiful metal 'Om' wall hanging, perfect for bringing positive energy and spiritual ambiance to your home."
    },
    {
      id: 10,
      name: "Sandalwood Incense Sticks",
      price: 150,
      image: "https://images.unsplash.com/photo-1588636407001-e28d44e5f7a0?w=400",
      rating: 4.7,
      reviews: 180,
      category: "Incense",
      description: "Premium quality sandalwood incense sticks for a calming and spiritual aroma during meditation or daily prayers."
    },
    {
      id: 11,
      name: "Brass Ganesh Diya",
      price: 450,
      image: "https://images.unsplash.com/photo-1599879796030-9b343c5b5d8d?w=400",
      rating: 4.6,
      reviews: 90,
      category: "Pooja Items",
      description: "An intricately designed brass diya featuring Lord Ganesha, ideal for illuminating your sacred space."
    },
    {
      id: 12,
      name: "Meditation Cushion (Zafu)",
      price: 1200,
      image: "https://images.unsplash.com/photo-1532456429535-3037f0b5d5d8?w=400",
      rating: 4.8,
      reviews: 55,
      category: "Home Décor",
      description: "Comfortable and supportive zafu meditation cushion, promoting proper posture for extended meditation sessions."
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('default'); // New state for sorting
  const [showFilters, setShowFilters] = useState(false);

  // Product Detail View State
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Memoize filtered and sorted products to avoid unnecessary re-renders
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProductsData;

    // 1. Filter by Category
    if (category && category !== "All Products") {
      filtered = filtered.filter(product => product.category === category);
    }

    // 2. Apply Search Term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) // Search by description too
      );
    }

    // 3. Apply Price Filters
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // 4. Apply Rating Filter
    if (minRating) {
      filtered = filtered.filter(product => product.rating >= parseFloat(minRating));
    }

    // 5. Apply Sorting
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        } else if (sortBy === 'price-desc') {
          return b.price - a.price;
        } else if (sortBy === 'rating-desc') {
          return b.rating - a.rating;
        }
        return 0; // Should not happen with 'default' check
      });
    }

    return filtered;
  }, [allProductsData, category, searchTerm, minPrice, maxPrice, minRating, sortBy]);

  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    const timer = setTimeout(() => {
      if (filteredAndSortedProducts.length === 0) {
        setError("No products found matching your criteria.");
      } else {
        setError(null);
      }
      setLoading(false);
    }, 300); // Small delay to simulate fetch
    return () => clearTimeout(timer);
  }, [filteredAndSortedProducts]); // Depend on memoized list

  const ProductCard = ({ product }) => {
    const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);

    const handleAddToCartClick = (e) => {
      e.stopPropagation(); // Prevent opening product detail when adding to cart
      handleGlobalAddToCart({ ...product, quantity: 1 }); // Pass to homepage cart
      setAddedToCartFeedback(true);
      setTimeout(() => setAddedToCartFeedback(false), 1000); // Hide feedback after 1 second
    };

    return (
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
        onClick={() => setSelectedProduct(product)} // Click to view product details
      >
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
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="text-sm text-orange-600 font-medium mb-1">{product.category}</div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
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

  // Conditional render for ProductDetail
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)} // Go back to product list
        onAddToCart={handleGlobalAddToCart} // Pass global cart function
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-gray-600 text-sm mb-6 flex items-center">
          <span className="cursor-pointer hover:text-orange-600" onClick={onBack}>Home</span>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="font-semibold text-gray-800">{category || 'All Products'}</span>
        </nav>

        {/* Header with Back Button, Title, Search, and Filter Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="p-2 text-orange-600 hover:text-orange-700 rounded-full hover:bg-gray-200 transition-colors"
              title="Back to Homepage"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize flex-1 text-center sm:text-left">
              {category || 'All Products'}
            </h1>
          </div>

          <div className="flex items-center w-full sm:w-2/3 md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            <button
              className="ml-3 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle Filters"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters & Sorting Sidebar (or overlay for smaller screens) */}
          <div className={`lg:w-1/4 bg-white p-6 rounded-xl shadow-md transition-all duration-300 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Filter Products</h3>
              <button className="lg:hidden p-1 rounded-full text-gray-600 hover:bg-gray-100" onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Price Range (₹)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Minimum Rating</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5 Stars & Up</option>
                <option value="4">4 Stars & Up</option>
                <option value="3.5">3.5 Stars & Up</option>
                <option value="3">3 Stars & Up</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Sort By</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || minPrice || maxPrice || minRating || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setMinPrice('');
                  setMaxPrice('');
                  setMinRating('');
                  setSortBy('default');
                  setError(null);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Filters & Sort
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-16 text-xl text-gray-700">Loading products...</div>
            ) : error ? (
              <div className="text-center py-16">
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-results-5654399-4702919.png"
                  alt="No results found"
                  className="mx-auto w-64 h-64 object-contain mb-4"
                />
                <p className="text-xl text-red-600 mb-2">Oops! {error}</p>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? ( // Specific check for zero results after filtering
                 <div className="text-center py-16">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-results-5654399-4702919.png"
                        alt="No results found"
                        className="mx-auto w-64 h-64 object-contain mb-4"
                    />
                    <p className="text-xl text-gray-700 mb-2">No products found for this category or your current filters.</p>
                    <p className="text-gray-600">Consider clearing your filters or exploring other categories.</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;