package com.ecomm.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecomm.app.models.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {}