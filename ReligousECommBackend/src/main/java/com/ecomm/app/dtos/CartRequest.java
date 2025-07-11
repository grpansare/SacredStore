package com.ecomm.app.dtos;

import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private int quantity;

}
