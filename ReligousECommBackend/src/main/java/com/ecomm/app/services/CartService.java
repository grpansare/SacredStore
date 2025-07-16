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

    // This method is for INCREMENTING the quantity or adding a new item
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
            // Keep this logic for adding to existing quantity
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

    // *** NEW METHOD for explicitly SETTING the quantity of a cart item ***
    public Cart setCartItemQuantity(String username, Long productId, int quantity) {
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
            if (quantity <= 0) {
                // If quantity is 0 or less, remove the item
                cart.getItems().remove(existingItem.get());
                cartItemRepo.delete(existingItem.get());
            } else {
                // Set the quantity directly
                existingItem.get().setQuantity(quantity);
            }
        } else {
            // Only add a new item if the quantity is positive
            if (quantity > 0) {
                CartItem newItem = new CartItem();
                newItem.setCart(cart);
                newItem.setProduct(product);
                newItem.setQuantity(quantity);
                cart.getItems().add(newItem);
            }
        }
        return cartRepo.save(cart);
    }


    public Cart getCartByUsername(String username) {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getCart();
    }
    
    public Cart updateQuantity(String username, Long productId, int quantity) {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Cart cart = user.getCart();
        if (cart == null) throw new RuntimeException("Cart not found");

        CartItem item = cart.getItems().stream()
            .filter(ci -> ci.getProduct().getId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepo.delete(item);
        } else {
            item.setQuantity(quantity);
        }

        return cartRepo.save(cart);
    }
    
    public Cart removeItem(String username, Long productId) {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Cart cart = user.getCart();
        if (cart == null) throw new RuntimeException("Cart not found");

        CartItem item = cart.getItems().stream()
            .filter(ci -> ci.getProduct().getId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.getItems().remove(item);
        cartItemRepo.delete(item);

        return cartRepo.save(cart);
    }

    public void clearCart(String username) {
        User user = userRepo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Cart cart = user.getCart();
        if (cart != null) {
            cartItemRepo.deleteAll(cart.getItems());
            cart.getItems().clear();
            cartRepo.save(cart);
        }
    }
}