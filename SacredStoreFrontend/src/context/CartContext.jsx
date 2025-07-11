import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const CartContext = createContext();

const getInitialCartState = () => {
  try {
    const savedCart = localStorage.getItem("divineStoreCart"); // Use a specific key
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from local storage:", error);
    return []; // Return empty array if parsing fails
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Ensure the product being added has a quantity property, even if it's 1
      return [...state, { ...action.payload, quantity: 1 }];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);

    case "UPDATE_QUANTITY":
      // Ensure quantity doesn't drop below 0 (or remove if 0)
      const updatedState = state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) } // Ensure quantity is not negative
          : item
      );
      // Filter out items with quantity 0 or less
      return updatedState.filter((item) => item.quantity > 0);

    case "CLEAR_CART":
      return [];

    // The LOAD_CART action becomes redundant if you use the lazy initializer,
    // but we can keep it if you foresee a need to programmatically load/reset the cart later.
    // However, for initial load on refresh, the lazy initializer is key.
    case "LOAD_CART": // You can keep this for manual loading if needed later, but it won't be used for initial refresh load
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCartState);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      localStorage.setItem("divineStoreCart", JSON.stringify(cart)); // Use a consistent key
    } catch (error) {
      console.error("Failed to save cart to local storage:", error);
    }
  }, [cart]);

  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (user && user.id) {
        try {
          const res = await axios.get(
            `http://localhost:8080/api/cart/${user.id}`
          );
          const backendCartItems = res.data.items.map((item) => ({
            ...item.product,
            quantity: item.quantity,
          }));
          dispatch({ type: "LOAD_CART", payload: backendCartItems });
        } catch (error) {
          console.error("Failed to load cart from backend:", error);
        }
      }
    };

    loadCartFromBackend();
  }, [user]);

  const addToCart = async (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });

    if (user && user.accessToken) {
      try {
        await axios.post(
          "http://localhost:8080/api/cart/add",
          { productId: product.id, quantity: 1 },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    // The reducer now handles quantities <= 0 by filtering them out.
    // No need for the if (quantity <= 0) block here.
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
