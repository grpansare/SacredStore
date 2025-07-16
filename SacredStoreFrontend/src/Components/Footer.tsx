// src/components/Footer.jsx
import React from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div
              className="flex items-center space-x-3 mb-4 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🕉</span>
              </div>
              <h3 className="text-xl font-bold">Sacred Store</h3>
            </div>
            <p className="text-gray-400">
              Your trusted partner for authentic religious and spiritual
              products.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/products/all-products");
                  }}
                >
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Track Order
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers and updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Divine Store. All rights reserved. | Developed by
            Ganesh for Secbyte Technologies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;