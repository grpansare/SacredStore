package com.ecomm.app.models;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

}