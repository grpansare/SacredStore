package com.ecomm.app.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecomm.app.TokenRefreshException;
import com.ecomm.app.models.RefreshToken;
import com.ecomm.app.models.User;
import com.ecomm.app.repo.RefreshTokenRepository;
import com.ecomm.app.repo.UserRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Value("${jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional // Ensure the operation is atomic
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                          .orElseThrow(() -> new RuntimeException("User not found for id: " + userId)); // Or more specific custom exception

  
        Optional<RefreshToken> existingRefreshTokenOptional = refreshTokenRepository.findByUser(user);
     

        RefreshToken refreshToken;
        if (existingRefreshTokenOptional.isPresent()) {
         
            refreshToken = existingRefreshTokenOptional.get();
            refreshToken.setToken(UUID.randomUUID().toString()); // Generate a new unique token string
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
    
        } else {
            // 3. If it doesn't exist (first login), create a new one
            refreshToken = new RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        }

      
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}
