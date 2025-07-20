// src/Components/DashboardOverview.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Users, Package, DollarSign } from 'lucide-react';
import StatCard from './StatCard'; // Import StatCard
import { Order, DashboardStats, Product } from '../types'; // Import types

interface DashboardOverviewProps {
  products: Product[]; // Pass products from AdminDashboard to get count
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ products }) => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
  });

  // Placeholder for API URLs
  const API_RECENT_ORDERS_URL = "http://localhost:8080/api/orders/recent";
  // You might have another endpoint for full dashboard stats,
  // or calculate them from fetched data.
  const API_DASHBOARD_STATS_URL = "http://localhost:8080/api/dashboard/stats"; // Example

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get<Order[]>(API_RECENT_ORDERS_URL);
      setRecentOrders(response.data);
      // Recalculate stats based on actual data if needed, or fetch from dedicated endpoint
      const totalOrders = response.data.length;
      const totalRevenue = response.data.reduce((acc, order) => acc + order.amount, 0);

      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalOrders: totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      }));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      // Fallback data for demonstration
      setRecentOrders([
        { id: "ORD-001", customer: "Sarah Johnson", product: "Holy Bible - King James Version", amount: 29.99, status: "Delivered", date: "2024-07-02" },
        { id: "ORD-002", customer: "Michael Chen", product: "Prayer Beads Set", amount: 15.50, status: "Shipped", date: "2024-07-01" },
        { id: "ORD-003", customer: "Maria Rodriguez", product: "Cross Pendant Necklace", amount: 45.00, status: "Processing", date: "2024-06-30" },
        { id: "ORD-004", customer: "David Wilson", product: "Meditation Cushion", amount: 35.75, status: "Pending", date: "2024-06-29" },
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
      // In a real app, this might be a single API call to get all stats
      // const response = await axios.get<DashboardStats>(API_DASHBOARD_STATS_URL);
      // setDashboardStats(response.data);
      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalRevenue: prevStats.totalRevenue || 45680, // Use fetched if available, else fallback
        totalOrders: prevStats.totalOrders || 1234, // Use fetched if available, else fallback
        totalCustomers: 2890,
        monthlyGrowth: 12.5,
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Fallback data if API fails
      setDashboardStats((prevStats) => ({
        ...prevStats,
        totalRevenue: prevStats.totalRevenue || 45680,
        totalOrders: prevStats.totalOrders || 1234,
        totalCustomers: 2890,
        monthlyGrowth: 12.5,
      }));
    }
  };

  useEffect(() => {
    fetchRecentOrders();
    fetchDashboardStats();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Update totalProducts when the products prop changes
    setDashboardStats((prevStats) => ({
      ...prevStats,
      totalProducts: products.length,
    }));
  }, [products]);

  return (
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;