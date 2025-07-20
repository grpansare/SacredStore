
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Search, Filter } from 'lucide-react';
import ProductGrid from './ProductsGrid'; // Make sure this is ProductGrid.tsx
import { ProductForm } from './ProductForm'; // Make sure this is ProductForm.tsx
import { Product } from '../types'; // Import Product interface

const API_BASE_URL = "http://localhost:8080/api/products";

interface ProductManagementProps {
  onProductsFetched: (products: Product[]) => void; // Callback to update parent with product count
}

const ProductManagement: React.FC<ProductManagementProps> = ({ onProductsFetched }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("All Categories");
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    "Books", "Accessories", "Jewelry", "Idols & Statues",
    "Prayer Items", "Decor", "Music", "Gifts",
  ];

  const fetchProducts = useCallback(async () => {
    try {
      const params: { name?: string; category?: string } = {};
      if (searchTerm) {
        params.name = searchTerm;
      }
      if (filterCategory && filterCategory !== "All Categories") {
        params.category = filterCategory;
      }
      const response = await axios.get<Product[]>(API_BASE_URL, { params });
      setProducts(response.data);
      onProductsFetched(response.data); // Notify parent of fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [searchTerm, filterCategory, onProductsFetched]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (productData: Product) => {
    try {
      Swal.fire({
        title: "Saving Product...",
        text: "Please wait while we save your product",
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); },
      });

      const dataToSave: Product = {
        ...productData,
        price: parseFloat(productData.price.toString()),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice.toString()) : null,
        stock: parseInt(productData.stock.toString(), 10),
        rating: parseFloat(productData.rating.toString()),
      };

      if (dataToSave.id) {
        await axios.put(`${API_BASE_URL}/${dataToSave.id}`, dataToSave);
        Swal.fire({ icon: "success", title: "Product Updated!", text: "Your product has been successfully updated.", timer: 2000, showConfirmButton: false });
      } else {
        await axios.post(API_BASE_URL, dataToSave);
        Swal.fire({ icon: "success", title: "Product Added!", text: "Your new product has been successfully added.", timer: 2000, showConfirmButton: false });
      }

      setShowAddProduct(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || error.response.statusText;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Swal.fire({ icon: "error", title: "Save Failed", text: errorMessage, confirmButtonText: "Try Again", confirmButtonColor: "#ef4444" });
    }
  };

  const handleSaveProductWithConfirmation = async (productData: Product) => {
    const isUpdate = !!productData.id;
    const result = await Swal.fire({
      title: isUpdate ? "Update Product?" : "Add New Product?",
      text: isUpdate ? "Are you sure you want to update this product?" : "Are you sure you want to add this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isUpdate ? "Yes, Update" : "Yes, Add",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await handleSaveProduct(productData);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/${productId}`);
        fetchProducts();
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Product deleted successfully", showConfirmButton: false, timer: 2000, timerProgressBar: true });
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to delete product", showConfirmButton: false, timer: 2000, timerProgressBar: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowAddProduct(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border rounded-md"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProductGrid
          products={products}
          setSelectedProduct={setSelectedProduct}
          setShowAddProduct={setShowAddProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      </div>

      {showAddProduct && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setShowAddProduct(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProductWithConfirmation}
        />
      )}
    </div>
  );
};

export default ProductManagement;