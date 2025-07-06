import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import { useCart } from "../context/CartContext";

// MUI Components
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";

// Lucide React Icons
import { Menu as MenuIcon, Search, ShoppingCart, User, X, LogOut, Settings, ListOrdered } from "lucide-react";

// SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Assuming AuthModal is a separate component
import AuthModal from "./AuthModal";

const MySwal = withReactContent(Swal);

const Navbar = ({ setSelectedCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { cartItemsCount } = useCart();

  // Handlers for MUI Profile Menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose(); // Close the menu immediately

    // Show a confirmation dialog with SweetAlert2
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316', // orange-500
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: 'Yes, log me out!',
      reverseButtons: true, // Puts confirm button on the right
      customClass: {
        container: 'sweetalert-container', // Custom class for global styling if needed
        popup: 'sweetalert-popup',
        confirmButton: 'sweetalert-confirm-button',
        cancelButton: 'sweetalert-cancel-button'
      }
    });

    if (result.isConfirmed) {
      dispatch(logout()); // Dispatch the logout action
      MySwal.fire({
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        timer: 2000, // Close after 2 seconds
        showConfirmButton: false,
        customClass: {
          container: 'sweetalert-container',
          popup: 'sweetalert-popup',
        }
      });
      // Optionally navigate to home or login page after logout
      // navigate('/');
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleMyOrdersClick = () => {
    navigate("/my-orders");
    handleMenuClose();
  };

  return (
    <div>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setSelectedCategory && setSelectedCategory(null)}
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
            </Link>

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
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
                onClick={() => setSelectedCategory && setSelectedCategory(null)}
              >
                Home
              </Link>
              <Link
                to="/products/all-products"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                to="/aboutus"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                About
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    <Button
                      id="profile-button"
                      aria-controls={openMenu ? "profile-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      onClick={handleMenuClick}
                      variant="contained"
                      sx={{
                        backgroundColor: "#f97316", // orange-500
                        "&:hover": {
                          backgroundColor: "#ea580c", // orange-600
                        },
                        color: "white",
                        px: 2,
                        py: 1,
                        borderRadius: "8px",
                        fontWeight: "medium",
                        textTransform: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <User size={16} />
                      <Typography>{user?.fullname || "Profile"}</Typography>
                    </Button>
                    <Menu
                      id="profile-menu"
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        "aria-labelledby": "profile-button",
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={handleProfileClick}>
                        <ListItemIcon>
                          <User size={20} />
                        </ListItemIcon>
                        <Typography variant="inherit">My Profile</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleMyOrdersClick}>
                        <ListItemIcon>
                           <ListOrdered size={20} />
                        </ListItemIcon>
                        <Typography variant="inherit">My Orders</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}> {/* Modified to call handleLogout */}
                        <ListItemIcon>
                          <LogOut size={20} />
                        </ListItemIcon>
                        <Typography variant="inherit">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </button>
                )}
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
                <MenuIcon className="w-6 h-6" />
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
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-orange-500"
                onClick={() => {
                  setSelectedCategory && setSelectedCategory(null);
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>
              <Link
                to="/products/all-products"
                className="block py-2 text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/aboutus"
                className="block py-2 text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/cart"
                className="block py-2 text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart ({cartItemsCount})
              </Link>
              {isAuthenticated ? (
                 <Button
                    onClick={handleLogout} // Modified to call handleLogout
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#f97316",
                      "&:hover": { backgroundColor: "#ea580c" },
                      color: "white",
                      py: 1,
                      borderRadius: "8px",
                      fontWeight: "medium",
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;