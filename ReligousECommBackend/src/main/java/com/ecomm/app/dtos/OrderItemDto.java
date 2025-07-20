package com.ecomm.app.dtos;

import lombok.Data;

@Data
public class OrderItemDto {
	private String id;
    private String productId;
    private String name;
    private double price;
    private int quantity;
    private String imageUrl;
    private String category;
}