package com.digitallibrary.backend.controller;

import com.digitallibrary.backend.dto.AuthResponse;
import com.digitallibrary.backend.dto.LoginRequest;
import com.digitallibrary.backend.dto.SignupRequest;
import com.digitallibrary.backend.entity.User;
import com.digitallibrary.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174",
	    "http://localhost:5175",
	    "http://localhost:5178"
	})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * POST /api/auth/signup
     * Body: { "name": "...", "email": "...", "password": "..." }
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {

        // Reject if this email is already taken.
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("An account with this email already exists");
        }


        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
//        user.setPhone(request.getPhone()); 

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("USER");
        user.setGoogleAccount(false);

        //we hash the plain-text password the
        // user sent us BEFORE it ever touches the database. From
        
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("USER");
        user.setGoogleAccount(false);

        User saved = userRepository.save(user);

        AuthResponse response = new AuthResponse(
                saved.getId(), saved.getName(), saved.getEmail(), saved.getRole()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Body: { "email": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        System.out.println("EMAIL = " + request.getEmail());
        System.out.println("USER FOUND = " + user);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        // passwordEncoder.matches(rawPassword, hashedPassword) hashes
        System.out.println("PASSWORD ENTERED = " + request.getPassword());
        System.out.println("PASSWORD IN DB = " + user.getPassword());
        boolean passwordCorrect = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("PASSWORD MATCH = " + passwordCorrect);
        if (!passwordCorrect) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        // Right now we just confirm login succeeded and return the
        // user's info. JWT
        AuthResponse response = new AuthResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole()
        );
        return ResponseEntity.ok(response);
    }
}