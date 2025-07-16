package com.ecomm.app.models;

 // <-- This is the package declaration

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "order_items") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class OrderItem {
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.UUID) // Generates a UUID for the ID
    private String id;

    @ManyToOne(fetch = FetchType.LAZY) // Many order items belong to one order
    @JoinColumn(name = "order_id", nullable = false) // Foreign key column linking to the Order
    private Order order; // The parent Order this item belongs to

    // In a real application, 'productId' would typically be a foreign key
    // to a 'Product' entity. For simplicity, we're just storing product details directly.
    private String productId;
    private String name;
    private double price;
    private int quantity;
    private String imageUrl; // For displaying in order history/details
    private String category; // For displaying in order history/details
}