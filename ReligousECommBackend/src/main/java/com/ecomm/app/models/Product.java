package com.ecomm.app.models;



import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data; 
@Entity
@Data 
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private double price;
    private double originalPrice; // New field
    private int stock;
    private String imageUrl; // To store the URL/path of the image
    private String description;
    private double rating;
    
    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<CartItem> cartItems;

}