package com.ecomm.app.dtos;



import lombok.Data;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.ecomm.app.models.UserAddress;
import com.ecomm.app.models.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String fullname;
    private String phone;
    private List<UserAddress> address;
    

    // Static method to convert User entity to UserDto
    public static UserDto fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getFullname(),
            user.getPhone(),
            user.getAddresses()
        
        );
    }
}