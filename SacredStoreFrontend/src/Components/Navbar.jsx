import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import React, { useState } from 'react'
import AuthModal from './AuthModal';

const Navbar = ({setSelectedCategory, cartItems }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
      const handleModelOpen = () => {
        isModalOpen(true);

        };
      const handleModalClose = () => {
        isModalOpen(false);
      };

  return (
    <div>
           <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={() => setSelectedCategory(null)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🕉</span>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-red-800">
                          Divine Store
                        </h1>
                        <p className="text-xs text-gray-600">Sacred & Spiritual</p>
                      </div>
                    </div>
        
                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                      <div className="w-full relative">
                        <input
                          type="text"
                          placeholder="Search for religious items, books, idols..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
        
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                      <a
                        href="#"
                        className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(null);
                        }}
                      >
                        Home
                      </a>
                      <a
                        href="#"
                        className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("All Products");
                        }}
                      >
                        Products
                      </a>{" "}
                      {/* Link to generic product list */}
                      <a
                        href="#"
                        className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                      >
                        About
                      </a>
                      <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors">
                          <ShoppingCart className="w-6 h-6" />
                          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {cartItems.reduce(
                              (total, item) => total + item.quantity,
                              0
                            )}
                          </span>
                        </button>
                        <button onClick={() => setIsAuthModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Login
                        </button>
                      </div>
                    </div>
        
                    {/* Mobile Menu Button */}
                    <button
                      className="md:hidden p-2"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      {isMenuOpen ? (
                        <X className="w-6 h-6" />
                      ) : (
                        <Menu className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
        
                {/* Mobile Menu */}
                {isMenuOpen && (
                  <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-3 space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                      <a
                        href="#"
                        className="block py-2 text-gray-700 hover:text-orange-500"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(null);
                          setIsMenuOpen(false);
                        }}
                      >
                        Home
                      </a>
                      <a
                        href="#"
                        className="block py-2 text-gray-700 hover:text-orange-500"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory("All Products");
                          setIsMenuOpen(false);
                        }}
                      >
                        Products
                      </a>
                      <a
                        href="#"
                        className="block py-2 text-gray-700 hover:text-orange-500"
                      >
                        About
                      </a>
                      <button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium">
                        Login
                      </button>
                    </div>
                  </div>
                )}
              </nav>

              <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}

export default Navbar