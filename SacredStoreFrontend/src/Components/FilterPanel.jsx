// src/components/FilterPanel.jsx
import React from "react";
import { Star, X } from "lucide-react";

const FilterPanel = ({
  showFilters,
  setShowFilters,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  products, // We pass products to determine the initial price range for "Clear All"
  clearAllFilters, // New prop for a centralized clear function
  isSearchActive, // New prop to determine if Relevance option should show
}) => {
  // This `clearFilters` function is specific to the FilterPanel's internal state management
  // It resets the local filter states, and then calls the parent's `clearAllFilters`
  const handleClearFilters = () => {
    setSearchQuery(""); // Clear search query
    setSelectedRating(0); // Clear selected rating
    setSortBy("default"); // Reset sort by
    // Reset price range based on current products (passed from parent)
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([0, 3000]); // Fallback default
    }
    // Optionally call the parent's clearAllFilters if it does more than just reset states
    // clearAllFilters(); // If the parent's clearAllFilters does more, call it here
  };

  return (
    <div
      className={`${
        showFilters ? "block" : "hidden"
      } lg:block bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleClearFilters} // Use the local handler
          className="text-sm text-orange-600 hover:text-orange-800 font-medium"
        >
          Clear All
        </button>
        {/* Close button for mobile filters */}
        {showFilters && (
          <button
            onClick={() => setShowFilters(false)}
            className="lg:hidden p-1 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Bar within Filters (optional, if you want it duplicated) */}
      {/* If you want a search bar here, copy the relevant JSX from ProductPage */}
      {/* For now, assuming the main search bar stays outside the panel in ProductPage */}

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          $
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
              }
              className="w-20 px-2 py-1 border rounded text-sm"
              placeholder="Min"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value) || 3000])
              }
              className="w-20 px-2 py-1 border rounded text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Minimum Rating
        </h4>
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

      {/* You can also put the Sort By dropdown here if you prefer it inside the filter panel */}
      {/* For now, keeping it in ProductPage as it's a separate control */}
    </div>
  );
};

export default FilterPanel;
