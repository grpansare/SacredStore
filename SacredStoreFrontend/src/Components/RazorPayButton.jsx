// src/components/RazorpayPaymentButton.jsx
import React from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";

const RazorpayPaymentButton = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useSelector((state) => state.user);

  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to proceed with payment.");
      return;
    }

    const amountInPaise = Math.round(cartTotal * 100); // Razorpay expects amount in paise

    try {
      // Step 1: Create an order on your Spring Boot backend
      const { data } = await axios.post(
        "https://sacredstore.onrender.com/api/razorpay/create-order",
        {
          // <--- UPDATED URL
          amount: amountInPaise,
          currency: "INR",
          receiptId: `order_receipt_${Date.now()}`,
        },
        {
          // You might need to send authorization headers if your Spring Boot backend is secured
          headers: {
            Authorization:
              user && user.accessToken ? `Bearer ${user.accessToken}` : "",
          },
        }
      );

      if (!data.success) {
        alert("Error creating Razorpay order: " + data.message);
        return;
      }

      // Step 2: Configure Razorpay Checkout options
      const options = {
        key: "rzp_test_YOUR_KEY_ID_HERE", // Your Razorpay Test Key ID (public key)
        amount: data.amount, // Amount received from backend
        currency: data.currency, // Currency received from backend
        name: "Sacred Store",
        description: "Payment for your order",
        order_id: data.orderId, // Order ID received from backend
        handler: async function (response) {
          // This function is called when the payment is successful
          console.log("Razorpay Response:", response);

          // Step 3: Send payment details to your Spring Boot backend for verification
          try {
            const verificationResponse = await axios.post(
              "https://sacredstore.onrender.com/api/razorpay/verify-payment",
              {
                // <--- UPDATED URL
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization:
                    user && user.accessToken
                      ? `Bearer ${user.accessToken}`
                      : "",
                },
              }
            );

            if (verificationResponse.data.success) {
              alert("Payment Successful! Order Confirmed.");
              clearCart(); // Clear cart after successful payment
              // Redirect to a success page or update UI
              // Example: navigate('/order-success');
            } else {
              alert(
                "Payment Verification Failed! " +
                  verificationResponse.data.message
              );
              // Handle payment verification failure
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            alert(
              "Payment verification failed due to an error. Please contact support."
            );
          }
        },
        prefill: {
          name: user ? user.name : "",
          email: user ? user.email : "",
          contact: user ? user.phone : "",
        },
        theme: {
          color: "#528FF0",
        },
      };

      // Ensure Razorpay script is loaded (it's in public/index.html)
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
        console.error("Payment Failed:", response.error);
        // Handle failed payment
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again later.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={cartTotal === 0}
      style={{
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1.1rem",
        marginTop: "20px",
      }}
    >
      Pay with Razorpay (Total: ₹{cartTotal.toFixed(2)})
    </button>
  );
};

export default RazorpayPaymentButton;
