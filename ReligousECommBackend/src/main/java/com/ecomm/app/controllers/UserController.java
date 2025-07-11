package com.ecomm.app.controllers;





import com.ecomm.app.dtos.UserDto;
import com.ecomm.app.models.User;

import com.ecomm.app.services.UserDetailsImpl; // <<<<<< IMPORT UserDetailsImpl
import com.ecomm.app.services.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserDetailsServiceImpl userService;

    // Endpoint to get the current authenticated user's profile
    // URL: GET /api/users/profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')") // Or whatever role your users have
    public ResponseEntity<UserDto> getUserProfile(Authentication authentication) {
        // Correctly cast the principal to UserDetailsImpl
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal(); // <<<<<< THIS IS THE FIX

        // Use the ID from UserDetailsImpl to fetch the actual User entity
        // This ensures you're working with a fresh, managed entity from the DB if needed,
        // although UserDetailsImpl already holds the profile data directly.
        Optional<User> userOptional = userService.getUserById(userDetails.getId()); // Using a new method in UserService

        return userOptional.map(user -> ResponseEntity.ok(UserDto.fromEntity(user)))
                           .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint to update the current authenticated user's profile
    // URL: PUT /api/users/profile
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> updateUserProfile(@RequestBody UserDto userDto, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal(); // <<<<<< FIX HERE TOO

        // Create a temporary User object from DTO for update service
        // Only allow updating certain fields (fullname, phone, address)
        // Ensure you don't update fields like ID or email that are not meant for direct update
        User userToUpdate = new User();
        userToUpdate.setFullname(userDto.getFullname());
        userToUpdate.setPhone(userDto.getPhone());
        userToUpdate.setAddress(userDto.getAddress());
        // Do NOT set ID or sensitive fields like password here directly from DTO

        User updatedUser = userService.updateUserProfile(userDetails.getId(), userToUpdate); // Use ID from principal

        return ResponseEntity.ok(UserDto.fromEntity(updatedUser));
    }
}