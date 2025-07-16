// src/Components/layout/PublicLayout.jsx
// Create this file inside a new 'layout' folder within your 'Components' directory
import React from "react";
import Navbar from "../Components/Navbar"; // Adjust path if necessary
import Footer from "../Components/Footer"; // Adjust path if necessary
import { CartProvider } from "../context/CartContext"; // Adjust path if necessary
import { Outlet } from "react-router-dom";

interface PublicLayoutProps {
  children: React.ReactNode;
  cartItems: any[]; // Pass cartItems down from App.jsx
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, cartItems }) => {
  return (
    <>
      <Navbar cartItems={cartItems} />
      <main className="min-h-screen">
        {" "}
        {/* Add min-h-screen for sticky footer */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
