package com.ecomm.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecomm.app.dtos.CartRequest;
import com.ecomm.app.models.Cart;
import com.ecomm.app.models.User;
import com.ecomm.app.repo.UserRepository;
import com.ecomm.app.services.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired private CartService cartService;
    
    @Autowired UserRepository userRepo;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartRequest request,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Cart updatedCart = cartService.addToCart(userDetails.getUsername(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Cart cart = cartService.getCartByUsername(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

}
