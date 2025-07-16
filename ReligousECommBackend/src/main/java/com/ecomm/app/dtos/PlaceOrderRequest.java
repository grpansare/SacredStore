package com.ecomm.app.dtos;



import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.ecomm.app.enums.PaymentMethod;
import com.ecomm.app.models.Address;

@Data
public class PlaceOrderRequest {
    private Long userId;
    private List<OrderItemDto> items;
    private double totalAmount;
    private Address shippingAddress;
    private PaymentMethod paymentMethod; 
    private LocalDateTime orderDate;

    // Razorpay specific fields (nullable)
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}