// src/Components/Sidebar.tsx
import React from 'react';
import { Cross, TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';
import { SidebarItem } from '../types'; // Import SidebarItem interface

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
  ];

  return (
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
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors`}
        >
          <Cross className="w-5 h-5 text-red-600" /> {/* Using Cross for logout icon, you might prefer LogOut */}
          <span className="text-red-600">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;