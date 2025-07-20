package com.ecomm.app.controllers;


import com.ecomm.app.dtos.OrderRequest;

import com.ecomm.app.dtos.OrderResponse;
import com.ecomm.app.dtos.PaymentVerificationRequest;
import com.ecomm.app.services.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid; // For @Valid annotation
import com.razorpay.Order;

@RestController
@RequestMapping("/api/razorpay")

public class PaymentController {

 @Autowired
 private RazorpayService razorpayService;

 // Add this if you have a CartService and OrderService
 // @Autowired
 // private CartService cartService;
 // @Autowired
 // private OrderService orderService;


//In com.ecomm.app.controllers.PaymentController.java
//(or your RazorpayController.java)

 // Ensure this import is present

@PostMapping("/create-order")
public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) throws RazorpayException {
  try {
      Long amountInPaise = request.getAmount();

      Order order = razorpayService.createRazorpayOrder(
          amountInPaise, 
          request.getCurrency(),
          request.getReceiptId() != null ? request.getReceiptId() : "receipt_" + System.currentTimeMillis()
      );

      // --- THE FIX IS HERE ---
      // Get the amount from the Razorpay Order object, which might be an Integer
      Object amountFromRazorpayOrder = order.get("amount");
      Long finalAmountForResponse;

      if (amountFromRazorpayOrder instanceof Integer) {
          // If it's an Integer, explicitly convert it to Long
          finalAmountForResponse = ((Integer) amountFromRazorpayOrder).longValue();
      } else if (amountFromRazorpayOrder instanceof Long) {
          // If it's already a Long (ideal case), just cast it
          finalAmountForResponse = (Long) amountFromRazorpayOrder;
      } else {
          // Handle unexpected types, maybe log a warning or throw an error
          // For now, let's assume it's always a number type
          finalAmountForResponse = null; // Or handle appropriately
          System.err.println("Warning: Unexpected type for 'amount' from Razorpay Order: " + amountFromRazorpayOrder.getClass().getName());
      }


      // Line 46 will now be this:
      return ResponseEntity.ok(new OrderResponse(
          true,
          order.get("id"),
          finalAmountForResponse, // Use the converted Long value here
          order.get("currency"),
          "Order created successfully"
      ));

  } catch (Exception e) { // Catch other potential exceptions during conversion
      System.err.println("An unexpected error occurred in createOrder: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new OrderResponse(false, "An internal server error occurred."));
  }
}
 @PostMapping("/verify-payment")
 public ResponseEntity<OrderResponse> verifyPayment(@Valid @RequestBody PaymentVerificationRequest request) {
     try {
         boolean isAuthentic = razorpayService.verifyPaymentSignature(
             request.getRazorpay_order_id(),
             request.getRazorpay_payment_id(),
             request.getRazorpay_signature()
         );

         if (isAuthentic) {
             // Payment is authentic.
             // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
             // IMPORTANT: Your actual business logic goes here!
             // 1. Fetch the order details from your database using razorpay_order_id.
             // 2. Mark the order as 'paid', 'completed', or update its status.
             // 3. Clear the user's cart in your database.
             // 4. Create an entry in your orders table.
             // 5. Send confirmation emails/SMS to the customer.
             // Example:
             // User currentUser = securityService.getCurrentUser(); // Get authenticated user
             // Order savedOrder = orderService.updateOrderStatus(request.getRazorpay_order_id(), "PAID", request.getRazorpay_payment_id());
             // cartService.clearUserCart(currentUser.getId());
             // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

             System.out.println("Payment successful and verified for Order ID: " + request.getRazorpay_order_id());
             return ResponseEntity.ok(new OrderResponse(true, "Payment verified successfully!"));
         } else {
             System.err.println("Payment verification failed: Invalid signature for Order ID: " + request.getRazorpay_order_id());
             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                 .body(new OrderResponse(false, "Payment verification failed: Invalid signature!"));
         }
     } catch (Exception e) {
         System.err.println("Error verifying payment: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
             .body(new OrderResponse(false, "Error during payment verification: " + e.getMessage()));
     }
 }
}
