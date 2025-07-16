package com.ecomm.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // Not used in provided code, can be removed
import org.springframework.web.bind.annotation.RestController;

import com.ecomm.app.dtos.CartRequest;
import com.ecomm.app.dtos.UpdateCartRequest;
import com.ecomm.app.models.Cart;
import com.ecomm.app.models.User; // Not directly used in controller, can be removed
import com.ecomm.app.repo.UserRepository; // Not directly used in controller, can be removed
import com.ecomm.app.services.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired private CartService cartService;
    
    // @Autowired UserRepository userRepo; // Not used directly in controller, can be removed

    @PostMapping("/add") // This remains for "incrementing" a quantity
    public ResponseEntity<Cart> addToCart(@RequestBody CartRequest request,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Cart updatedCart = cartService.addToCart(userDetails.getUsername(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/set-item-quantity") // *** NEW ENDPOINT for setting total quantity ***
    public ResponseEntity<Cart> setItemQuantity(@RequestBody CartRequest request,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        Cart updatedCart = cartService.setCartItemQuantity(userDetails.getUsername(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Cart cart = cartService.getCartByUsername(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update") // This should likely use setCartItemQuantity in CartService
    public ResponseEntity<Cart> updateCartItem(@RequestBody UpdateCartRequest request,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        // You might want to change this to call cartService.setCartItemQuantity
        // if this endpoint is meant to set the exact quantity.
        // As per your current CartService, updateQuantity already sets the quantity.
        Cart updatedCart = cartService.updateQuantity(userDetails.getUsername(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }
    
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long productId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        Cart updatedCart = cartService.removeItem(userDetails.getUsername(), productId);
        return ResponseEntity.ok(updatedCart);
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}