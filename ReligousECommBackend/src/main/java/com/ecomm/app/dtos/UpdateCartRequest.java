package com.ecomm.app.dtos;

import lombok.Data;

@Data
public class UpdateCartRequest {
    private Long productId;
    private int quantity;

   
}
