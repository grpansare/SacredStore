package com.ecomm.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;

 // <-- This is the package declaration


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecomm.app.models.Order;

@Repository // Marks this interface as a Spring repository component
public interface OrderRepository extends JpaRepository<Order, String> {
    // JpaRepository<T, ID> where T is the entity type (Order)
    // and ID is the type of its primary key (String, as Order.id is String UUID)

    // Spring Data JPA automatically provides methods like:
    // save(Order order)
    // findById(String id)
    // findAll()
    // delete(Order order)
    // etc.

    // You can add custom query methods here if needed, for example:
    // List<Order> findByUserId(String userId);
    // List<Order> findByStatus(OrderStatus status);
    // @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    // List<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
