package com.ecomm.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecomm.app.models.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {}