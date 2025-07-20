// src/ProductsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Filter,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import ProductCard from "../Components/ProductCard"; // Adjust path if needed

// Import the new FilterPanel component
import FilterPanel from "../components/FilterPanel"; // Adjust path if needed

const ProductPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  // const [availableCategories, setAvailableCategories] = useState([]); // This state is not directly used for filtering UI now

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        console.log(categoryName);
        const formattedCategory = categoryName
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        let response;

        if (categoryName === "all-products") {
          response = await axios.get("http://localhost:8080/api/products");
        } else {
          response = await axios.get(
            `http://localhost:8080/api/products/category/${encodeURIComponent(
              formattedCategory
            )}`
          );
        }

        const data = response.data;
        setProducts(data);

        // Set dynamic price range based on fetched products
        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]); // Initialize priceRange here
        } else {
          setPriceRange([0, 3000]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Function to calculate search relevance score (stays here)
  const getRelevanceScore = useCallback((product, query) => {
    let score = 0;
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const category = product.category.toLowerCase();

    if (name.includes(query)) {
      score += name.indexOf(query) === 0 ? 100 : 50;
    }
    if (category.includes(query)) {
      score += 25;
    }
    if (description.includes(query)) {
      score += 10;
    }

    score += product.rating * 2;
    score += Math.min(product.reviews / 10, 10);
    return score;
  }, []); // No dependencies for this function itself

  // Apply filters and sorting (stays here, depends on all filter states)
  useEffect(() => {
    let currentFiltered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Apply price filter
    currentFiltered = currentFiltered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply rating filter
    if (selectedRating > 0) {
      currentFiltered = currentFiltered.filter(
        (product) => product.rating >= selectedRating
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        currentFiltered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        currentFiltered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        currentFiltered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        currentFiltered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "discount":
        currentFiltered.sort((a, b) => {
          const discountA = a.originalPrice
            ? ((a.originalPrice - a.price) / a.originalPrice) * 100
            : 0;
          const discountB = b.originalPrice
            ? ((b.originalPrice - b.price) / b.originalPrice) * 100
            : 0;
          return discountB - discountA;
        });
        break;
      case "relevance":
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
        break;
    }

    setFilteredProducts(currentFiltered);
  }, [
    products,
    searchQuery,
    priceRange,
    selectedRating,
    sortBy,
    getRelevanceScore,
  ]); // Added getRelevanceScore to dependencies

  // Clear All Filters function for the ProductPage
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedRating(0);
    setSortBy("default");
    // Reset price range based on original products
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([0, 3000]); // Fallback default
    }
  }, [products]); // `products` is a dependency here

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
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
            {categoryName
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
              .replace(/ And /g, " & ")}
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
                onClick={() => setSearchQuery("")}
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
            {showFilters ? (
              <X className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
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
            {/* Filter Panel - Now a separate component */}
            <div className="lg:w-64 flex-shrink-0">
              <FilterPanel
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                sortBy={sortBy}
                setSortBy={setSortBy}
                products={products} // Pass products to enable clearAllFilters to reset price range
                clearAllFilters={clearAllFilters} // Pass the clear function
                isSearchActive={searchQuery.trim().length > 0} // Pass search active state
              />
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
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? `No products match "${searchQuery}". Try different keywords or adjust your filters.`
                      : "Try adjusting your filters or search criteria"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      onClick={clearAllFilters} // Use the clearAllFilters function from ProductPage
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

      {/* Custom SweetAlert2 Styles */}
      <style jsx global>{`
        .swal2-toast-custom {
          background: #10b981 !important;
          color: white !important;
        }

        .swal2-toast-title {
          color: white !important;
          font-weight: 600 !important;
        }

        .swal2-toast-icon {
          border-color: white !important;
          color: white !important;
        }

        .swal2-timer-progress-bar {
          background: rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;
