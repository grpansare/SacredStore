// src/context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CartContext = createContext();

// --- Local Storage Key ---
const LOCAL_STORAGE_CART_KEY = "divineStoreCart";
const LOCAL_STORAGE_MERGE_FLAG_KEY = "divineStoreCartMergeDone";

// --- Initial Cart State from Local Storage ---
const getInitialCartState = () => {
  try {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from local storage:", error);
    return [];
  }
};

const getInitialMergeFlag = () => {
  try {
    const savedFlag = localStorage.getItem(LOCAL_STORAGE_MERGE_FLAG_KEY);
    return savedFlag === "true";
  } catch (error) {
    console.error("Failed to parse merge flag from local storage:", error);
    return false;
  }
};

// --- Cart Reducer ---
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const { payload: productToAdd, quantity } = action;

      console.log("Adding to cart:", productToAdd, "Quantity:", quantity);
      const existingItem = state.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        alert("item exists");
        return state.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...state, { ...productToAdd, quantity }];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);

    case "UPDATE_QUANTITY":
      const updatedState = state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      );
      return updatedState.filter((item) => item.quantity > 0);

    case "CLEAR_CART":
      return [];

    case "SET_CART":
      return action.payload;

    default:
      return state;
  }
};

// --- Cart Merging Logic ---
// Fixed: Only merge if local cart has items that were added while logged out
const mergeCarts = (localCart, backendCart) => {
  const mergedMap = new Map();

  // Start with backend items as baseline
  backendCart.forEach((item) => mergedMap.set(item.id, { ...item }));

  // Only add local items that don't exist in backend
  // This prevents double-counting items that were already synced
  localCart.forEach((localItem) => {
    if (!mergedMap.has(localItem.id)) {
      // Only add items that are truly local-only
      mergedMap.set(localItem.id, { ...localItem });
    }
  });

  return Array.from(mergedMap.values());
};

// --- Cart Provider Component ---
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCartState);
  const { user } = useSelector((state) => state.user);
  const [initialMergeDone, setInitialMergeDone] = useState(getInitialMergeFlag);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Effect to save cart to local storage (only when user is logged out) ---
  useEffect(() => {
    // Only save to localStorage when user is not logged in
    if (!user || !user.accessToken) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to local storage:", error);
      }
    }
  }, [cart, user]);

  // --- Effect to persist the merge flag ---
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_MERGE_FLAG_KEY,
        String(initialMergeDone)
      );
    } catch (error) {
      console.error("Failed to save merge flag to local storage:", error);
    }
  }, [initialMergeDone]);

  // --- Effect to load and merge cart from backend on user login ---
  useEffect(() => {
    const loadAndSyncCart = async () => {
      if (user && user.accessToken) {
        // User just logged in
        if (!isLoggedIn) {
          setIsLoggedIn(true);

          if (!initialMergeDone) {
            console.log(
              "User logged in for the first time. Performing cart merge..."
            );
            try {
              // 1. Fetch backend cart
              const res = await axios.get("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${user.accessToken}` },
              });
              const backendCartItems = res.data.items.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
                category: item.product.category,
                quantity: item.quantity,
              }));

              // 2. Get local cart (anonymous additions)
              const localCartBeforeMerge = getInitialCartState();

              // 3. Merge carts (only add local items not in backend)
              const mergedCart = mergeCarts(
                localCartBeforeMerge,
                backendCartItems
              );

              // 4. Sync merged cart to backend
              await axios.delete("http://localhost:8080/api/cart/clear", {
                headers: { Authorization: `Bearer ${user.accessToken}` },
              });

              for (const item of mergedCart) {
                await axios.post(
                  "http://localhost:8080/api/cart/add",
                  { productId: item.id, quantity: item.quantity },
                  { headers: { Authorization: `Bearer ${user.accessToken}` } }
                );
              }

              console.log("Cart merged and synchronized with backend.");

              // 5. Update local state
              dispatch({ type: "SET_CART", payload: mergedCart });

              // 6. Mark merge as done and clear local storage
              setInitialMergeDone(true);
              localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
            } catch (error) {
              console.error(
                "Failed to load/merge/sync cart with backend:",
                error
              );
              setInitialMergeDone(false);
            }
          } else {
            // Merge already done, just load backend cart
            try {
              const res = await axios.get("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${user.accessToken}` },
              });
              const backendCartItems = res.data.items.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
                category: item.product.category,
                quantity: item.quantity,
              }));
              dispatch({ type: "SET_CART", payload: backendCartItems });
              console.log("Logged-in user: Cart loaded from backend.");
            } catch (error) {
              console.error("Failed to load cart from backend:", error);
            }
          }
        }
      } else if (!user) {
        // User logged out
        setIsLoggedIn(false);
        setInitialMergeDone(false);

        // Load cart from local storage
        const localCart = getInitialCartState();
        dispatch({ type: "SET_CART", payload: localCart });
        console.log("User logged out: Cart loaded from local storage.");
      }
    };

    loadAndSyncCart();
  }, [user, initialMergeDone, isLoggedIn]);

  // --- Cart Actions ---
  const addToCart = useCallback(
    async (product, quantity = 1) => {
      dispatch({ type: "ADD_TO_CART", payload: product, quantity });

      if (user && user.accessToken) {
        try {
          await axios.post(
            "http://localhost:8080/api/cart/add",
            { productId: product.id, quantity: quantity },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          );
        } catch (error) {
          console.error("Failed to sync add to cart with backend:", error);
        }
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      dispatch({ type: "REMOVE_FROM_CART", payload: productId });

      if (user && user.accessToken) {
        try {
          await axios.delete(
            `http://localhost:8080/api/cart/remove/${productId}`,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          );
        } catch (error) {
          console.error("Failed to remove item from backend cart:", error);
        }
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity },
      });

      if (user && user.accessToken) {
        try {
          await axios.put(
            "http://localhost:8080/api/cart/update",
            { productId, quantity },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          );
        } catch (error) {
          console.error("Failed to update cart on backend:", error);
        }
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    dispatch({ type: "CLEAR_CART" });

    if (user && user.accessToken) {
      try {
        await axios.delete("http://localhost:8080/api/cart/clear", {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
      } catch (error) {
        console.error("Failed to clear cart on backend:", error);
      }
    }
  }, [user]);

  // --- Derived State ---
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // --- Context Value ---
  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// --- Custom Hook to Use Cart Context ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
