package com.ecomm.app.services;




import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Keep this exception
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecomm.app.models.User;
import com.ecomm.app.repo.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { // Parameter changed to email
        User user = userRepository.findByEmail(email) // Changed to findByEmail
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email)); // Message updated

        return UserDetailsImpl.build(user);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> getUserProfile(Long userId) {
        return userRepository.findById(userId);
    }

    @Transactional
    public User updateUserProfile(Long userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        existingUser.setFullname(updatedUser.getFullname());
        existingUser.setPhone(updatedUser.getPhone());
//        existingUser.setAddress(updatedUser.getAddress());

        return userRepository.save(existingUser);
    }
	public Optional<User> getUserById(Long id) {
		// TODO Auto-generated method stub
		return userRepository.findById(id)
                	;
	}
}