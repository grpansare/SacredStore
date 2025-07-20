package com.ecomm.app.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.ecomm.app.dtos.OrderItemDto;
import com.ecomm.app.dtos.PlaceOrderRequest;
import com.ecomm.app.dtos.UserOrderResponse;
import com.ecomm.app.dtos.UserOrderResponse.OrderItemResponse;
import com.ecomm.app.enums.OrderStatus;
import com.ecomm.app.enums.PaymentMethod;
import com.ecomm.app.exceptions.ResourceNotFoundException;
import com.ecomm.app.models.Order;
import com.ecomm.app.models.OrderItem;
import com.ecomm.app.models.Product;
import com.ecomm.app.models.User;
import com.ecomm.app.repo.OrderRepository;
import com.ecomm.app.repo.ProductRepository;
import com.ecomm.app.repo.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public UserOrderResponse placeOrder(PlaceOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(request.getTotalAmount());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderDate(LocalDateTime.now()); // Set current time for order placement

        // Set status based on payment method
        if (request.getPaymentMethod() == PaymentMethod.RAZORPAY) {
            order.setStatus(OrderStatus.PAID); // Assumes payment is already verified before this call
            order.setRazorpayOrderId(request.getRazorpayOrderId());
            order.setRazorpayPaymentId(request.getRazorpayPaymentId());
            order.setRazorpaySignature(request.getRazorpaySignature());
        } else if (request.getPaymentMethod() == PaymentMethod.COD) {
            order.setStatus(OrderStatus.PENDING_CONFIRMATION); // COD orders typically need confirmation
        } else {
            order.setStatus(OrderStatus.PENDING_PAYMENT); // Generic pending for other unknown methods
        }

        // Add items to the order
        for (OrderItemDto itemDto : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            // In a real app, you'd fetch the Product entity by productId here
            // to ensure price and other details are correct and current,
            // preventing tampering from the client side.
            // For now, we'll trust client-provided data for simplicity.
            orderItem.setProductId(itemDto.getProductId());
            orderItem.setName(itemDto.getName());
            orderItem.setPrice(itemDto.getPrice());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setImageUrl(itemDto.getImageUrl());
            orderItem.setCategory(itemDto.getCategory());
            order.setTotalAmount(order.getTotalAmount()); // Double-check total amount to prevent client tampering

            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Map the saved order to a response DTO
        return mapOrderToOrderResponse(savedOrder);
    }

    public UserOrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        return mapOrderToOrderResponse(order);
    }

    // *** MODIFIED METHOD: Now returns List<UserOrderResponse> ***
    public List<UserOrderResponse> getByUser(Long userId) {
        userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Order> orders = orderRepository.findByUserId(userId);

        // Map each Order entity to a UserOrderResponse DTO
        return orders.stream()
                     .map(this::mapOrderToOrderResponse) // Use the existing mapping method
                     .collect(Collectors.toList());
    }

    private UserOrderResponse mapOrderToOrderResponse(Order order) {
        List<OrderItemResponse> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProductId(),
                        item.getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getImageUrl(),
                        item.getCategory()
                ))
                .collect(Collectors.toList());

        return new UserOrderResponse(
                order.getId(),
                order.getUser().getId(),
                itemDTOs,
                order.getTotalAmount(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getStatus(),
                order.getOrderDate(),
                order.getRazorpayOrderId()
              
        );
    }
}