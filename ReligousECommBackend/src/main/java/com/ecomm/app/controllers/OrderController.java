package com.ecomm.app.controllers;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecomm.app.dtos.PlaceOrderRequest;
import com.ecomm.app.dtos.UserOrderResponse;
import com.ecomm.app.enums.PaymentMethod;
import com.ecomm.app.models.Order;
import com.ecomm.app.services.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PreAuthorize("hasRole('USER')") // Only authenticated users can place orders
    @PostMapping("/place-razorpay-order")
    public ResponseEntity<UserOrderResponse> placeRazorpayOrder(@RequestBody PlaceOrderRequest request, Authentication authentication) {
        // Ensure the userId in the request matches the authenticated user's ID
//        if (!request.getUserId().equals(authentication.get)) { // authentication.getName() typically returns userId or username
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
    	
    	System.out.println(authentication.getName()+" "+request.getUserId());

        // The Razorpay payment should have been verified by now on the backend.
        // This endpoint's role is to finalize the order creation in your DB.
        request.setPaymentMethod(PaymentMethod.RAZORPAY);
        UserOrderResponse response = orderService.placeOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('USER')") // Only authenticated users can place COD orders
    @PostMapping("/place-cod-order")
    public ResponseEntity<UserOrderResponse> placeCodOrder(@RequestBody PlaceOrderRequest request, Authentication authentication) {
        // Ensure the userId in the request matches the authenticated user's ID
       

        request.setPaymentMethod(PaymentMethod.COD);
        UserOrderResponse response = orderService.placeOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/{orderId}")
    public ResponseEntity<UserOrderResponse> getOrderDetails(@PathVariable String orderId, Authentication authentication) {
        UserOrderResponse order = orderService.getOrderById(orderId);

        // Security check: Ensure user can only view their own orders unless they are ADMIN
        if (!order.getUserId().equals(authentication.getName()) && !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(order);
    }
    
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getOrders/{userid}")
    // *** MODIFIED RETURN TYPE: Now returns List<UserOrderResponse> ***
    public ResponseEntity<List<UserOrderResponse>> getUserOrders(@PathVariable Long userid) {
        List<UserOrderResponse> orders = orderService.getByUser(userid); // Now gets List<UserOrderResponse>
        System.out.println(orders);
        return new ResponseEntity<>(orders, HttpStatus.OK); // Returns List<UserOrderResponse>
    }

    // You could add endpoints for /api/orders/my-orders to fetch all orders for the logged-in user
}
