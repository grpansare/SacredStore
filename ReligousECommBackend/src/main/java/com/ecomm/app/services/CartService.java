package com.ecomm.app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ecomm.app.models.Cart;
import com.ecomm.app.models.CartItem;
import com.ecomm.app.models.Product;
import com.ecomm.app.models.User;
import com.ecomm.app.repo.CartItemRepository;
import com.ecomm.app.repo.CartRepository;
import com.ecomm.app.repo.ProductRepository;
import com.ecomm.app.repo.UserRepository;

@Service
public class CartService {

    @Autowired private UserRepository userRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private CartRepository cartRepo;
    @Autowired private CartItemRepository cartItemRepo;

    public Cart addToCart(String username, Long productId, int quantity) {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepo.save(cart);
            user.setCart(cart);
            userRepo.save(user);
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepo.save(cart);
    }

    public Cart getCartByUsername(String username) {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getCart();
    }

}
