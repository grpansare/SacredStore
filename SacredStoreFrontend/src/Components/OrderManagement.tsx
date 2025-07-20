// src/Components/OrderManagement.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Eye, Edit } from 'lucide-react';
import { Order } from '../types'; // Import Order interface

const API_ORDERS_URL = "http://localhost:8080/api/orders"; // Assuming a general orders endpoint

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All Status');

  const fetchOrders = async () => {
    try {
      const params: { customer?: string; status?: string } = {}; // Adjust based on your API
      if (searchTerm) {
        params.customer = searchTerm; // Assuming search by customer name
      }
      if (filterStatus && filterStatus !== 'All Status') {
        params.status = filterStatus;
      }
      const response = await axios.get<Order[]>(API_ORDERS_URL, { params });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback data for demonstration if API fails
      setOrders([
        { id: "ORD-001", customer: "Sarah Johnson", product: "Holy Bible - King James Version", amount: 29.99, status: "Delivered", date: "2024-07-02" },
        { id: "ORD-002", customer: "Michael Chen", product: "Prayer Beads Set", amount: 15.50, status: "Shipped", date: "2024-07-01" },
        { id: "ORD-003", customer: "Maria Rodriguez", product: "Cross Pendant Necklace", amount: 45.00, status: "Processing", date: "2024-06-30" },
        { id: "ORD-004", customer: "David Wilson", product: "Meditation Cushion", amount: 35.75, status: "Pending", date: "2024-06-29" },
      ]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, filterStatus]); // Re-fetch when search term or filter status changes

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    // In a real application, you would make an API call here to update the order status
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Add Swal success/error notifications here for API calls
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Management</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by customer..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.product}</td>
                    <td className="p-3">₹{order.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <select
                        defaultValue={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
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
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="View Order">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Edit Order">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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

export default OrderManagement;