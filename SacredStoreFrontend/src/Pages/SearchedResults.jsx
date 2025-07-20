import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom"; // Import Link for product details
import { ShoppingBag, XCircle } from "lucide-react"; // Icons for "No Products" and "Error"
import CircularProgress from "@mui/material/CircularProgress"; // MUI spinner
import Alert from "@mui/material/Alert"; // MUI Alert for messages
import Typography from "@mui/material/Typography"; // MUI Alert for messages
import { motion } from "framer-motion"; // For subtle animations
import axios from "axios"; // For making API requests
import { useSelector } from "react-redux";
import { useCart } from "../context/CartContext"; // Assuming you have a CartContext for managing cart state
import ProductModal from "../Components/ProductModal";

const SearchResultsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { user } = useSelector((state) => state.user);

  const handleModalOpen = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Extract the search query from the URL
  const searchQuery = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setProducts([]);
        setLoading(false);
        setError("Please enter a search query.");
        return;
      }

      setLoading(true);
      setError(null); // Clear any previous errors
      setProducts([]); // Clear previous products

      try {
        // IMPORTANT: Replace with your actual backend search endpoint
        // This endpoint should take a 'q' or 'query' parameter and return matching products
        const response = await axios(
          `https://sacredstore.onrender.com/api/products/search?q=${encodeURIComponent(
            searchQuery
          )}`
        );

        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(`Failed to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]); // Re-run effect whenever the searchQuery changes in the URL

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 pb-4">
        Search Results for: "
        <span className="text-orange-600">{searchQuery || "..."}</span>"
      </h2>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress sx={{ color: "#f97316" }} size={60} />
          <Typography variant="h6" className="ml-4 text-gray-700">
            Loading products...
          </Typography>
        </div>
      )}

      {error && (
        <Alert
          severity="error"
          icon={<XCircle className="w-5 h-5" />}
          className="my-4"
        >
          {error} Please try again.
        </Alert>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
          <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-semibold mb-2">
            No products found matching your search.
          </p>
          <p className="text-md">
            Try adjusting your keywords or browse our{" "}
            <Link
              to="/products/all-products"
              className="text-orange-600 hover:underline"
            >
              all products
            </Link>
            .
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              variants={itemVariants}
              onClick={() => handleModalOpen(product)}
            >
              {/* Assuming product has an imageUrl property */}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover object-center transform transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-orange-600 font-bold text-xl">
                    ₹{product.price ? product.price.toFixed(2) : "N/A"}
                  </p>
                  {/* Add to Cart button - you'll likely integrate useCart here */}
                  {/* <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600 transition-colors">
                    Add to Cart
                  </button> */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SearchResultsPage;

