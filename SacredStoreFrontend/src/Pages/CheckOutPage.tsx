// src/CheckoutPage.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import OrderSuccessPage from "./OrderConfirmation";

// --- Define types for your data structures ---
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserState {
  user: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    accessToken?: string;
    shippingInfo?: ShippingAddress;
  } | null;
}

// Razorpay Public Key ID - REMEMBER TO REPLACE THIS WITH YOUR ACTUAL KEY!
const RAZORPAY_KEY_ID = "rzp_test_5wU1xQg8xAioM6"; // <--- REPLACE WITH YOUR ACTUAL RAZORPAY TEST KEY ID

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useSelector(
    (state: { user: UserState["user"] }) => state.user
  );
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
    if (!user || !user.id) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [cart, user, navigate, orderPlaced]);

  useEffect(() => {
    if (user) {
      if (user.shippingInfo) {
        setShippingAddress(user.shippingInfo);
      }
      if (!user.shippingInfo && user.name) {
        setShippingAddress((prev) => ({ ...prev, fullName: user.name || "" }));
      }
    }
  }, [user]);

  const handleShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const validateOrderForm = (): boolean => {
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions.");
      return false;
    }
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      setError("Please fill in all required shipping address fields.");
      return false;
    }
    if (cart.length === 0) {
      setError("Your cart is empty. Please add items to proceed.");
      return false;
    }
    if (!user || !user.id) {
      setError("You must be logged in to place an order.");
      return false;
    }
    setError(null);
    return true;
  };

  // --- Function to handle Razorpay payment flow ---
  const handleRazorpayPayment = async () => {
    setIsLoading(true);
    setError(null);

    const amountInPaise = Math.round(cartTotal * 100);

    try {
      // 1. Create an order on your Spring Boot backend for Razorpay
      // This step generates a Razorpay Order ID on your backend and returns it.
      const orderCreationResponse = await axios.post(
        "http://localhost:8080/api/razorpay/create-order",
        {
          amount: amountInPaise,
          currency: "INR",
          receiptId: `receipt_${user?.id}_${Date.now()}`,
        },
        {
          headers: {
            Authorization: user?.accessToken
              ? `Bearer ${user.accessToken}`
              : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderCreationResponse.data.success) {
        throw new Error(
          orderCreationResponse.data.message ||
            "Failed to create Razorpay order."
        );
      }

      const { orderId, amount, currency } = orderCreationResponse.data;

      // 2. Configure Razorpay Checkout options
      const options = {
        key: RAZORPAY_KEY_ID, // Your Razorpay Test Key ID (public key)
        amount: amount,
        currency: currency,
        name: "Sacred Store",
        description: "Payment for your order",
        order_id: orderId, // Order ID received from backend
        handler: async function (response: any) {
          console.log("Razorpay Payment Success Response:", response);

          try {
            // 3. Verify payment on your backend
            const verificationResponse = await axios.post(
              "http://localhost:8080/api/razorpay/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: user?.accessToken
                    ? `Bearer ${user.accessToken}`
                    : "",
                  "Content-Type": "application/json",
                },
              }
            );

            if (verificationResponse.data.success) {
              // --- Crucial Step: Send the complete order details to your backend AFTER successful payment verification ---
              const finalOrderPayload = {
                userId: user?.id,
                items: cart.map((item) => ({
                  productId: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  imageUrl: item.imageUrl,
                  category: item.category,
                })),
                totalAmount: cartTotal,
                shippingAddress,
                paymentMethod: "RAZORPAY",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderDate: new Date().toISOString(),
                status: "PAID",
              };

              console.log(
                "Submitting final Razorpay order to backend:",
                finalOrderPayload
              );

              const placeOrderResponse = await axios.post(
                "http://localhost:8080/api/orders/place-razorpay-order",
                finalOrderPayload,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: user?.accessToken
                      ? `Bearer ${user.accessToken}`
                      : "",
                  },
                }
              );

              console.log("Place Order Response:", placeOrderResponse.data);

              if (placeOrderResponse.status === 201) {
                // Store the complete order details for display
                const completeOrderData = {
                  // Use the order ID from backend response
                  orderId:
                    placeOrderResponse.data.orderId ||
                    placeOrderResponse.data.id,
                  // Include all the data we sent
                  ...finalOrderPayload,
                  // Add any additional data from the backend response
                  ...placeOrderResponse.data,
                };

                setOrderDetails(completeOrderData);
                setOrderPlaced(true);
                setShowOrderSuccess(true); // Show the order success page
                clearCart();

                // Optional: Show a brief success message
                alert("Payment Successful and Order Placed!");
              } else {
                // If order placement fails AFTER payment, handle accordingly
                alert(
                  "Payment successful but failed to place order. Please contact support."
                );
                setError(
                  placeOrderResponse.data.message ||
                    "Failed to finalize order on backend."
                );
              }
            } else {
              alert(
                "Payment Verification Failed! " +
                  verificationResponse.data.message
              );
              setError(
                verificationResponse.data.message ||
                  "Payment verification failed."
              );
            }
          } catch (error: any) {
            console.error(
              "Error during payment verification or order placement:",
              error
            );
            alert(
              "Payment verification or order placement failed due to an internal error. Please contact support."
            );
            setError(
              error.response?.data?.message ||
                error.message ||
                "An unexpected error occurred during order finalization."
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#528FF0",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed by user.");
            setIsLoading(false);
          },
        },
      };

      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("Razorpay Payment Failed:", response.error);
        alert(
          `Payment Failed: ${
            response.error.description || "An unexpected error occurred."
          }`
        );
        setError(
          `Payment Failed: ${response.error.description || "Please try again."}`
        );
        setIsLoading(false);
      });
    } catch (err: any) {
      console.error("Error initiating Razorpay payment:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while initiating payment. Please try again."
      );
      setIsLoading(false);
    }
  };

  // --- Function to handle Cash on Delivery (COD) or other direct order submission ---
  const handleCodOrder = async () => {
    setIsLoading(true);
    setError(null);

    const orderData = {
      userId: user?.id,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl, // Include if your backend needs it
        category: item.category, // Include if your backend needs it
      })),
      totalAmount: cartTotal,
      shippingAddress,
      paymentMethod: "COD", // Explicitly set payment method
      orderDate: new Date().toISOString(),
      status: "PENDING_CONFIRMATION", // Or 'PLACED' for COD
    };

    console.log("Submitting COD order:", orderData);

    try {
      // Your existing COD order placement API call
      const response = await axios.post(
        "http://localhost:8080/api/orders/place-cod-order",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.accessToken
              ? `Bearer ${user.accessToken}`
              : "",
          },
        }
      );

      const completeOrderData = {
        // Use the order ID from backend response
        orderId: response.data.orderId || response.data.id,
        // Include all the data we sent
        ...orderData,
        // Add any additional data from the backend response
        ...response.data,
      };

      setOrderDetails(completeOrderData);

      setShowOrderSuccess(true); // Show the order success page

      console.log("COD Order placed successfully:", response.data);
      setOrderPlaced(true);
      clearCart();
      // localStorage.setItem(
      //   "lastOrderDetails",
      //   JSON.stringify(response.data.orderDetails)
      // );
    } catch (err: any) {
      console.error("Error placing COD order:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while placing your COD order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleContinueShopping = () => {
    setShowOrderSuccess(false);
    setOrderDetails(null);
    // Navigate to shop/home page
    // navigate('/shop') or whatever your routing logic is
  };
  // --- Main form submission handler ---
  const handleSubmitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateOrderForm()) {
      return;
    }

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      await handleCodOrder();
    } else {
      setError("Selected payment method is not supported yet.");
      setIsLoading(false);
    }
  };

  if (showOrderSuccess && orderDetails) {
    return (
      <OrderSuccessPage
        orderData={orderDetails}
        onContinueShopping={handleContinueShopping}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order securely</p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Error:</span> {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Enhanced */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h3>
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{cartTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-green-600">Free</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <p className="text-lg font-bold text-gray-900">Total</p>
                  <p className="text-xl font-bold text-orange-600">
                    ₹{cartTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping and Payment Form - Enhanced */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Sh$pping Information Section */}
              <div className="p-8 border-b border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Shipping Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Please provide your delivery address
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="addressLine1"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Street address, building, apartment"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="addressLine2"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Address Line 2{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Apartment, suite, unit, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                        placeholder="ZIP Code"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Country"
                      required
                    />
                  </div>
                </form>
              </div>
              {/* Payment Method Section */}
              <div className="p-8 border-b border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Payment Method
                    </h3>
                    <p className="text-sm text-gray-600">
                      Choose your preferred payment option
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      paymentMethod === "razorpay"
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        id="razorpay"
                        name="paymentMethod"
                        type="radio"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="razorpay"
                        className="ml-3 flex items-center cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            Pay with Razorpay
                          </p>
                          <p className="text-xs text-gray-600">
                            Secure payment with cards, UPI, wallets & more
                          </p>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            VISA
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            UPI
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      paymentMethod === "cod"
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        id="cod"
                        name="paymentMethod"
                        type="radio"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="cod"
                        className="ml-3 flex items-center cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-xs text-gray-600">
                            Pay when your order arrives at your doorstep
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            FREE
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Terms and Submit Section */}
              <div className="p-8">
                <div className="flex items-start mb-6">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setAgreeToTerms(e.target.checked)
                      }
                      className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-orange-600 hover:text-orange-700 font-medium underline"
                      >
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-orange-600 hover:text-orange-700 font-medium underline"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmitOrder}
                  className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                  disabled={isLoading || cartTotal === 0}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Place Order - ₹{cartTotal.toFixed(2)}
                    </div>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center space-x-8 text-gray-400">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Verified Payments</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
