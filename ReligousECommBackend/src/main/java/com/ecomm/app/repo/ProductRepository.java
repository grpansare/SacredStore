package com.ecomm.app.repo;




import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecomm.app.models.Product;

import java.util.List;

@Repository // Marks this interface as a Spring repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // JpaRepository provides:
    // save(), findById(), findAll(), deleteById(), etc.

    // You can define custom query methods here if needed, e.g.:
    List<Product> findByCategory(String category);
  
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findByNameContainingIgnoreCaseAndCategoryIgnoreCase(String name, String category);

	List<Product> findByNameContainingIgnoreCase(String name);

}