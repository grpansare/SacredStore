package com.ecomm.app.controllers;



import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ecomm.app.dtos.UserDto;
import com.ecomm.app.models.User;
import com.ecomm.app.services.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserDetailsServiceImpl userService;

    // Endpoint to get the current authenticated user's profile
    // URL: GET /api/users/profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')") // Only authenticated users with ROLE_USER can access
    public ResponseEntity<UserDto> getUserProfile(Authentication authentication) {
        // The 'authentication' object contains the principal (our UserDetails implementation)
        // In our case, the principal is the User entity itself because User implements UserDetails
        User currentUser = (User) authentication.getPrincipal();

        // Fetch the user from the database to ensure we have the latest data
        // and to potentially detach it from the session if needed for DTO conversion.
        // Although in this simple case, currentUser already has all data
        // we convert it to DTO to control what's exposed.
        Optional<User> userOptional = userService.getUserProfile(currentUser.getId());

        return userOptional.map(user -> ResponseEntity.ok(UserDto.fromEntity(user)))
                           .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint to update the current authenticated user's profile
    // URL: PUT /api/users/profile
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> updateUserProfile(@RequestBody UserDto userDto, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        // Create a temporary User object from DTO for update service
        // Only allow updating certain fields (fullname, phone, address)
        User userToUpdate = new User();
        userToUpdate.setFullname(userDto.getFullname());
        userToUpdate.setPhone(userDto.getPhone());
        userToUpdate.setAddress(userDto.getAddress());

        User updatedUser = userService.updateUserProfile(currentUser.getId(), userToUpdate);

        return ResponseEntity.ok(UserDto.fromEntity(updatedUser));
    }
}
