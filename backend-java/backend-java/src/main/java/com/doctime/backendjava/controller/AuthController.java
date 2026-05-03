package com.doctime.backendjava.controller;

import com.doctime.backendjava.dto.LoginRequest;
import com.doctime.backendjava.dto.RegisterRequest;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getName() == null || request.getEmail() == null ||
                request.getPassword() == null || request.getRole() == null ||
                request.getName().isBlank() || request.getEmail().isBlank() ||
                request.getPassword().isBlank() || request.getRole().isBlank()) {

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "All fields are required");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Email already registered");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        Optional<User> optionalUser = userRepository.findByEmailAndRole(
                request.getEmail(),
                request.getRole()
        );

        if (optionalUser.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(request.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }

        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole());

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}