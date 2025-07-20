package com.ecomm.app.models;



import java.util.Collection;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

@Data
public class User implements UserDetails  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private String fullname;
    
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Store hashed password

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    private String phone; // Optional
 
    
    
    @OneToOne(mappedBy = "user")
    @JsonManagedReference
    private Cart cart;
    
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAddress> addresses;
    
    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

 
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For simplicity, let's assume all users have a "ROLE_USER"
        // In a real app, you'd manage roles (e.g., enum, separate entity)
        return Collections.singletonList(() -> "ROLE_USER");
    }


	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return null;
	}
}
