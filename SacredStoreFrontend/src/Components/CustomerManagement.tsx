
import React from 'react';
import { Users } from 'lucide-react';

const CustomerManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Management</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            Customer Management
          </h3>
          <p className="text-gray-500">View and manage your customer base.</p>
          <p className="text-gray-400 text-sm mt-2">
            (Feature coming soon!)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;