package com.ecomm.app.enums;

public enum OrderStatus {
    PENDING_PAYMENT,     // For Razorpay orders initiated but not yet paid (or failed)
    PAID,                // Razorpay payment successful and confirmed
    PENDING_CONFIRMATION, // For COD orders, awaiting admin review/acceptance
    PROCESSING,          // Order is being prepared (items picked, packed)
    SHIPPED,             // Order has left the warehouse/seller
    DELIVERED,           // Order has been successfully delivered to the customer
    CANCELLED,           // Order cancelled by customer or admin
    REFUNDED             // Order was paid for, but payment was refunded
}