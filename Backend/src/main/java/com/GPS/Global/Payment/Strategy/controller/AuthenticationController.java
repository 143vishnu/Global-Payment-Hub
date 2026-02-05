package com.GPS.Global.Payment.Strategy.controller;

import com.GPS.Global.Payment.Strategy.model.dto.LoginRequest;
import com.GPS.Global.Payment.Strategy.model.dto.LoginResponse;
import com.GPS.Global.Payment.Strategy.model.entity.User;
import com.GPS.Global.Payment.Strategy.repository.UserRepository;
import com.GPS.Global.Payment.Strategy.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUsername());
        
        // Initialize default users if database is empty
        initializeDefaultUsersIfNeeded();
        
        try {
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));

            if (!user.getEnabled()) {
                throw new RuntimeException("Account is disabled");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            String jwtToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

            LoginResponse.UserDTO userDTO = LoginResponse.UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getRole())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .build();

            LoginResponse response = LoginResponse.builder()
                    .jwtToken(jwtToken)
                    .refreshToken(refreshToken)
                    .user(userDTO)
                    .build();

            log.info("Login successful for user: {}", user.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (jwtUtil.validateToken(refreshToken, username)) {
                String newJwtToken = jwtUtil.generateToken(user.getUsername(), user.getRole());
                
                Map<String, String> response = new HashMap<>();
                response.put("jwtToken", newJwtToken);
                response.put("refreshToken", refreshToken);
                
                return ResponseEntity.ok(response);
            }
            
            throw new RuntimeException("Invalid refresh token");
            
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid refresh token"));
        }
    }
    
    private synchronized void initializeDefaultUsersIfNeeded() {
        try {
            if (userRepository.count() == 0) {
                log.info("=== DATABASE IS EMPTY - INITIALIZING DEFAULT USERS ===");
                
                // Admin User
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole("ADMIN");
                admin.setFullName("System Administrator");
                admin.setEmail("admin@gps.com");
                admin.setEnabled(true);
                userRepository.save(admin);
                log.info("✓ Created admin user: admin/admin");

                // Operations User
                User opsUser = new User();
                opsUser.setUsername("opsuser");
                opsUser.setPassword(passwordEncoder.encode("password"));
                opsUser.setRole("OPS_USER");
                opsUser.setFullName("Operations User");
                opsUser.setEmail("ops@gps.com");
                opsUser.setEnabled(true);
                userRepository.save(opsUser);
                log.info("✓ Created ops user: opsuser/password");

                // Business User
                User businessUser = new User();
                businessUser.setUsername("business");
                businessUser.setPassword(passwordEncoder.encode("password"));
                businessUser.setRole("BUSINESS_USER");
                businessUser.setFullName("Business User");
                businessUser.setEmail("business@gps.com");
                businessUser.setEnabled(true);
                userRepository.save(businessUser);
                log.info("✓ Created business user: business/password");

                log.info("");
                log.info("=========================================");
                log.info("   DEFAULT LOGIN CREDENTIALS");
                log.info("=========================================");
                log.info("  Admin      : admin / admin");
                log.info("  Ops User   : opsuser / password");
                log.info("  Business   : business / password");
                log.info("=========================================");
                log.info("");
            }
        } catch (Exception e) {
            log.warn("Could not initialize users (may already exist): {}", e.getMessage());
        }
    }
}
