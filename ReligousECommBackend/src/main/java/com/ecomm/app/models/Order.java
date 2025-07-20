package com.ecomm.app.models;

 // <-- This is the package declaration

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.ecomm.app.enums.*;
import com.ecomm.app.models.OrderItem;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders") // Mapped to a database table named "orders"
@Data // From Lombok, generates getters, setters, equals, hashCode, toString
@NoArgsConstructor // From Lombok, generates no-arg constructor
@AllArgsConstructor // From Lombok, generates constructor with all fields
public class Order {
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.UUID) // Generates a UUID for the ID
    private String id;

    @ManyToOne(fetch = FetchType.LAZY) // Many orders to one user
    @JoinColumn(name = "user_id", nullable = false) // Foreign key column
    @JsonIgnore	
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) // One order to many order items
    private List<OrderItem> items = new ArrayList<>();

    private double totalAmount;

    @Embedded // Embeds the Address class fields directly into the Order table
    @AttributeOverrides({
            @AttributeOverride(name = "fullName", column = @Column(name = "shipping_full_name")),
            @AttributeOverride(name = "addressLine1", column = @Column(name = "shipping_address_line1")),
            @AttributeOverride(name = "addressLine2", column = @Column(name = "shipping_address_line2")),
            @AttributeOverride(name = "city", column = @Column(name = "shipping_city")),
            @AttributeOverride(name = "state", column = @Column(name = "shipping_state")),
            @AttributeOverride(name = "zipCode", column = @Column(name = "shipping_zip_code")),
            @AttributeOverride(name = "country", column = @Column(name = "shipping_country"))
    })
    private Address shippingAddress;

    @Enumerated(EnumType.STRING) // Stores enum as its string name in DB
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING) // Stores enum as its string name in DB
    private OrderStatus status;

    private LocalDateTime orderDate;

    // Razorpay specific fields (nullable for COD orders)
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    // Helper methods for managing order items
    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeOrderItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}