package com.ecomm.app.dtos;







import com.ecomm.app.enums.*;
import com.ecomm.app.models.Address;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOrderResponse {

	private String id;
    private Long userId;
    private List<OrderItemDto> items; // Can use OrderItemDTO for simplicity
    private double totalAmount;
    private Address shippingAddress;
    private PaymentMethod paymentMethod;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private String razorpayPaymentId; // Only if Razorpay
}