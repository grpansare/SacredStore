package com.ecomm.app.services;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecomm.app.models.Product;
import com.ecomm.app.repo.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service // Marks this class as a Spring service component
public class ProductService {

    @Autowired // Injects ProductRepository instance
    private ProductRepository productRepository;

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    
    
    public List<Product> findProducts(String name, String category) {
        boolean hasName = name != null && !name.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty();

        if (hasName && hasCategory) {
            return productRepository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(name, category);
        } else if (hasName) {
            return productRepository.findByNameContainingIgnoreCase(name);
        } else if (hasCategory) {
            return productRepository.findByCategoryIgnoreCase(category);
        } else {
            // If no filters are provided, return all products
            return productRepository.findAll();
        }
    }
    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Create a new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Update an existing product
    public Product updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setCategory(productDetails.getCategory());
                    product.setPrice(productDetails.getPrice());
                    product.setStock(productDetails.getStock());
                    product.setRating(productDetails.getRating());
                    product.setImageUrl(productDetails.getImageUrl());
                    product.setDescription(productDetails.getDescription());
                    return productRepository.save(product);
                }).orElse(null); // Or throw an exception
    }

    // Delete a product
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false; // Product not found
    }

    // Search products by name (example of custom service method)
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<Product> getByCategory(String catergory){
    	return productRepository.findByCategory(catergory);
    	
    }
}