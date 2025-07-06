package com.ecomm.app.services;




import com.ecomm.app.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
@Data
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String email;
    private String password;
    private String fullname; // Include necessary fields from your User entity
    private String phone;
    private String address;

    private Collection<? extends GrantedAuthority> authorities;

    // Static method to build UserDetailsImpl from your User entity
    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER")); // Or map roles from user
        // If your User entity has actual roles, map them:
        // List<GrantedAuthority> authorities = user.getRoles().stream()
        //         .map(role -> new SimpleGrantedAuthority(role.getName().name()))
        //         .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getFullname(),
                user.getPhone(),
                user.getAddress(),
                authorities);
    }

    // --- UserDetails Interface Implementations ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Often email is used as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Add a method to get the User entity if needed, or simply expose the fields
    // public User getUser() {
    //    return new User(id, email, password, fullname, phone, address, createdAt); // Be careful with password
    // }
}