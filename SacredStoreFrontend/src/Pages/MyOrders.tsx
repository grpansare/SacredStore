import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  RotateCcw,
  Star,
  Package,
  Clock,
  CheckCircle,
  Heart,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const ReligiousOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useSelector((state) => state.user);

  // Sample orders data
  const [orders, setOrders] = useState([]);

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    return orders?.filter((order) => {
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      let matchesDate = true;
      if (dateFilter) {
        const orderDate = new Date(order.date);
        const now = new Date();
        const daysAgo = parseInt(dateFilter);
        const cutoffDate = new Date(
          now.getTime() - daysAgo * 24 * 60 * 60 * 1000
        );
        matchesDate = orderDate >= cutoffDate;
      }

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [orders, statusFilter, dateFilter, searchQuery]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const blessed = orders.filter((o) => o.status === "blessed").length;
    return { total, delivered, processing, blessed };
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "blessed":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "blessed":
        return <Heart className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        Please log in to view your orders.
      </div>
    );
  }
  useEffect(() => {
    getOrder();
  }, [user]);

  const getOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/orders/getOrders/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log(typeof response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 bg-gradient-to-r from-amber-800 to-orange-700 text-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-3">🕯️ Your Sacred Orders</h1>
          <p className="text-xl opacity-90 italic">
            May your journey be blessed with peace and divine guidance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-amber-600 hover:shadow-xl transition-shadow">
            <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Total Orders
            </h3>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {summary.total}
            </div>
            <div className="text-gray-600 text-sm">All time purchases</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-600 hover:shadow-xl transition-shadow">
            <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Delivered
            </h3>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {summary.delivered}
            </div>
            <div className="text-gray-600 text-sm">Blessed and received</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-600 hover:shadow-xl transition-shadow">
            <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Processing
            </h3>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {summary.processing}
            </div>
            <div className="text-gray-600 text-sm">Being prepared</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
            <h3 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Blessed
            </h3>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {summary.blessed}
            </div>
            <div className="text-gray-600 text-sm">Spiritually consecrated</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-amber-800 font-semibold mb-2">
                Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-amber-600 focus:outline-none transition-colors"
              >
                <option value="">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="processing">Processing</option>
                <option value="blessed">Blessed</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-amber-800 font-semibold mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-amber-600 focus:outline-none transition-colors"
              >
                <option value="">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
                <option value="365">Last Year</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-amber-800 font-semibold mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Order number or item name..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🕊️</div>
              <h3 className="text-2xl font-bold text-amber-800 mb-4">
                No Orders Found
              </h3>
              <p className="text-gray-600 mb-6">
                Your spiritual journey awaits. Browse our collection of blessed
                items.
              </p>
              <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="text-2xl font-bold text-amber-800">
                    #{order.id}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-amber-800 font-semibold mb-1">
                      Order Date
                    </div>
                    <div className="text-green-700 text-lg">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-800 font-semibold mb-1">
                      Total Amount
                    </div>
                    <div className="text-green-700 text-lg font-bold">
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <div className="text-amber-800 font-semibold mb-1">
                      Delivery Date
                    </div>
                    <div className="text-green-700 text-lg">
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString()
                        : "Pending"}
                    </div>
                  </div> */}
                </div>

                {/* Order Items */}
                <div className="bg-amber-50 p-6 rounded-xl mb-6">
                  <h4 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Items in this order
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm gap-4"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-green-700 mb-1">
                            {item.name}
                          </div>
                          <div className="text-gray-600 text-sm italic">
                            {item.description}
                          </div>
                        </div>
                        <div className="text-amber-800 font-semibold">
                          ×{item.quantity}
                        </div>
                        <div className="text-green-700 font-bold text-lg">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                  <button className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reorder Items
                  </button>
                  <button className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-colors flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Leave Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReligiousOrdersPage;
