package com.ecomm.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecomm.app.models.Product;
import com.ecomm.app.repo.ProductRepository;
import com.ecomm.app.services.ProductService;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;
    
    
    @Autowired
    private ProductRepository productRepository;

    // GET all or filtered products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        logger.info("Fetching all products. name={}, category={}", name, category);
        List<Product> products = productService.findProducts(name, category);
        logger.debug("Found {} products", products.size());
        return ResponseEntity.ok(products);
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("Fetching product by ID: {}", id);
        return productService.getProductById(id)
                .map(product -> {
                    logger.debug("Product found: {}", product.getName());
                    return new ResponseEntity<>(product, HttpStatus.OK);
                })
                .orElseGet(() -> {
                    logger.warn("Product not found with ID: {}", id);
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                });
    }

    // POST new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        logger.info("Creating new product: {}", product.getName());
        Product createdProduct = productService.createProduct(product);
        logger.debug("Created product ID: {}", createdProduct.getId());
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    // PUT update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        logger.info("Updating product ID: {}", id);
        Product updatedProduct = productService.updateProduct(id, product);
        if (updatedProduct != null) {
            logger.debug("Product updated successfully: {}", updatedProduct.getName());
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        }
        logger.warn("Product update failed, ID not found: {}", id);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product ID: {}", id);
        if (productService.deleteProduct(id)) {
            logger.debug("Product deleted successfully: {}", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        logger.warn("Product delete failed, ID not found: {}", id);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Search by name
   

    // Get by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getByCategory(@PathVariable String category) {
        logger.info("Fetching products by category: {}", category);
        try {
            List<Product> products = productService.getByCategory(category);
            logger.debug("Found {} products in category '{}'", products.size(), category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products by category '{}': {}", category, e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getProductSuggestions(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        if (query == null || query.trim().length() < 2) {
            // Return empty list if query is null or too short (less than 2 characters)
            return ResponseEntity.ok(List.of());
        }

        // Use the repository to find products matching the query
        List<Product> matchingProducts = productRepository.findByNameContainingIgnoreCase(query.trim());

        // Extract just the names and apply limit
        List<String> suggestions = matchingProducts.stream()
                .map(Product::getName) // Get only the name of the product
                .limit(limit)         // Apply the limit
                .collect(Collectors.toList());

        return ResponseEntity.ok(suggestions);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(name = "q", required = false) String query) {

        if (query == null || query.trim().isEmpty()) {
            // Return Bad Request if query is empty or not provided
            // Or, return all products, depending on desired behavior for empty search
            // For now, let's return an empty list for an empty query
            return ResponseEntity.ok(List.of());
        }

        List<Product> products = productRepository.findByNameContainingIgnoreCase(query.trim());

        if (products.isEmpty()) {
            // Optionally, return 404 if no products are found, or just an empty 200 list
            // For search, an empty 200 list is usually fine, so the frontend can display "No results"
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(products);
    }
}
