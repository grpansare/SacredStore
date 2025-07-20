import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Star,
  Cross,
} from "lucide-react";

import { logout } from "../store/userSlice";
import Swal from "sweetalert2";

import { ProductForm } from "../Components/ProductForm";
import ProductGrid from "../Components/ProductsGrid";
import { useDispatch, useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:8080/api/products";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [recentOrders, setRecentOrders] = useState([]);
  // const {logout}=useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
  });

  const categories = [
    "Books",
    "Accessories",
    "Jewelry",
    "Idols & Statues",
    "Prayer Items",
    "Decor",
    "Music",
    "Gifts",
  ];

  const fetchProducts = async () => {
    try {
      const params = {};
      if (searchTerm) {
        params.name = searchTerm;
      }
      if (filterCategory && filterCategory !== "All Categories") {
        params.category = filterCategory;
      }
      const response = await axios.get(API_BASE_URL, { params });
      setProducts(response.data);
      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalProducts: response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/orders/recent"
      );
      setRecentOrders(response.data);
      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalOrders: response.data.length,
        totalRevenue: response.data
          .reduce((acc, order) => acc + order.amount, 0)
          .toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      setRecentOrders([
        {
          id: "ORD-001",
          customer: "Sarah Johnson",
          product: "Holy Bible - King James Version",
          amount: 29.99,
          status: "Delivered",
          date: "2024-07-02",
        },
        {
          id: "ORD-002",
          customer: "Michael Chen",
          product: "Prayer Beads Set",
          amount: 15.5,
          status: "Shipped",
          date: "2024-07-01",
        },
        {
          id: "ORD-003",
          customer: "Maria Rodriguez",
          product: "Cross Pendant Necklace",
          amount: 45.0,
          status: "Processing",
          date: "2024-06-30",
        },
        {
          id: "ORD-004",
          customer: "David Wilson",
          product: "Meditation Cushion",
          amount: 35.75,
          status: "Pending",
          date: "2024-06-29",
        },
      ]);
      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalOrders: 4,
        totalRevenue: 125.24,
      }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setDashboardStats({
        totalRevenue: 45680,
        totalOrders: 1234,
        totalProducts: products.length,
        totalCustomers: 2890,
        monthlyGrowth: 12.5,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      // Show loading alert
      Swal.fire({
        title: "Saving Product...",
        text: "Please wait while we save your product",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Convert price and originalPrice to numbers if they are strings
      const dataToSave = {
        ...productData,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice
          ? parseFloat(productData.originalPrice)
          : null, // Handle optional originalPrice
        stock: parseInt(productData.stock, 10),
        rating: parseFloat(productData.rating),
      };

      if (dataToSave.id) {
        await axios.put(`${API_BASE_URL}/${dataToSave.id}`, dataToSave);
        console.log("Product updated successfully:", dataToSave);

        // Success alert for update
        Swal.fire({
          icon: "success",
          title: "Product Updated!",
          text: "Your product has been successfully updated.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post(API_BASE_URL, dataToSave);
        console.log("Product added successfully:", dataToSave);

        // Success alert for new product
        Swal.fire({
          icon: "success",
          title: "Product Added!",
          text: "Your new product has been successfully added.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setShowAddProduct(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);

      // More detailed error logging and SweetAlert error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);

        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: error.response.data.message || error.response.statusText,
          confirmButtonText: "Try Again",
          confirmButtonColor: "#ef4444",
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);

        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "No response from server. Please check your network connection.",
          confirmButtonText: "Retry",
          confirmButtonColor: "#ef4444",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);

        Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: `An unexpected error occurred: ${error.message}`,
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  // Optional: Add confirmation before saving (especially useful for updates)
  const handleSaveProductWithConfirmation = async (productData) => {
    const isUpdate = !!productData.id;

    const result = await Swal.fire({
      title: isUpdate ? "Update Product?" : "Add New Product?",
      text: isUpdate
        ? "Are you sure you want to update this product?"
        : "Are you sure you want to add this product?",
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

  const handleDeleteProduct = async (productId) => {
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
        console.log("Product deleted successfully:", productId);
        fetchProducts();

        // Toast notification
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Product deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Failed to delete product",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardStats();
      fetchRecentOrders();
      fetchProducts();
    } else if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab, searchTerm, filterCategory]);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />+{trend}% from last month
            </p>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={dashboardStats.monthlyGrowth}
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Products"
          value={dashboardStats.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Customers"
          value={dashboardStats.totalCustomers.toLocaleString()}
          icon={Users}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">₹{order.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
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
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Management</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <select className="px-4 py-2 border rounded-md">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">₹{order.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <select
                      defaultValue={order.status}
                      className={`px-2 py-1 rounded-full text-xs border-none ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                        }`}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Management</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            Customer Management
          </h3>
          <p className="text-gray-500">View and manage your customer base</p>
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will be redirected to the login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        dispatch(logout()); // Dispatch logout action to Redux store
        window.location.href = "/"; // Redirect to login page
      }
    });
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Cross className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Sacred Store</h1>
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                activeTab === item.id ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600' : 'text-gray-600'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={() => handleLogout()}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors
                `}
          >
            <Cross className="w-5 h-5" />
            <span className="text-red-600">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "customers" && renderCustomers()}
        </div>
      </div>

      {/* Product Form Modal */}
      {showAddProduct && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setShowAddProduct(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
