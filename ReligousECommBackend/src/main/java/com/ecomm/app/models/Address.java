package com.ecomm.app.models;


import jakarta.persistence.Embeddable; // Marks this class as embeddable
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable // Indicates that instances of this class will be stored as an embedded component
@Data // From Lombok, generates getters, setters, equals, hashCode, toString
@NoArgsConstructor // From Lombok, generates no-arg constructor
@AllArgsConstructor // From Lombok, generates constructor with all fields
public class Address {
    private String fullName;
    private String addressLine1;
    private String addressLine2; // Optional, for apartment/suite number etc.
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
