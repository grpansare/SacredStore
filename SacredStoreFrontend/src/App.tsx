// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PublicLayout from './Pages/Layout';
import Homepage from './Pages/Homepage';
import ProductPage from './Pages/ProductsPage';
import CartPage from './Pages/CartPage';
import AdminDashboard from './Pages/AdminDashboard';
import AboutUs from './Pages/AboutUs';
  import ProfilePage from './Pages/ProfilePage';
import CheckoutPage from './Pages/CheckOutPage';
import ReligiousOrdersPage from './Pages/MyOrders';
import SearchResultsPage from './Pages/SearchedResults';


const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + (productToAdd.quantity || 1) }
            : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: productToAdd.quantity || 1 }];
      }
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout cartItems={cartItems} />}>
          <Route index element={<Homepage handleAddToCart={handleAddToCart} />} />
          <Route path="products/:categoryName" element={<ProductPage handleAddToCart={handleAddToCart} />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="my-orders" element={<ReligiousOrdersPage />} />
            <Route path="/products/search" element={<SearchResultsPage />} />
          {/* <Route path="order-confirmation" element={<OrderSuccessPagege />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;